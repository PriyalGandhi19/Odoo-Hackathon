#!/usr/bin/env python
"""
Populate the database with initial skills
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillswap.settings')

# Setup Django
django.setup()

from core.models import Skill, Achievement, AdminMessage

def create_skills():
    """Create initial skills"""
    
    skills_data = [
        # Programming
        ('Python Programming', 'Programming', 'Learn Python programming language from basics to advanced'),
        ('JavaScript', 'Programming', 'Frontend and backend JavaScript development'),
        ('Java Programming', 'Programming', 'Object-oriented programming with Java'),
        ('C++ Programming', 'Programming', 'System programming and competitive programming'),
        ('Web Development', 'Programming', 'HTML, CSS, JavaScript and modern frameworks'),
        ('Mobile App Development', 'Programming', 'iOS and Android app development'),
        ('Data Science', 'Programming', 'Data analysis, machine learning, and statistics'),
        ('Database Design', 'Programming', 'SQL, NoSQL, and database optimization'),
        
        # Design
        ('Graphic Design', 'Design', 'Adobe Photoshop, Illustrator, and design principles'),
        ('UI/UX Design', 'Design', 'User interface and user experience design'),
        ('Web Design', 'Design', 'Modern web design and responsive layouts'),
        ('Logo Design', 'Design', 'Brand identity and logo creation'),
        ('Video Editing', 'Design', 'Adobe Premiere Pro and video production'),
        ('Animation', 'Design', '2D and 3D animation techniques'),
        
        # Languages
        ('Spanish Language', 'Language', 'Learn Spanish conversation, grammar, and vocabulary'),
        ('French Language', 'Language', 'French conversation and grammar'),
        ('German Language', 'Language', 'German language basics to advanced'),
        ('Mandarin Chinese', 'Language', 'Chinese language and culture'),
        ('Japanese Language', 'Language', 'Japanese conversation and writing'),
        ('English Language', 'Language', 'English grammar, conversation, and writing'),
        
        # Music
        ('Guitar Playing', 'Music', 'Acoustic and electric guitar, chords and songs'),
        ('Piano Playing', 'Music', 'Piano from beginner to advanced level'),
        ('Singing', 'Music', 'Vocal techniques and performance'),
        ('Drums', 'Music', 'Drum beats and rhythm patterns'),
        ('Music Production', 'Music', 'Digital audio workstations and mixing'),
        ('Violin', 'Music', 'Classical and modern violin techniques'),
        
        # Business
        ('Digital Marketing', 'Business', 'Social media marketing, SEO, and online advertising'),
        ('Excel Advanced', 'Business', 'Advanced Excel formulas, pivot tables, and macros'),
        ('Public Speaking', 'Business', 'Presentation skills and confidence building'),
        ('Project Management', 'Business', 'Agile, Scrum, and project planning'),
        ('Accounting', 'Business', 'Basic to advanced accounting principles'),
        ('Sales Techniques', 'Business', 'Sales strategies and customer relations'),
        
        # Creative
        ('Photography', 'Creative', 'Digital photography, composition, and editing'),
        ('Drawing', 'Creative', 'Pencil drawing, sketching, and artistic techniques'),
        ('Painting', 'Creative', 'Watercolor, acrylic, and oil painting'),
        ('Writing', 'Creative', 'Creative writing, blogging, and content creation'),
        ('Crafting', 'Creative', 'DIY projects and handmade crafts'),
        ('Pottery', 'Creative', 'Ceramic arts and pottery wheel techniques'),
        
        # Fitness & Health
        ('Yoga', 'Fitness', 'Yoga poses, breathing techniques, and meditation'),
        ('Fitness Training', 'Fitness', 'Personal training and workout planning'),
        ('Martial Arts', 'Fitness', 'Karate, Taekwondo, and self-defense'),
        ('Dance', 'Fitness', 'Various dance styles and choreography'),
        ('Nutrition', 'Health', 'Healthy eating and meal planning'),
        ('Meditation', 'Health', 'Mindfulness and stress reduction techniques'),
        
        # Lifestyle
        ('Cooking', 'Lifestyle', 'Basic to advanced cooking techniques and recipes'),
        ('Baking', 'Lifestyle', 'Bread, cakes, and pastry making'),
        ('Gardening', 'Lifestyle', 'Plant care and garden maintenance'),
        ('Home Organization', 'Lifestyle', 'Decluttering and organizing spaces'),
        ('Fashion Styling', 'Lifestyle', 'Personal styling and wardrobe planning'),
        ('Interior Design', 'Lifestyle', 'Home decoration and space planning'),
        
        # Technical
        ('Car Maintenance', 'Technical', 'Basic car repair and maintenance'),
        ('Electronics Repair', 'Technical', 'Fixing phones, computers, and gadgets'),
        ('Woodworking', 'Technical', 'Furniture making and wood crafts'),
        ('Plumbing', 'Technical', 'Basic plumbing repairs and installation'),
        ('Electrical Work', 'Technical', 'Basic electrical repairs and wiring'),
        ('3D Printing', 'Technical', '3D modeling and printing techniques'),
    ]
    
    created_count = 0
    for name, category, description in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={
                'category': category,
                'description': description,
                'is_approved': True
            }
        )
        if created:
            created_count += 1
            print(f"✅ Created skill: {name}")
        else:
            print(f"⚠️  Skill already exists: {name}")
    
    print(f"\n🎯 Created {created_count} new skills!")
    print(f"📊 Total skills in database: {Skill.objects.count()}")

def create_achievements():
    """Create achievement badges"""
    
    achievements_data = [
        ('First Swap', 'Complete your first skill swap successfully', 'fas fa-handshake', 10),
        ('Skill Master', 'Offer 5 different skills to the community', 'fas fa-graduation-cap', 50),
        ('Social Butterfly', 'Connect and chat with 10 different users', 'fas fa-users', 100),
        ('Teacher', 'Complete 10 swaps as a skill teacher', 'fas fa-chalkboard-teacher', 200),
        ('Student', 'Complete 10 swaps as a skill learner', 'fas fa-book-reader', 200),
        ('Community Helper', 'Receive 50 positive ratings from other users', 'fas fa-heart', 500),
        ('Popular Teacher', 'Have 20 users request your skills', 'fas fa-star', 300),
        ('Dedicated Learner', 'Send 25 swap requests to learn new skills', 'fas fa-brain', 250),
        ('Five Star Teacher', 'Maintain a 5-star average rating with 10+ ratings', 'fas fa-trophy', 400),
        ('Skill Collector', 'Learn 15 different skills through swaps', 'fas fa-collection', 600),
        ('Early Bird', 'One of the first 100 users to join SkillSwap', 'fas fa-clock', 25),
        ('Mentor', 'Help 5 beginners learn new skills', 'fas fa-user-graduate', 150),
    ]
    
    created_count = 0
    for name, description, icon, points in achievements_data:
        achievement, created = Achievement.objects.get_or_create(
            name=name,
            defaults={
                'description': description,
                'icon': icon,
                'points_required': points
            }
        )
        if created:
            created_count += 1
            print(f"🏆 Created achievement: {name}")
    
    print(f"\n🎖️  Created {created_count} new achievements!")

def create_admin_messages():
    """Create admin messages"""
    
    messages_data = [
        ('Welcome to SkillSwap!', 'Thank you for joining our community! Start by adding your skills and browsing other users to find perfect matches.'),
        ('New Skills Added', 'We have added 50+ new skills across different categories. Check out the skills management page to add them to your profile!'),
        ('Community Guidelines', 'Please be respectful and professional in all your interactions. Report any inappropriate behavior to our admin team.'),
        ('Skill Verification Available', 'We now offer skill verification for expert-level users. Contact admin if you want to get verified and earn more credibility.'),
        ('Mobile App Coming Soon', 'We are working on a mobile app for SkillSwap. Stay tuned for updates and beta testing opportunities!'),
    ]
    
    created_count = 0
    for title, content in messages_data:
        message, created = AdminMessage.objects.get_or_create(
            title=title,
            defaults={
                'content': content,
                'is_active': True
            }
        )
        if created:
            created_count += 1
            print(f"📢 Created admin message: {title}")
    
    print(f"\n📨 Created {created_count} new admin messages!")

def main():
    """Main function"""
    print("🚀 Populating SkillSwap database with initial data...")
    
    print("\n📚 Creating skills...")
    create_skills()
    
    print("\n🏆 Creating achievements...")
    create_achievements()
    
    print("\n📢 Creating admin messages...")
    create_admin_messages()
    
    print("\n✅ Database population complete!")
    print(f"📊 Summary:")
    print(f"   - Skills: {Skill.objects.count()}")
    print(f"   - Achievements: {Achievement.objects.count()}")
    print(f"   - Admin Messages: {AdminMessage.objects.count()}")

if __name__ == '__main__':
    main()
