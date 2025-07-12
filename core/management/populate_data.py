from django.core.management.base import BaseCommand
from core.models import Skill, Achievement, AdminMessage

class Command(BaseCommand):
    help = 'Populate database with initial skills and data'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Populating database with initial data...')
        
        # Create skills
        skills_data = [
            # Programming
            ('Python Programming', 'Programming', 'Learn Python programming language from basics to advanced'),
            ('JavaScript', 'Programming', 'Frontend and backend JavaScript development'),
            ('Java Programming', 'Programming', 'Object-oriented programming with Java'),
            ('Web Development', 'Programming', 'HTML, CSS, JavaScript and modern frameworks'),
            ('Mobile App Development', 'Programming', 'iOS and Android app development'),
            ('Data Science', 'Programming', 'Data analysis, machine learning, and statistics'),
            
            # Design
            ('Graphic Design', 'Design', 'Adobe Photoshop, Illustrator, and design principles'),
            ('UI/UX Design', 'Design', 'User interface and user experience design'),
            ('Web Design', 'Design', 'Modern web design and responsive layouts'),
            ('Video Editing', 'Design', 'Adobe Premiere Pro and video production'),
            
            # Languages
            ('Spanish Language', 'Language', 'Learn Spanish conversation, grammar, and vocabulary'),
            ('French Language', 'Language', 'French conversation and grammar'),
            ('German Language', 'Language', 'German language basics to advanced'),
            ('English Language', 'Language', 'English grammar, conversation, and writing'),
            
            # Music
            ('Guitar Playing', 'Music', 'Acoustic and electric guitar, chords and songs'),
            ('Piano Playing', 'Music', 'Piano from beginner to advanced level'),
            ('Singing', 'Music', 'Vocal techniques and performance'),
            ('Music Production', 'Music', 'Digital audio workstations and mixing'),
            
            # Business
            ('Digital Marketing', 'Business', 'Social media marketing, SEO, and online advertising'),
            ('Excel Advanced', 'Business', 'Advanced Excel formulas, pivot tables, and macros'),
            ('Public Speaking', 'Business', 'Presentation skills and confidence building'),
            ('Project Management', 'Business', 'Agile, Scrum, and project planning'),
            
            # Creative
            ('Photography', 'Creative', 'Digital photography, composition, and editing'),
            ('Drawing', 'Creative', 'Pencil drawing, sketching, and artistic techniques'),
            ('Writing', 'Creative', 'Creative writing, blogging, and content creation'),
            ('Crafting', 'Creative', 'DIY projects and handmade crafts'),
            
            # Fitness & Health
            ('Yoga', 'Fitness', 'Yoga poses, breathing techniques, and meditation'),
            ('Fitness Training', 'Fitness', 'Personal training and workout planning'),
            ('Dance', 'Fitness', 'Various dance styles and choreography'),
            ('Nutrition', 'Health', 'Healthy eating and meal planning'),
            
            # Lifestyle
            ('Cooking', 'Lifestyle', 'Basic to advanced cooking techniques and recipes'),
            ('Baking', 'Lifestyle', 'Bread, cakes, and pastry making'),
            ('Gardening', 'Lifestyle', 'Plant care and garden maintenance'),
            ('Fashion Styling', 'Lifestyle', 'Personal styling and wardrobe planning'),
        ]
        
        created_skills = 0
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
                created_skills += 1
        
        # Create achievements
        achievements_data = [
            ('First Swap', 'Complete your first skill swap successfully', 'fas fa-handshake', 10),
            ('Skill Master', 'Offer 5 different skills to the community', 'fas fa-graduation-cap', 50),
            ('Social Butterfly', 'Connect and chat with 10 different users', 'fas fa-users', 100),
            ('Teacher', 'Complete 10 swaps as a skill teacher', 'fas fa-chalkboard-teacher', 200),
            ('Student', 'Complete 10 swaps as a skill learner', 'fas fa-book-reader', 200),
            ('Community Helper', 'Receive 50 positive ratings from other users', 'fas fa-heart', 500),
        ]
        
        created_achievements = 0
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
                created_achievements += 1
        
        # Create admin messages
        messages_data = [
            ('Welcome to SkillSwap!', 'Thank you for joining our community! Start by adding your skills and browsing other users.'),
            ('New Skills Added', 'We have added many new skills. Check out the skills management page!'),
            ('Community Guidelines', 'Please be respectful and professional in all interactions.'),
        ]
        
        created_messages = 0
        for title, content in messages_data:
            message, created = AdminMessage.objects.get_or_create(
                title=title,
                defaults={
                    'content': content,
                    'is_active': True
                }
            )
            if created:
                created_messages += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Successfully created:\n'
                f'   - {created_skills} skills\n'
                f'   - {created_achievements} achievements\n'
                f'   - {created_messages} admin messages\n'
                f'📊 Total in database:\n'
                f'   - Skills: {Skill.objects.count()}\n'
                f'   - Achievements: {Achievement.objects.count()}\n'
                f'   - Admin Messages: {AdminMessage.objects.count()}'
            )
        )
