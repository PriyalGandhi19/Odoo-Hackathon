from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Q, Avg, Count, Case, When, IntegerField
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.utils import timezone
from .models import *
from .forms import *
import json

def home(request):
    """Home page with platform overview"""
    total_users = User.objects.count()
    total_skills = Skill.objects.count()
    total_swaps = SwapRequest.objects.filter(status='completed').count()
    recent_swaps = SwapRequest.objects.filter(status='completed').order_by('-updated_at')[:5]
    popular_skills = Skill.objects.annotate(
        usage_count=Count('userskill')
    ).order_by('-usage_count')[:8]
    
    context = {
        'total_users': total_users,
        'total_skills': total_skills,
        'total_swaps': total_swaps,
        'recent_swaps': recent_swaps,
        'popular_skills': popular_skills,
    }
    return render(request, 'core/home.html', context)

def register(request):
    """User registration"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create user profile
            UserProfile.objects.create(user=user)
            login(request, user)
            messages.success(request, 'Registration successful! Welcome to SkillSwap!')
            return redirect('dashboard')
    else:
        form = UserRegistrationForm()
    return render(request, 'core/register.html', {'form': form})

@login_required
def dashboard(request):
    """User dashboard with personalized content"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    # Get user's skills
    offered_skills = UserSkill.objects.filter(user=request.user, skill_type='offered')
    wanted_skills = UserSkill.objects.filter(user=request.user, skill_type='wanted')
    
    # Get recent swap requests
    recent_requests = SwapRequest.objects.filter(
        Q(requester=request.user) | Q(receiver=request.user)
    ).order_by('-created_at')[:5]
    
    # Get skill matches
    matches = []
    for wanted_skill in wanted_skills:
        potential_teachers = UserSkill.objects.filter(
            skill=wanted_skill.skill,
            skill_type='offered'
        ).exclude(user=request.user)[:3]
        if potential_teachers:
            matches.extend(potential_teachers)
    
    # Get user badges
    user_badges = UserBadge.objects.filter(user=request.user).select_related('badge')
    
    # Get admin messages
    admin_messages = AdminMessage.objects.filter(is_active=True)[:3]
    
    # Get progress tracking
    progress_items = SkillProgress.objects.filter(user=request.user).select_related('skill')
    
    context = {
        'profile': profile,
        'offered_skills': offered_skills,
        'wanted_skills': wanted_skills,
        'recent_requests': recent_requests,
        'matches': matches[:6],
        'user_badges': user_badges,
        'admin_messages': admin_messages,
        'progress_items': progress_items,
    }
    return render(request, 'core/dashboard.html', context)

@login_required
def profile(request):
    """View user profile"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    offered_skills = UserSkill.objects.filter(user=request.user, skill_type='offered')
    wanted_skills = UserSkill.objects.filter(user=request.user, skill_type='wanted')
    ratings = Rating.objects.filter(rated_user=request.user).order_by('-created_at')
    badges = UserBadge.objects.filter(user=request.user).select_related('badge')
    
    context = {
        'profile': profile,
        'offered_skills': offered_skills,
        'wanted_skills': wanted_skills,
        'ratings': ratings,
        'badges': badges,
    }
    return render(request, 'core/profile.html', context)

@login_required
def edit_profile(request):
    """Edit user profile"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile')
    else:
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=profile)
    
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
    }
    return render(request, 'core/edit_profile.html', context)

def user_profile(request, username):
    """View another user's profile"""
    user = get_object_or_404(User, username=username)
    profile = get_object_or_404(UserProfile, user=user)
    
    if not profile.is_public and request.user != user:
        messages.error(request, 'This profile is private.')
        return redirect('browse_skills')
    
    offered_skills = UserSkill.objects.filter(user=user, skill_type='offered')
    ratings = Rating.objects.filter(rated_user=user).order_by('-created_at')[:5]
    badges = UserBadge.objects.filter(user=user).select_related('badge')
    
    # Calculate distance if both users have location data
    distance = None
    if request.user.is_authenticated:
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        distance = user_profile.get_distance_to(profile)
    
    context = {
        'profile_user': user,
        'profile': profile,
        'offered_skills': offered_skills,
        'ratings': ratings,
        'badges': badges,
        'distance': distance,
    }
    return render(request, 'core/user_profile.html', context)

