-- Create database and tables for SkillSwap
CREATE DATABASE IF NOT EXISTS skillswap_db;
USE skillswap_db;

-- Create initial skills
INSERT INTO core_skill (name, category, description, is_approved, created_at) VALUES
('Python Programming', 'Programming', 'Learn Python programming language', 1, NOW()),
('Web Design', 'Design', 'HTML, CSS, and web design principles', 1, NOW()),
('Photography', 'Creative', 'Digital photography and editing', 1, NOW()),
('Guitar Playing', 'Music', 'Learn to play acoustic and electric guitar', 1, NOW()),
('Cooking', 'Lifestyle', 'Basic to advanced cooking techniques', 1, NOW()),
('Spanish Language', 'Language', 'Learn Spanish conversation and grammar', 1, NOW()),
('Digital Marketing', 'Business', 'Social media and online marketing', 1, NOW()),
('Yoga', 'Fitness', 'Yoga poses and meditation techniques', 1, NOW()),
('Data Analysis', 'Programming', 'Excel, SQL, and data visualization', 1, NOW()),
('Graphic Design', 'Design', 'Adobe Photoshop and Illustrator', 1, NOW());

-- Create achievements
INSERT INTO core_achievement (name, description, icon, points_required) VALUES
('First Swap', 'Complete your first skill swap', 'fas fa-handshake', 10),
('Skill Master', 'Offer 5 different skills', 'fas fa-graduation-cap', 50),
('Social Butterfly', 'Connect with 10 different users', 'fas fa-users', 100),
('Teacher', 'Complete 10 swaps as a teacher', 'fas fa-chalkboard-teacher', 200),
('Student', 'Complete 10 swaps as a learner', 'fas fa-book-reader', 200),
('Community Helper', 'Receive 50 positive ratings', 'fas fa-heart', 500);

-- Create admin messages
INSERT INTO core_adminmessage (title, content, is_active, created_at) VALUES
('Welcome to SkillSwap!', 'Thank you for joining our community. Start by adding your skills and browsing other users.', 1, NOW()),
('New Features Added', 'We have added a new leaderboard and achievement system. Check them out!', 1, NOW()),
('Community Guidelines', 'Please be respectful and professional in all your interactions. Report any inappropriate behavior.', 1, NOW());
