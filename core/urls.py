from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.custom_login, name='login'),
    path('logout/', views.custom_logout, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
    path('skills/', views.skills_manage, name='skills_manage'),
    path('skills/delete/<int:skill_id>/', views.skill_delete, name='skill_delete'),
    path('skills/add/', views.add_skill_to_user, name='add_skill_to_user'),
    path('browse/', views.browse_users, name='browse_users'),
    path('user/<str:username>/', views.user_profile, name='user_profile'),
    path('swap/request/<str:username>/', views.send_swap_request, name='send_swap_request'),
    path('swap/requests/', views.swap_requests, name='swap_requests'),
    path('swap/handle/<int:request_id>/<str:action>/', views.handle_swap_request, name='handle_swap_request'),
    path('rate/<int:request_id>/', views.rate_user, name='rate_user'),
    path('messages/', views.messages_view, name='messages'),
    path('chat/<str:username>/', views.chat_with_user, name='chat_with_user'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('achievements/', views.achievements, name='achievements'),
]
