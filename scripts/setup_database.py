#!/usr/bin/env python
"""
Database setup script for SkillSwap platform
Run this script to set up the database with initial data
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillswap.settings')

# Setup Django
django.setup()

from django.contrib.auth.models import User
from core.models import *

def create_sample_users():
    """Create sample users for testing"""
    
    # Create admin user
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@skillswap.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        UserProfile.objects.create(
            user=admin,
            location='San Francisco, CA',
            bio='Platform administrator',
            availability='flexible',
            visibility='public',
            points=1000,
            is_verified=True
        )
        print("✅ Admin user created")

    # Create sample users
    sample_users = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'location': 'New York, NY',
            'bio': 'Software developer passionate about teaching programming',
            'points': 150
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'location': 'Los Angeles, CA',
            'bio': 'Graphic designer and photography enthusiast',
            'points': 200
        },
        {
            'username': 'mike_wilson',
            'email': 'mike@example.com',
            'first_name': 'Mike',
            'last_name': 'Wilson',
            'location': 'Chicago, IL',
            'bio': 'Music teacher and guitar player',
            'points': 120
        },
        {
            'username': 'sarah_johnson',
            'email': 'sarah@example.com',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'location': 'Austin, TX',
            'bio': 'Language teacher fluent in Spanish and French',
            'points': 180
        },
        {
            'username': 'david_brown',
            'email': 'david@example.com',
            'first_name': 'David',
            'last_name': 'Brown',
            'location': 'Seattle, WA',
            'bio': 'Data scientist and machine learning expert',
            'points': 250
        }
    ]

    for user_data in sample_users:
        if not User.objects.filter(username=user_data['username']).exists():
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password='password123',
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )
            UserProfile.objects.create(
                user=user,
                location=user_data['location'],
                bio=user_data['bio'],
                availability='flexible',
                visibility='public',
                points=user_data['points']
            )
            print(f"✅ User {user_data['username']} created")

def create_sample_user_skills():
    """Create sample user skills"""
    
    # Get users and skills
    users = User.objects.all()
    skills = Skill.objects.all()
    
    if not users.exists() or not skills.exists():
        print("❌ Users or skills not found. Run migrations first.")
        return
    
    # Sample skill assignments
    skill_assignments = [
        ('john_doe', 'Python Programming', 'offered', 'expert'),
        ('john_doe', 'Web Design', 'offered', 'intermediate'),
        ('john_doe', 'Guitar Playing', 'wanted', 'beginner'),
        ('jane_smith', 'Graphic Design', 'offered', 'expert'),
        ('jane_smith', 'Photography', 'offered', 'intermediate'),
        ('jane_smith', 'Python Programming', 'wanted', 'beginner'),
        ('mike_wilson', 'Guitar Playing', 'offered', 'expert'),
        ('mike_wilson', 'Piano Playing', 'offered', 'intermediate'),
        ('mike_wilson', 'Video Editing', 'wanted', 'beginner'),
        ('sarah_johnson', 'Spanish Language', 'offered', 'expert'),
        ('sarah_johnson', 'French Language', 'offered', 'expert'),
        ('sarah_johnson', 'Digital Marketing', 'wanted', 'intermediate'),
        ('david_brown', 'Data Analysis', 'offered', 'expert'),
        ('david_brown', 'Machine Learning', 'offered', 'expert'),
        ('david_brown', 'Public Speaking', 'wanted', 'beginner'),
    ]
    
    for username, skill_name, skill_type, level in skill_assignments:
        try:
            user = User.objects.get(username=username)
            skill = Skill.objects.get(name=skill_name)
            
            user_skill, created = UserSkill.objects.get_or_create(
                user=user,
                skill=skill,
                skill_type=skill_type,
                defaults={'level': level}
            )
            
            if created:
                print(f"✅ Added {skill_type} skill '{skill_name}' for {username}")
                
        except (User.DoesNotExist, Skill.DoesNotExist):
            print(f"❌ Could not find user '{username}' or skill '{skill_name}'")

def main():
    """Main setup function"""
    print("🚀 Setting up SkillSwap database...")
    
    # Run migrations
    print("\n📦 Running migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create sample data
    print("\n👥 Creating sample users...")
    create_sample_users()
    
    print("\n🎯 Creating sample user skills...")
    create_sample_user_skills()
    
    print("\n✅ Database setup complete!")
    print("\n🔑 Login credentials:")
    print("   Admin: admin / admin123")
    print("   Sample users: john_doe, jane_smith, mike_wilson, sarah_johnson, david_brown")
    print("   Password for all sample users: password123")
    print("\n🌐 Start the server with: python manage.py runserver")

if __name__ == '__main__':
    main()
