from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import *

# Unregister the default User admin
admin.site.unregister(User)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_points', 'get_rating')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    
    def get_points(self, obj):
        try:
            return obj.userprofile.points
        except UserProfile.DoesNotExist:
            return 0
    get_points.short_description = 'Points'
    
    def get_rating(self, obj):
        try:
            return round(obj.userprofile.get_average_rating() or 0, 1)
        except UserProfile.DoesNotExist:
            return 0
    get_rating.short_description = 'Avg Rating'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'location', 'points', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'availability', 'created_at']
    search_fields = ['user__username', 'user__email', 'location']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_approved', 'created_at']
    list_filter = ['category', 'is_approved']
    search_fields = ['name', 'description']

@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = ['user', 'skill', 'skill_type', 'level', 'created_at']
    list_filter = ['skill_type', 'level', 'skill__category']
    search_fields = ['user__username', 'skill__name']

@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ['requester', 'receiver', 'offered_skill', 'requested_skill', 'status', 'created_at']
    list_filter = ['status', 'meeting_type', 'created_at']
    search_fields = ['requester__username', 'receiver__username']

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['rater', 'rated_user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'points_required', 'created_at']

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    list_filter = ('badge', 'earned_at')
    search_fields = ('user__username', 'badge__name')

@admin.register(SkillProgress)
class SkillProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'progress_percentage', 'last_updated')
    list_filter = ('skill__category', 'last_updated')
    search_fields = ('user__username', 'skill__name')

@admin.register(AdminMessage)
class AdminMessageAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_filter = ['is_active']

# Re-register User with our custom admin
admin.site.register(User, UserAdmin)

# Customize admin site
admin.site.site_header = "SkillSwap Administration"
admin.site.site_title = "SkillSwap Admin"
admin.site.index_title = "Welcome to SkillSwap Administration"
