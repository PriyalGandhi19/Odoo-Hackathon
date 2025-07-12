import os
import django
import sys

# Add the project directory to Python path
sys.path.append('/path/to/your/project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillswap_project.settings')
django.setup()

from skillswap.models import *
from django.contrib.auth.hashers import make_password

def populate_data():
    # Create skills
    skills_data = [
        {'name': 'Web Development', 'category': 'Technology'},
        {'name': 'JavaScript', 'category': 'Technology'},
        {'name': 'Python', 'category': 'Technology'},
        {'name': 'React', 'category': 'Technology'},
        {'name': 'Node.js', 'category': 'Technology'},
        {'name': 'Graphic Design', 'category': 'Design'},
        {'name': 'Photoshop', 'category': 'Design'},
        {'name': 'Illustrator', 'category': 'Design'},
        {'name': 'UI/UX Design', 'category': 'Design'},
        {'name': 'Photography', 'category': 'Creative'},
        {'name': 'Video Editing', 'category': 'Creative'},
        {'name': 'Spanish', 'category': 'Language'},
        {'name': 'French', 'category': 'Language'},
        {'name': 'German', 'category': 'Language'},
        {'name': 'Digital Marketing', 'category': 'Marketing'},
        {'name': 'SEO', 'category': 'Marketing'},
        {'name': 'Social Media Marketing', 'category': 'Marketing'},
        {'name': 'Content Writing', 'category': 'Writing'},
        {'name': 'Copywriting', 'category': 'Writing'},
        {'name': 'Excel', 'category': 'Business'},
        {'name': 'Data Analysis', 'category': 'Business'},
        {'name': 'Project Management', 'category': 'Business'},
        {'name': 'Cooking', 'category': 'Lifestyle'},
        {'name': 'Yoga', 'category': 'Fitness'},
        {'name': 'Guitar', 'category': 'Music'},
        {'name': 'Piano', 'category': 'Music'},
        {'name': 'Singing', 'category': 'Music'},
        {'name': 'Drawing', 'category': 'Art'},
        {'name': 'Painting', 'category': 'Art'},
        {'name': '3D Modeling', 'category': 'Technology'},
    ]
    
    for skill_data in skills_data:
        Skill.objects.get_or_create(**skill_data)
    
    print(f"Created {len(skills_data)} skills")
    
    # Create sample users
    users_data = [
        {
            'username': 'alex_johnson',
            'email': 'alex@example.com',
            'first_name': 'Alex',
            'last_name': 'Johnson',
            'location': 'New York, NY',
            'bio': 'Full-stack developer passionate about teaching and learning new skills.',
            'is_verified': True,
            'is_pro_member': True,
            'points': 650,
            'rating': 4.8,
            'total_swaps': 12
        },
        {
            'username': 'sarah_miller',
            'email': 'sarah@example.com',
            'first_name': 'Sarah',
            'last_name': 'Miller',
            'location': 'Brooklyn, NY',
            'bio': 'Graphic designer with 5+ years experience. Love helping others learn design!',
            'is_verified': True,
            'is_pro_member': False,
            'points': 420,
            'rating': 4.9,
            'total_swaps': 18
        },
        {
            'username': 'john_chen',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Chen',
            'location': 'Queens, NY',
            'bio': 'Native Spanish speaker and language enthusiast. Also learning programming!',
            'is_verified': True,
            'is_pro_member': False,
            'points': 380,
            'rating': 4.7,
            'total_swaps': 32
        },
        {
            'username': 'maria_garcia',
            'email': 'maria@example.com',
            'first_name': 'Maria',
            'last_name': 'Garcia',
            'location': 'Brooklyn, NY',
            'bio': 'Spanish teacher and cooking enthusiast. Always excited to share my culture!',
            'is_verified': True,
            'is_pro_member': False,
            'points': 520,
            'rating': 4.8,
            'total_swaps': 28
        },
        {
            'username': 'david_kim',
            'email': 'david@example.com',
            'first_name': 'David',
            'last_name': 'Kim',
            'location': 'Manhattan, NY',
            'bio': 'Professional graphic designer specializing in brand identity and digital art.',
            'is_verified': False,
            'is_pro_member': False,
            'points': 290,
            'rating': 4.5,
            'total_swaps': 12
        },
        {
            'username': 'lisa_wong',
            'email': 'lisa@example.com',
            'first_name': 'Lisa',
            'last_name': 'Wong',
            'location': 'Online',
            'bio': 'Digital marketing specialist with expertise in SEO and social media strategy.',
            'is_verified': True,
            'is_pro_member': True,
            'points': 780,
            'rating': 5.0,
            'total_swaps': 35
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                **user_data,
                'password': make_password('password123')
            }
        )
        created_users.append(user)
        if created:
            print(f"Created user: {user.username}")
    
    # Create achievements
    achievements_data = [
        {
            'name': 'First Swap',
            'description': 'Complete your first skill swap',
            'icon': 'fas fa-handshake',
            'points_required': 0
        },
        {
            'name': 'Helpful Teacher',
            'description': 'Complete 5 skill swaps as a teacher',
            'icon': 'fas fa-chalkboard-teacher',
            'points_required': 100
        },
        {
            'name': 'Eager Learner',
            'description': 'Complete 5 skill swaps as a student',
            'icon': 'fas fa-graduation-cap',
            'points_required': 100
        },
        {
            'name': 'Master Teacher',
            'description': 'Complete 20 skill swaps as a teacher',
            'icon': 'fas fa-trophy',
            'points_required': 500
        },
        {
            'name': 'Community Builder',
            'description': 'Help 10 different people learn new skills',
            'icon': 'fas fa-users',
            'points_required': 300
        }
    ]
    
    for achievement_data in achievements_data:
        Achievement.objects.get_or_create(**achievement_data)
    
    print(f"Created {len(achievements_data)} achievements")
    
    # Add skills to users
    if created_users:
        alex = created_users[0]
        sarah = created_users[1]
        john = created_users[2]
        maria = created_users[3]
        
        # Alex's skills
        web_dev = Skill.objects.get(name='Web Development')
        javascript = Skill.objects.get(name='JavaScript')
        python = Skill.objects.get(name='Python')
        photography = Skill.objects.get(name='Photography')
        
        UserSkillOffered.objects.get_or_create(user=alex, skill=web_dev, skill_level='expert')
        UserSkillOffered.objects.get_or_create(user=alex, skill=javascript, skill_level='expert')
        UserSkillOffered.objects.get_or_create(user=alex, skill=python, skill_level='advanced')
        UserSkillOffered.objects.get_or_create(user=alex, skill=photography, skill_level='intermediate')
        
        spanish = Skill.objects.get(name='Spanish')
        graphic_design = Skill.objects.get(name='Graphic Design')
        digital_marketing = Skill.objects.get(name='Digital Marketing')
        
        UserSkillWanted.objects.get_or_create(user=alex, skill=spanish)
        UserSkillWanted.objects.get_or_create(user=alex, skill=graphic_design)
        UserSkillWanted.objects.get_or_create(user=alex, skill=digital_marketing)
        
        print("Added skills to users")

if __name__ == '__main__':
    populate_data()