def browse_skills(request):
    """Browse all skills with filtering"""
    skills = Skill.objects.filter(is_approved=True)
    categories = Skill.CATEGORY_CHOICES
    
    # Filtering
    category = request.GET.get('category')
    search = request.GET.get('search')
    
    if category:
        skills = skills.filter(category=category)
    
    if search:
        skills = skills.filter(
            Q(name__icontains=search) | Q(description__icontains=search)
        )
    
    # Add user counts for each skill
    skills = skills.annotate(
        teachers_count=Count('userskill', filter=Q(userskill__skill_type='offered')),
        learners_count=Count('userskill', filter=Q(userskill__skill_type='wanted'))
    )
    
    # Pagination
    paginator = Paginator(skills, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'current_category': category,
        'search_query': search,
    }
    return render(request, 'core/browse_skills.html', context)

def advanced_search(request):
    """Advanced search with multiple filters"""
    users = User.objects.filter(is_active=True, userprofile__is_public=True).select_related('userprofile')
    
    # Get filter parameters
    skill_name = request.GET.get('skill')
    category = request.GET.get('category')
    location = request.GET.get('location')
    max_distance = request.GET.get('max_distance')
    skill_level = request.GET.get('skill_level')
    availability = request.GET.get('availability')
    min_rating = request.GET.get('min_rating')
    meeting_type = request.GET.get('meeting_type')
    sort_by = request.GET.get('sort_by', 'relevance')
    
    # Apply filters
    if skill_name:
        users = users.filter(
            userskill__skill__name__icontains=skill_name,
            userskill__skill_type='offered'
        ).distinct()
    
    if category:
        users = users.filter(
            userskill__skill__category=category,
            userskill__skill_type='offered'
        ).distinct()
    
    if location:
        users = users.filter(
            Q(userprofile__location__icontains=location) |
            Q(userprofile__city__icontains=location) |
            Q(userprofile__state__icontains=location)
        )
    
    if skill_level:
        users = users.filter(
            userskill__level=skill_level,
            userskill__skill_type='offered'
        ).distinct()
    
    if availability:
        users = users.filter(userprofile__availability=availability)
    
    if min_rating:
        users = users.annotate(
            avg_rating=Avg('received_ratings__rating')
        ).filter(avg_rating__gte=float(min_rating))
    
    # Location-based filtering
    if max_distance and request.user.is_authenticated:
        user_profile = getattr(request.user, 'userprofile', None)
        if user_profile and user_profile.latitude and user_profile.longitude:
            # This is a simplified distance filter - in production you'd use PostGIS
            filtered_users = []
            for user in users:
                if hasattr(user, 'userprofile'):
                    distance = user_profile.get_distance_to(user.userprofile)
                    if distance and distance <= float(max_distance):
                        user.distance = distance
                        filtered_users.append(user)
            users = filtered_users
    
    # Sorting
    if sort_by == 'rating':
        users = users.annotate(avg_rating=Avg('received_ratings__rating')).order_by('-avg_rating')
    elif sort_by == 'distance' and hasattr(request.user, 'userprofile'):
        # Distance sorting would be handled above in location filtering
        pass
    elif sort_by == 'newest':
        users = users.order_by('-userprofile__created_at')
    elif sort_by == 'points':
        users = users.order_by('-userprofile__points')
    
    # Pagination
    if isinstance(users, list):
        # Handle list from distance filtering
        paginator = Paginator(users, 12)
    else:
        paginator = Paginator(users, 12)
    
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get filter options
    categories = Skill.CATEGORY_CHOICES
    skill_levels = UserSkill.LEVEL_CHOICES
    availability_choices = UserProfile.AVAILABILITY_CHOICES
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'skill_levels': skill_levels,
        'availability_choices': availability_choices,
        'filters': {
            'skill': skill_name,
            'category': category,
            'location': location,
            'max_distance': max_distance,
            'skill_level': skill_level,
            'availability': availability,
            'min_rating': min_rating,
            'meeting_type': meeting_type,
            'sort_by': sort_by,
        }
    }
    return render(request, 'core/advanced_search.html', context)

