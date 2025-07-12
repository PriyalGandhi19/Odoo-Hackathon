from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Q, Avg
from django.utils import timezone
import math

class UserProfile(models.Model):
    AVAILABILITY_CHOICES = [
        ('weekdays', 'Weekdays'),
        ('weekends', 'Weekends'),
        ('evenings', 'Evenings'),
        ('mornings', 'Mornings'),
        ('flexible', 'Flexible'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    points = models.IntegerField(default=0)
    level = models.CharField(max_length=20, default='Beginner')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='flexible')
    max_distance = models.IntegerField(default=50, help_text="Maximum distance in miles for in-person meetings")
    is_verified = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def get_average_rating(self):
        ratings = Rating.objects.filter(rated_user=self.user)
        if ratings.exists():
            return round(ratings.aggregate(Avg('rating'))['rating__avg'], 1)
        return 0

    def get_completed_swaps_count(self):
        return SwapRequest.objects.filter(
            Q(requester=self.user) | Q(receiver=self.user),
            status='completed'
        ).count()

    def get_distance_to(self, other_profile):
        """Calculate distance between two user profiles in miles"""
        if not all([self.latitude, self.longitude, other_profile.latitude, other_profile.longitude]):
            return None
        
        # Haversine formula
        lat1, lon1 = math.radians(self.latitude), math.radians(self.longitude)
        lat2, lon2 = math.radians(other_profile.latitude), math.radians(other_profile.longitude)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Radius of earth in miles
        r = 3956
        return round(c * r, 1)

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('Technology', 'Technology'),
        ('Design', 'Design'),
        ('Business', 'Business'),
        ('Languages', 'Languages'),
        ('Music', 'Music'),
        ('Arts & Crafts', 'Arts & Crafts'),
        ('Sports', 'Sports'),
        ('Cooking', 'Cooking'),
        ('Health & Wellness', 'Health & Wellness'),
        ('Education', 'Education'),
        ('Other', 'Other'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

    def get_teachers_count(self):
        return UserSkill.objects.filter(skill=self, skill_type='offered').count()

    def get_learners_count(self):
        return UserSkill.objects.filter(skill=self, skill_type='wanted').count()

class UserSkill(models.Model):
    SKILL_TYPE_CHOICES = [
        ('offered', 'Offered'),
        ('wanted', 'Wanted'),
    ]
    
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    skill_type = models.CharField(max_length=10, choices=SKILL_TYPE_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    description = models.TextField(blank=True)
    years_experience = models.IntegerField(default=0, help_text="Years of experience with this skill")
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Optional hourly rate for premium sessions")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'skill', 'skill_type']

    def __str__(self):
        return f"{self.user.username} - {self.skill.name} ({self.skill_type})"

class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    MEETING_TYPE_CHOICES = [
        ('online', 'Online'),
        ('in_person', 'In Person'),
        ('both', 'Both Options Available'),
    ]
    
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    offered_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='offered_in_swaps')
    requested_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='requested_in_swaps')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    scheduled_date = models.DateTimeField(blank=True, null=True)
    duration_hours = models.IntegerField(default=1)
    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPE_CHOICES, default='online')
    meeting_link = models.URLField(blank=True)
    meeting_location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.requester.username} -> {self.receiver.username}: {self.offered_skill.name} for {self.requested_skill.name}"

    class Meta:
        ordering = ['-created_at']

class Rating(models.Model):
    swap_request = models.ForeignKey(SwapRequest, on_delete=models.CASCADE)
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_ratings')
    rated_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_ratings')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['swap_request', 'rater']

    def __str__(self):
        return f"{self.rater.username} rated {self.rated_user.username}: {self.rating}/5"

class Message(models.Model):
    swap_request = models.ForeignKey(SwapRequest, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.username} at {self.created_at}"

class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    points_required = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'badge']

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"

class SkillProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    progress_percentage = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    notes = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'skill']

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}: {self.progress_percentage}%"

class AdminMessage(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
