from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Q, Avg, Count
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache
from .models import *
from .forms import *

def home(request):
    total_users = User.objects.count()
    total_skills = Skill.objects.count()
    total_swaps = SwapRequest.objects.filter(status='completed').count()
    recent_users = UserProfile.objects.filter(visibility='public').order_by('-created_at')[:6]
    admin_messages = AdminMessage.objects.filter(is_active=True).order_by('-created_at')[:3]
    
    unread_messages_count = 0
    if request.user.is_authenticated:
        unread_messages_count = Message.objects.filter(receiver=request.user, is_read=False).count()

    context = {
        'total_users': total_users,
        'total_skills': total_skills,
        'total_swaps': total_swaps,
        'recent_users': recent_users,
        'admin_messages': admin_messages,
        'unread_messages_count': unread_messages_count,
    }
    return render(request, 'core/home.html', context)

@csrf_protect
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create user profile
            UserProfile.objects.create(user=user)
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}! You can now login.')
            return redirect('login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = CustomUserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

@csrf_protect
@never_cache
def custom_login(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if username and password:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
                    next_url = request.GET.get('next', 'dashboard')
                    return redirect(next_url)
                else:
                    messages.error(request, 'Your account is disabled.')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Please enter both username and password.')
    
    return render(request, 'registration/login.html')

@never_cache
def custom_logout(request):
    if request.user.is_authenticated:
        username = request.user.get_full_name() or request.user.username
        logout(request)
        messages.success(request, f'Goodbye {username}! You have been successfully logged out.')
    return redirect('home')

@login_required
def dashboard(request):
    # Ensure user has a profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    offered_skills = UserSkill.objects.filter(user=request.user, skill_type='offered').select_related('skill')
    wanted_skills = UserSkill.objects.filter(user=request.user, skill_type='wanted').select_related('skill')
    pending_requests = SwapRequest.objects.filter(receiver=request.user, status='pending').select_related('requester', 'skill_offered', 'skill_wanted')
    sent_requests = SwapRequest.objects.filter(requester=request.user, status='pending').select_related('receiver', 'skill_offered', 'skill_wanted')
    recent_messages = Message.objects.filter(receiver=request.user, is_read=False).select_related('sender')[:5]
    unread_messages_count = Message.objects.filter(receiver=request.user, is_read=False).count()
    
    # Skill match suggestions
    user_wanted_skills = wanted_skills.values_list('skill', flat=True)
    suggested_matches = UserSkill.objects.filter(
        skill__in=user_wanted_skills,
        skill_type='offered'
    ).exclude(user=request.user).select_related('user', 'skill')[:5]
    
    context = {
        'profile': profile,
        'offered_skills': offered_skills,
        'wanted_skills': wanted_skills,
        'pending_requests': pending_requests,
        'sent_requests': sent_requests,
        'recent_messages': recent_messages,
        'suggested_matches': suggested_matches,
        'unread_messages_count': unread_messages_count,
    }
    return render(request, 'core/dashboard.html', context)

@login_required
def profile_edit(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = UserProfileForm(instance=profile)
    return render(request, 'core/profile_edit.html', {'form': form})

@login_required
def skills_manage(request):
    offered_skills = UserSkill.objects.filter(user=request.user, skill_type='offered').select_related('skill')
    wanted_skills = UserSkill.objects.filter(user=request.user, skill_type='wanted').select_related('skill')
    
    if request.method == 'POST':
        if 'add_new_skill' in request.POST:
            skill_form = SkillForm(request.POST)
            if skill_form.is_valid():
                skill = skill_form.save()
                messages.success(request, f'New skill "{skill.name}" created successfully!')
                return redirect('skills_manage')
            else:
                messages.error(request, 'Please correct the errors in the skill form.')
    else:
        skill_form = SkillForm()
    
    context = {
        'offered_skills': offered_skills,
        'wanted_skills': wanted_skills,
        'skill_form': skill_form,
        'all_skills': Skill.objects.filter(is_approved=True).order_by('category', 'name'),
    }
    return render(request, 'core/skills_manage.html', context)

@login_required
def skill_delete(request, skill_id):
    skill = get_object_or_404(UserSkill, id=skill_id, user=request.user)
    skill_name = skill.skill.name
    skill_type = skill.skill_type
    skill.delete()
    messages.success(request, f'"{skill_name}" removed from your {skill_type} skills!')
    return redirect('skills_manage')

@login_required
def add_skill_to_user(request):
    """Add existing skill to user's profile"""
    if request.method == 'POST':
        skill_id = request.POST.get('skill_id')
        skill_type = request.POST.get('skill_type')
        level = request.POST.get('level', 'beginner')
        description = request.POST.get('description', '')
        
        try:
            skill = Skill.objects.get(id=skill_id)
            user_skill, created = UserSkill.objects.get_or_create(
                user=request.user,
                skill=skill,
                skill_type=skill_type,
                defaults={'level': level, 'description': description}
            )
            
            if created:
                messages.success(request, f'"{skill.name}" added to your {skill_type} skills!')
            else:
                messages.warning(request, f'You already have "{skill.name}" in your {skill_type} skills!')
                
        except Skill.DoesNotExist:
            messages.error(request, 'Skill not found!')
        except Exception as e:
            messages.error(request, f'Error adding skill: {str(e)}')
    
    return redirect('skills_manage')

def browse_users(request):
    form = SearchForm(request.GET)
    users = UserProfile.objects.filter(visibility='public', is_banned=False).select_related('user')
    
    if form.is_valid():
        query = form.cleaned_data.get('query')
        category = form.cleaned_data.get('category')
        level = form.cleaned_data.get('level')
        
        if query:
            users = users.filter(
                Q(user__username__icontains=query) |
                Q(user__first_name__icontains=query) |
                Q(user__last_name__icontains=query) |
                Q(location__icontains=query)
            )
        
        if category:
            users = users.filter(user__userskill__skill__category__icontains=category).distinct()
        
        if level:
            users = users.filter(user__userskill__level=level).distinct()
    
    paginator = Paginator(users, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'form': form,
        'page_obj': page_obj,
    }
    return render(request, 'core/browse_users.html', context)

def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    if profile.visibility == 'private' and request.user != user:
        messages.error(request, 'This profile is private.')
        return redirect('browse_users')
    
    offered_skills = UserSkill.objects.filter(user=user, skill_type='offered').select_related('skill')
    wanted_skills = UserSkill.objects.filter(user=user, skill_type='wanted').select_related('skill')
    ratings = Rating.objects.filter(rated_user=user).select_related('rater').order_by('-created_at')
    avg_rating = ratings.aggregate(Avg('rating'))['rating__avg']
    
    context = {
        'profile_user': user,
        'profile': profile,
        'offered_skills': offered_skills,
        'wanted_skills': wanted_skills,
        'ratings': ratings,
        'avg_rating': avg_rating,
    }
    return render(request, 'core/user_profile.html', context)

@login_required
def send_swap_request(request, username):
    receiver = get_object_or_404(User, username=username)
    
    if receiver == request.user:
        messages.error(request, "You can't send a swap request to yourself!")
        return redirect('user_profile', username=username)
    
    if request.method == 'POST':
        form = SwapRequestForm(request.POST)
        if form.is_valid():
            swap_request = form.save(commit=False)
            swap_request.requester = request.user
            swap_request.receiver = receiver
            swap_request.save()
            messages.success(request, f'Swap request sent to {receiver.get_full_name() or receiver.username}!')
            return redirect('user_profile', username=username)
        else:
            messages.error(request, 'Please correct the errors in the form.')
    else:
        # Get user's offered skills and receiver's wanted skills
        offered_skills = UserSkill.objects.filter(user=request.user, skill_type='offered')
        wanted_skills = UserSkill.objects.filter(user=receiver, skill_type='wanted')
        form = SwapRequestForm()
        form.fields['skill_offered'].queryset = Skill.objects.filter(userskill__in=offered_skills)
        form.fields['skill_wanted'].queryset = Skill.objects.filter(userskill__in=wanted_skills)
    
    context = {
        'form': form,
        'receiver': receiver,
    }
    return render(request, 'core/send_swap_request.html', context)

@login_required
def swap_requests(request):
    received_requests = SwapRequest.objects.filter(receiver=request.user).select_related('requester', 'skill_offered', 'skill_wanted').order_by('-created_at')
    sent_requests = SwapRequest.objects.filter(requester=request.user).select_related('receiver', 'skill_offered', 'skill_wanted').order_by('-created_at')
    
    context = {
        'received_requests': received_requests,
        'sent_requests': sent_requests,
    }
    return render(request, 'core/swap_requests.html', context)

@login_required
def handle_swap_request(request, request_id, action):
    swap_request = get_object_or_404(SwapRequest, id=request_id)
    
    # Check if user is authorized to handle this request
    if request.user not in [swap_request.requester, swap_request.receiver]:
        messages.error(request, 'You are not authorized to handle this request.')
        return redirect('swap_requests')
    
    if action == 'accept' and request.user == swap_request.receiver:
        swap_request.status = 'accepted'
        messages.success(request, f'Swap request from {swap_request.requester.get_full_name() or swap_request.requester.username} accepted!')
    elif action == 'reject' and request.user == swap_request.receiver:
        swap_request.status = 'rejected'
        messages.success(request, f'Swap request from {swap_request.requester.get_full_name() or swap_request.requester.username} rejected!')
    elif action == 'complete' and request.user in [swap_request.requester, swap_request.receiver]:
        swap_request.status = 'completed'
        # Award points
        requester_profile, _ = UserProfile.objects.get_or_create(user=swap_request.requester)
        receiver_profile, _ = UserProfile.objects.get_or_create(user=swap_request.receiver)
        requester_profile.points += 10
        receiver_profile.points += 10
        requester_profile.save()
        receiver_profile.save()
        messages.success(request, 'Swap marked as completed! You both earned 10 points!')
    else:
        messages.error(request, 'Invalid action or unauthorized.')
        return redirect('swap_requests')
    
    swap_request.save()
    return redirect('swap_requests')

@login_required
def rate_user(request, request_id):
    swap_request = get_object_or_404(SwapRequest, id=request_id, status='completed')
    
    # Check if user is part of this swap
    if request.user not in [swap_request.requester, swap_request.receiver]:
        messages.error(request, 'You are not authorized to rate this swap.')
        return redirect('swap_requests')
    
    # Determine who to rate
    rated_user = swap_request.receiver if request.user == swap_request.requester else swap_request.requester
    
    # Check if already rated
    if Rating.objects.filter(swap_request=swap_request, rater=request.user).exists():
        messages.error(request, 'You have already rated this swap.')
        return redirect('swap_requests')
    
    if request.method == 'POST':
        form = RatingForm(request.POST)
        if form.is_valid():
            rating = form.save(commit=False)
            rating.swap_request = swap_request
            rating.rater = request.user
            rating.rated_user = rated_user
            rating.save()
            messages.success(request, f'Rating submitted for {rated_user.get_full_name() or rated_user.username}!')
            return redirect('swap_requests')
        else:
            messages.error(request, 'Please correct the errors in the rating form.')
    else:
        form = RatingForm()
    
    context = {
        'form': form,
        'swap_request': swap_request,
        'rated_user': rated_user,
    }
    return render(request, 'core/rate_user.html', context)

@login_required
def messages_view(request):
    # Get all conversations
    conversations = Message.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user)
    ).values('sender', 'receiver').distinct()
    
    # Get unique users in conversations
    user_ids = set()
    for conv in conversations:
        user_ids.add(conv['sender'])
        user_ids.add(conv['receiver'])
    user_ids.discard(request.user.id)
    
    conversation_users = User.objects.filter(id__in=user_ids).select_related('userprofile')
    
    context = {
        'conversation_users': conversation_users,
    }
    return render(request, 'core/messages.html', context)

@login_required
def chat_with_user(request, username):
    other_user = get_object_or_404(User, username=username)
    
    if other_user == request.user:
        messages.error(request, "You can't chat with yourself!")
        return redirect('messages')
    
    # Get messages between users
    messages_list = Message.objects.filter(
        Q(sender=request.user, receiver=other_user) |
        Q(sender=other_user, receiver=request.user)
    ).select_related('sender', 'receiver').order_by('created_at')
    
    # Mark messages as read
    Message.objects.filter(sender=other_user, receiver=request.user, is_read=False).update(is_read=True)
    
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.sender = request.user
            message.receiver = other_user
            message.save()
            messages.success(request, 'Message sent!')
            return redirect('chat_with_user', username=username)
        else:
            messages.error(request, 'Please enter a message.')
    else:
        form = MessageForm()
    
    context = {
        'other_user': other_user,
        'messages_list': messages_list,
        'form': form,
    }
    return render(request, 'core/chat.html', context)

@login_required
def leaderboard(request):
    top_users = UserProfile.objects.filter(is_banned=False).select_related('user').order_by('-points')[:20]
    user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    user_rank = UserProfile.objects.filter(points__gt=user_profile.points, is_banned=False).count() + 1
    
    context = {
        'top_users': top_users,
        'user_rank': user_rank,
    }
    return render(request, 'core/leaderboard.html', context)

@login_required
def achievements(request):
    user_achievements = UserAchievement.objects.filter(user=request.user).select_related('achievement')
    all_achievements = Achievement.objects.all()
    
    context = {
        'user_achievements': user_achievements,
        'all_achievements': all_achievements,
    }
    return render(request, 'core/achievements.html', context)