def search_users(request):
    """Search for users by skills"""
    query = request.GET.get('q', '')
    skill_filter = request.GET.get('skill', '')
    location_filter = request.GET.get('location', '')
    
    users = User.objects.filter(is_active=True, userprofile__is_public=True).select_related('userprofile')
    
    if query:
        users = users.filter(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(userprofile__bio__icontains=query)
        )
    
    if skill_filter:
        users = users.filter(
            userskill__skill__name__icontains=skill_filter,
            userskill__skill_type='offered'
        ).distinct()
    
    if location_filter:
        users = users.filter(userprofile__location__icontains=location_filter)
    
    # Pagination
    paginator = Paginator(users, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'query': query,
        'skill_filter': skill_filter,
        'location_filter': location_filter,
    }
    return render(request, 'core/search_users.html', context)

@login_required
def nearby_users(request):
    """Find users nearby based on location"""
    user_profile = getattr(request.user, 'userprofile', None)
    if not user_profile or not user_profile.latitude or not user_profile.longitude:
        messages.warning(request, 'Please update your location in your profile to find nearby users.')
        return redirect('edit_profile')
    
    max_distance = int(request.GET.get('distance', 25))  # Default 25 miles
    skill_filter = request.GET.get('skill', '')
    
    all_users = User.objects.filter(
        is_active=True, 
        userprofile__is_public=True
    ).exclude(id=request.user.id).select_related('userprofile')
    
    if skill_filter:
        all_users = all_users.filter(
            userskill__skill__name__icontains=skill_filter,
            userskill__skill_type='offered'
        ).distinct()
    
    # Calculate distances and filter
    nearby_users = []
    for user in all_users:
        if hasattr(user, 'userprofile'):
            distance = user_profile.get_distance_to(user.userprofile)
            if distance and distance <= max_distance:
                user.distance = distance
                nearby_users.append(user)
    
    # Sort by distance
    nearby_users.sort(key=lambda x: x.distance)
    
    # Pagination
    paginator = Paginator(nearby_users, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'max_distance': max_distance,
        'skill_filter': skill_filter,
        'user_location': f"{user_profile.city}, {user_profile.state}" if user_profile.city else user_profile.location,
    }
    return render(request, 'core/nearby_users.html', context)

@login_required
def add_skill(request):
    """Add a new skill"""
    if request.method == 'POST':
        form = SkillForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Skill added successfully!')
            return redirect('browse_skills')
    else:
        form = SkillForm()
    
    return render(request, 'core/add_skill.html', {'form': form})

@login_required
def manage_skills(request):
    """Manage user's skills"""
    if request.method == 'POST':
        form = UserSkillForm(request.POST)
        if form.is_valid():
            user_skill = form.save(commit=False)
            user_skill.user = request.user
            try:
                user_skill.save()
                messages.success(request, f'Skill "{user_skill.skill.name}" added to your {user_skill.skill_type} skills!')
            except:
                messages.error(request, 'You already have this skill in your list.')
            return redirect('manage_skills')
    else:
        form = UserSkillForm()
    
    offered_skills = UserSkill.objects.filter(user=request.user, skill_type='offered')
    wanted_skills = UserSkill.objects.filter(user=request.user, skill_type='wanted')
    
    context = {
        'form': form,
        'offered_skills': offered_skills,
        'wanted_skills': wanted_skills,
    }
    return render(request, 'core/manage_skills.html', context)

@login_required
def delete_user_skill(request, skill_id):
    """Delete a user skill"""
    user_skill = get_object_or_404(UserSkill, id=skill_id, user=request.user)
    user_skill.delete()
    messages.success(request, 'Skill removed successfully!')
    return redirect('manage_skills')

