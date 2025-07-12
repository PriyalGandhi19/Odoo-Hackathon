from django.contrib import admin
from .models import *

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'location', 'availability', 'visibility', 'points', 'is_verified', 'is_banned']
    list_filter = ['availability', 'visibility', 'is_verified', 'is_banned']
    search_fields = ['user__username', 'user__email', 'location']
    actions = ['ban_users', 'unban_users', 'verify_users']
    
    def ban_users(self, request, queryset):
        queryset.update(is_banned=True)
    ban_users.short_description = "Ban selected users"
    
    def unban_users(self, request, queryset):
        queryset.update(is_banned=False)
    unban_users.short_description = "Unban selected users"
    
    def verify_users(self, request, queryset):
        queryset.update(is_verified=True)
    verify_users.short_description = "Verify selected users"

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_approved', 'created_at']
    list_filter = ['category', 'is_approved']
    search_fields = ['name', 'category']
    actions = ['approve_skills', 'reject_skills']
    
    def approve_skills(self, request, queryset):
        queryset.update(is_approved=True)
    approve_skills.short_description = "Approve selected skills"
    
    def reject_skills(self, request, queryset):
        queryset.update(is_approved=False)
    reject_skills.short_description = "Reject selected skills"

@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ['requester', 'receiver', 'skill_offered', 'skill_wanted', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['requester__username', 'receiver__username', 'skill_offered__name', 'skill_wanted__name']

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['rater', 'rated_user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['rater__username', 'rated_user__username']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'content', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__username', 'receiver__username', 'content']

@admin.register(AdminMessage)
class AdminMessageAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'content']

admin.site.register(UserSkill)
admin.site.register(Achievement)
admin.site.register(UserAchievement)
