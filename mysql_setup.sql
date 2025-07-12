-- MySQL script to create the 'skillswap_db' database and tables with sample data

CREATE DATABASE IF NOT EXISTS skillswap_db;
USE skillswap_db;

-- Create a sample users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, email, password) VALUES
('stuti', 'stuti@example.com', 'pass1'),
('darshit', 'darshit@example.com', 'pass2'),
('priyal', 'priyal@example.com', 'pass3'),
('vaishal', 'vaishal@example.com', 'pass4');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    location VARCHAR(100),
    profile_photo VARCHAR(255),
    availability_weekdays_evenings BOOLEAN DEFAULT FALSE,
    availability_weekends BOOLEAN DEFAULT FALSE,
    availability_flexible BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample profiles
INSERT INTO profiles (user_id, location, profile_photo, availability_weekdays_evenings, availability_weekends, availability_flexible, is_public, is_verified, is_banned, points) VALUES
(1, 'New York', 'profile1.jpg', TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, 10),
(2, 'Los Angeles', 'profile2.jpg', FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, 5),
(3, 'Chicago', 'profile3.jpg', TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, 8),
(4, 'Houston', 'profile4.jpg', FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, 12);