@login_required
def create_swap_request(request, user_id, skill_id):
    """Create a swap request"""
    receiver = get_object_or_404(User, id=user_id)
    requested_skill = get_object_or_404(Skill, id=skill_id)
    
    # Check if receiver offers this skill
    if not UserSkill.objects.filter(user=receiver, skill=requested_skill, skill_type='offered').exists():
        messages.error(request, 'This user does not offer the requested skill.')
        return redirect('browse_skills')
    
    if request.method == 'POST':
        form = SwapRequestForm(request.POST, user=request.user)
        if form.is_valid():
            swap_request = form.save(commit=False)
            swap_request.requester = request.user
            swap_request.receiver = receiver
            swap_request.requested_skill = requested_skill
            swap_request.save()
            messages.success(request, 'Swap request sent successfully!')
            return redirect('swap_requests')
    else:
        form = SwapRequestForm(user=request.user)
    
    context = {
        'form': form,
        'receiver': receiver,
        'requested_skill': requested_skill,
    }
    return render(request, 'core/create_swap_request.html', context)

@login_required
def swap_requests(request):
    """View all swap requests"""
    sent_requests = SwapRequest.objects.filter(requester=request.user).order_by('-created_at')
    received_requests = SwapRequest.objects.filter(receiver=request.user).order_by('-created_at')
    
    context = {
        'sent_requests': sent_requests,
        'received_requests': received_requests,
    }
    return render(request, 'core/swap_requests.html', context)

@login_required
def respond_to_swap(request, request_id):
    """Respond to a swap request"""
    swap_request = get_object_or_404(SwapRequest, id=request_id, receiver=request.user)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'accept':
            swap_request.status = 'accepted'
            messages.success(request, 'Swap request accepted!')
        elif action == 'decline':
            swap_request.status = 'declined'
            messages.info(request, 'Swap request declined.')
        
        swap_request.save()
        return redirect('swap_requests')
    
    return render(request, 'core/respond_swap.html', {'swap_request': swap_request})

@login_required
def complete_swap(request, request_id):
    """Mark a swap as completed"""
    swap_request = get_object_or_404(
        SwapRequest, 
        id=request_id, 
        status='accepted'
    )
    
    # Only participants can mark as completed
    if request.user not in [swap_request.requester, swap_request.receiver]:
        messages.error(request, 'You are not authorized to complete this swap.')
        return redirect('swap_requests')
    
    swap_request.status = 'completed'
    swap_request.save()
    
    # Award points
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    profile.points += 10
    profile.save()
    
    messages.success(request, 'Swap marked as completed! You earned 10 points.')
    return redirect('swap_requests')

@login_required
def rate_swap(request, request_id):
    """Rate a completed swap"""
    swap_request = get_object_or_404(SwapRequest, id=request_id, status='completed')
    
    # Determine who to rate
    if request.user == swap_request.requester:
        rated_user = swap_request.receiver
    elif request.user == swap_request.receiver:
        rated_user = swap_request.requester
    else:
        messages.error(request, 'You are not authorized to rate this swap.')
        return redirect('swap_requests')
    
    # Check if already rated
    if Rating.objects.filter(swap_request=swap_request, rater=request.user).exists():
        messages.info(request, 'You have already rated this swap.')
        return redirect('swap_requests')
    
    if request.method == 'POST':
        form = RatingForm(request.POST)
        if form.is_valid():
            rating = form.save(commit=False)
            rating.swap_request = swap_request
            rating.rater = request.user
            rating.rated_user = rated_user
            rating.save()
            messages.success(request, 'Rating submitted successfully!')
            return redirect('swap_requests')
    else:
        form = RatingForm()
    
    context = {
        'form': form,
        'swap_request': swap_request,
        'rated_user': rated_user,
    }
    return render(request, 'core/rate_swap.html', context)

