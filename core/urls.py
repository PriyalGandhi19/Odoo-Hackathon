from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Home and authentication
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='core/login.html'), name='login'),
    path('logout/', views.user_logout, name='logout'),
    
    # Dashboard and profile
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('profile/<str:username>/', views.user_profile, name='user_profile'),
    
    # Skills
    path('skills/', views.browse_skills, name='browse_skills'),
    path('skills/add/', views.add_skill, name='add_skill'),
    path('skills/manage/', views.manage_skills, name='manage_skills'),
    path('skills/delete/<int:skill_id>/', views.delete_user_skill, name='delete_user_skill'),
    path('skills/matches/', views.skill_matches, name='skill_matches'),
    path('skills/progress/', views.skill_progress, name='skill_progress'),
    path('skills/progress/update/<int:skill_id>/', views.update_progress, name='update_progress'),
    
    # Search and filtering
    path('search/', views.advanced_search, name='advanced_search'),
    path('search/users/', views.search_users, name='search_users'),
    path('search/nearby/', views.nearby_users, name='nearby_users'),
    
    # Swap requests
    path('swap/create/<int:user_id>/<int:skill_id>/', views.create_swap_request, name='create_swap_request'),
    path('swap/requests/', views.swap_requests, name='swap_requests'),
    path('swap/respond/<int:request_id>/', views.respond_to_swap, name='respond_to_swap'),
    path('swap/complete/<int:request_id>/', views.complete_swap, name='complete_swap'),
    path('swap/rate/<int:request_id>/', views.rate_swap, name='rate_swap'),
    path('swap/messages/<int:swap_id>/', views.swap_messages, name='swap_messages'),
    path('swap/send_message/<int:swap_id>/', views.send_message, name='send_message'),
    
    # Community
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('badges/', views.badges, name='badges'),
]
