-- Insert sample data for SkillSwap platform
USE skillswap_db;

-- Insert sample skills
INSERT INTO core_skill (name, category, description, is_approved, created_at) VALUES
('Python Programming', 'Programming', 'Learn Python programming language from basics to advanced', 1, NOW()),
('Web Design', 'Design', 'HTML, CSS, JavaScript and modern web design principles', 1, NOW()),
('Photography', 'Creative', 'Digital photography, composition, and photo editing', 1, NOW()),
('Guitar Playing', 'Music', 'Learn to play acoustic and electric guitar, chords and songs', 1, NOW()),
('Cooking', 'Lifestyle', 'Basic to advanced cooking techniques and recipes', 1, NOW()),
('Spanish Language', 'Language', 'Learn Spanish conversation, grammar, and vocabulary', 1, NOW()),
('Digital Marketing', 'Business', 'Social media marketing, SEO, and online advertising', 1, NOW()),
('Yoga', 'Fitness', 'Yoga poses, breathing techniques, and meditation', 1, NOW()),
('Data Analysis', 'Programming', 'Excel, SQL, Python for data analysis and visualization', 1, NOW()),
('Graphic Design', 'Design', 'Adobe Photoshop, Illustrator, and design principles', 1, NOW()),
('French Language', 'Language', 'Learn French conversation and grammar', 1, NOW()),
('Piano Playing', 'Music', 'Learn piano from beginner to intermediate level', 1, NOW()),
('Video Editing', 'Creative', 'Adobe Premiere Pro and video production techniques', 1, NOW()),
('Public Speaking', 'Communication', 'Improve presentation and public speaking skills', 1, NOW()),
('Machine Learning', 'Programming', 'Introduction to ML algorithms and implementation', 1, NOW()),
('Drawing', 'Creative', 'Pencil drawing, sketching, and artistic techniques', 1, NOW()),
('Writing', 'Communication', 'Creative writing, blogging, and content creation', 1, NOW()),
('Fitness Training', 'Fitness', 'Personal training and workout planning', 1, NOW()),
('Excel Advanced', 'Business', 'Advanced Excel formulas, pivot tables, and macros', 1, NOW()),
('Mobile App Development', 'Programming', 'iOS and Android app development', 1, NOW());

-- Insert achievements
INSERT INTO core_achievement (name, description, icon, points_required) VALUES
('First Swap', 'Complete your first skill swap successfully', 'fas fa-handshake', 10),
('Skill Master', 'Offer 5 different skills to the community', 'fas fa-graduation-cap', 50),
('Social Butterfly', 'Connect and chat with 10 different users', 'fas fa-users', 100),
('Teacher', 'Complete 10 swaps as a skill teacher', 'fas fa-chalkboard-teacher', 200),
('Student', 'Complete 10 swaps as a skill learner', 'fas fa-book-reader', 200),
('Community Helper', 'Receive 50 positive ratings from other users', 'fas fa-heart', 500),
('Popular Teacher', 'Have 20 users request your skills', 'fas fa-star', 300),
('Dedicated Learner', 'Send 25 swap requests to learn new skills', 'fas fa-brain', 250),
('Five Star Teacher', 'Maintain a 5-star average rating with 10+ ratings', 'fas fa-trophy', 400),
('Skill Collector', 'Learn 15 different skills through swaps', 'fas fa-collection', 600);

-- Insert admin messages
INSERT INTO core_adminmessage (title, content, is_active, created_at) VALUES
('Welcome to SkillSwap!', 'Thank you for joining our community! Start by adding your skills and browsing other users to find perfect matches.', 1, NOW()),
('New Features Added', 'We have added a new leaderboard and achievement system. Check them out and start earning points!', 1, NOW()),
('Community Guidelines', 'Please be respectful and professional in all your interactions. Report any inappropriate behavior to our admin team.', 1, NOW()),
('Skill Verification', 'We now offer skill verification for expert-level users. Contact admin if you want to get verified.', 1, NOW()),
('Mobile App Coming Soon', 'We are working on a mobile app for SkillSwap. Stay tuned for updates!', 1, NOW());

-- Note: User data should be created through the Django admin or registration form
-- as it requires proper password hashing and Django's user management system