@login_required
def swap_messages(request, swap_id):
    """View messages for a swap"""
    swap_request = get_object_or_404(SwapRequest, id=swap_id)
    
    # Check if user is participant
    if request.user not in [swap_request.requester, swap_request.receiver]:
        messages.error(request, 'You are not authorized to view these messages.')
        return redirect('swap_requests')
    
    messages_list = Message.objects.filter(swap_request=swap_request).order_by('created_at')
    
    # Mark messages as read
    Message.objects.filter(
        swap_request=swap_request
    ).exclude(sender=request.user).update(is_read=True)
    
    context = {
        'swap_request': swap_request,
        'messages': messages_list,
    }
    return render(request, 'core/swap_messages.html', context)

@login_required
def send_message(request, swap_id):
    """Send a message in a swap"""
    swap_request = get_object_or_404(SwapRequest, id=swap_id)
    
    # Check if user is participant
    if request.user not in [swap_request.requester, swap_request.receiver]:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            message = Message.objects.create(
                swap_request=swap_request,
                sender=request.user,
                content=content
            )
            return JsonResponse({
                'success': True,
                'message': {
                    'content': message.content,
                    'sender': message.sender.username,
                    'created_at': message.created_at.strftime('%Y-%m-%d %H:%M')
                }
            })
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
def skill_matches(request):
    """Find skill matches for the user"""
    user_wanted_skills = UserSkill.objects.filter(
        user=request.user, 
        skill_type='wanted'
    ).values_list('skill', flat=True)
    
    # Find users who offer skills that the current user wants
    potential_matches = UserSkill.objects.filter(
        skill__in=user_wanted_skills,
        skill_type='offered',
        user__userprofile__is_public=True
    ).exclude(user=request.user).select_related('user', 'skill')
    
    # Group by user
    matches_by_user = {}
    for user_skill in potential_matches:
        user = user_skill.user
        if user not in matches_by_user:
            matches_by_user[user] = []
        matches_by_user[user].append(user_skill.skill)
    
    context = {
        'matches_by_user': matches_by_user,
    }
    return render(request, 'core/skill_matches.html', context)

def leaderboard(request):
    """Display user leaderboard"""
    top_users = User.objects.select_related('userprofile').annotate(
        avg_rating=Avg('received_ratings__rating'),
        completed_swaps=Count('sent_requests', filter=Q(sent_requests__status='completed')) +
                       Count('received_requests', filter=Q(received_requests__status='completed'))
    ).order_by('-userprofile__points')[:20]
    
    context = {
        'top_users': top_users,
    }
    return render(request, 'core/leaderboard.html', context)

def badges(request):
    """Display all badges and user progress"""
    all_badges = Badge.objects.all().order_by('points_required')
    user_badges = []
    
    if request.user.is_authenticated:
        user_badges = UserBadge.objects.filter(user=request.user).values_list('badge_id', flat=True)
    
    context = {
        'all_badges': all_badges,
        'user_badges': user_badges,
    }
    return render(request, 'core/badges.html', context)

@login_required
def skill_progress(request):
    """View and manage skill learning progress"""
    progress_items = SkillProgress.objects.filter(user=request.user).select_related('skill')
    wanted_skills = UserSkill.objects.filter(user=request.user, skill_type='wanted').select_related('skill')
    
    context = {
        'progress_items': progress_items,
        'wanted_skills': wanted_skills,
    }
    return render(request, 'core/skill_progress.html', context)

@login_required
def update_progress(request, skill_id):
    """Update progress for a specific skill"""
    skill = get_object_or_404(Skill, id=skill_id)
    
    if request.method == 'POST':
        progress_percentage = int(request.POST.get('progress', 0))
        notes = request.POST.get('notes', '')
        
        progress, created = SkillProgress.objects.get_or_create(
            user=request.user,
            skill=skill,
            defaults={'progress_percentage': progress_percentage, 'notes': notes}
        )
        
        if not created:
            progress.progress_percentage = progress_percentage
            progress.notes = notes
            progress.save()
        
        messages.success(request, f'Progress updated for {skill.name}!')
        return redirect('skill_progress')
    
    return redirect('skill_progress')

@login_required
def user_logout(request):
    """User logout"""
    logout(request)
    return redirect('home')
