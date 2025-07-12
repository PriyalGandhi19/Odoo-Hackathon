-- SkillSwap Database Schema
-- Run this script to create all tables manually if needed

-- Create database
CREATE DATABASE IF NOT EXISTS skillswap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillswap_db;

-- Django's built-in auth tables (Django will create these automatically)
-- But here's the structure for reference:

-- Users table (Django's auth_user)
CREATE TABLE IF NOT EXISTS auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME(6),
    is_superuser TINYINT(1) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_staff TINYINT(1) NOT NULL,
    is_active TINYINT(1) NOT NULL,
    date_joined DATETIME(6) NOT NULL
);

-- User Profiles table
CREATE TABLE IF NOT EXISTS core_userprofile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    profile_photo VARCHAR(100) NOT NULL,
    bio LONGTEXT NOT NULL,
    availability VARCHAR(20) NOT NULL,
    visibility VARCHAR(10) NOT NULL,
    points INT NOT NULL DEFAULT 0,
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    is_banned TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

-- Skills table
CREATE TABLE IF NOT EXISTS core_skill (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description LONGTEXT NOT NULL,
    is_approved TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(6) NOT NULL
);

-- User Skills table (junction table for users and skills)
CREATE TABLE IF NOT EXISTS core_userskill (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_type VARCHAR(10) NOT NULL,
    level VARCHAR(15) NOT NULL DEFAULT 'beginner',
    description LONGTEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    skill_id BIGINT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (skill_id) REFERENCES core_skill(id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    UNIQUE KEY unique_user_skill_type (user_id, skill_id, skill_type)
);

-- Swap Requests table
CREATE TABLE IF NOT EXISTS core_swaprequest (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message LONGTEXT NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'pending',
    scheduled_date DATETIME(6),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    receiver_id INT NOT NULL,
    requester_id INT NOT NULL,
    skill_offered_id BIGINT NOT NULL,
    skill_wanted_id BIGINT NOT NULL,
    FOREIGN KEY (receiver_id) REFERENCES auth_user(id),
    FOREIGN KEY (requester_id) REFERENCES auth_user(id),
    FOREIGN KEY (skill_offered_id) REFERENCES core_skill(id),
    FOREIGN KEY (skill_wanted_id) REFERENCES core_skill(id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS core_rating (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    feedback LONGTEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    rated_user_id INT NOT NULL,
    rater_id INT NOT NULL,
    swap_request_id BIGINT NOT NULL,
    FOREIGN KEY (rated_user_id) REFERENCES auth_user(id),
    FOREIGN KEY (rater_id) REFERENCES auth_user(id),
    FOREIGN KEY (swap_request_id) REFERENCES core_swaprequest(id),
    UNIQUE KEY unique_swap_rating (swap_request_id, rater_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS core_message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content LONGTEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    receiver_id INT NOT NULL,
    sender_id INT NOT NULL,
    FOREIGN KEY (receiver_id) REFERENCES auth_user(id),
    FOREIGN KEY (sender_id) REFERENCES auth_user(id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS core_achievement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description LONGTEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    points_required INT NOT NULL
);

-- User Achievements table (junction table)
CREATE TABLE IF NOT EXISTS core_userachievement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    earned_at DATETIME(6) NOT NULL,
    achievement_id BIGINT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (achievement_id) REFERENCES core_achievement(id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    UNIQUE KEY unique_user_achievement (user_id, achievement_id)
);

-- Admin Messages table
CREATE TABLE IF NOT EXISTS core_adminmessage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(6) NOT NULL
);

-- Django's migration tracking table
CREATE TABLE IF NOT EXISTS django_migrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME(6) NOT NULL
);

-- Django's content types table
CREATE TABLE IF NOT EXISTS django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE KEY django_content_type_app_label_model (app_label, model)
);

-- Django's sessions table
CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) NOT NULL PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME(6) NOT NULL,
    KEY django_session_expire_date (expire_date)
);

-- Create indexes for better performance
CREATE INDEX idx_userprofile_visibility ON core_userprofile(visibility);
CREATE INDEX idx_userprofile_points ON core_userprofile(points DESC);
CREATE INDEX idx_skill_category ON core_skill(category);
CREATE INDEX idx_skill_approved ON core_skill(is_approved);
CREATE INDEX idx_userskill_type ON core_userskill(skill_type);
CREATE INDEX idx_swaprequest_status ON core_swaprequest(status);
CREATE INDEX idx_swaprequest_created ON core_swaprequest(created_at DESC);
CREATE INDEX idx_message_read ON core_message(is_read);
CREATE INDEX idx_message_created ON core_message(created_at DESC);
CREATE INDEX idx_rating_rating ON core_rating(rating);
