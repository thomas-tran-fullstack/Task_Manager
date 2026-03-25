-- Task Manager Database Schema
-- Created: 2024-03-25
-- Description: Complete database schema for Task Management Application

-- ===================================
-- Create Database
-- ===================================
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- ===================================
-- Users Table
-- ===================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  profile_picture VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  INDEX idx_email (email),
  INDEX idx_google_id (google_id),
  INDEX idx_created_at (created_at)
);

-- ===================================
-- OTP Verification Table
-- ===================================
CREATE TABLE otp_verification (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  purpose ENUM('email_verification', 'password_reset', 'google_signup') DEFAULT 'email_verification',
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_expires_at (expires_at),
  INDEX idx_otp_code (otp_code)
);

-- ===================================
-- Password Reset Tokens Table
-- ===================================
CREATE TABLE password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  reset_token VARCHAR(255) NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reset_token (reset_token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- ===================================
-- Tasks Table
-- ===================================
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('TODO', 'In Progress', 'Done') DEFAULT 'TODO',
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  deadline DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL,
  tags VARCHAR(500),
  category VARCHAR(100),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_deadline (deadline),
  INDEX idx_created_at (created_at),
  INDEX idx_user_status (user_id, status),
  INDEX idx_user_deadline (user_id, deadline)
);

-- ===================================
-- Task History Table (Audit Trail)
-- ===================================
CREATE TABLE task_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  action ENUM('created', 'updated', 'status_changed', 'deleted', 'restored') DEFAULT 'updated',
  changed_fields JSON,
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- ===================================
-- Task Comments Table (Optional Enhancement)
-- ===================================
CREATE TABLE task_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- ===================================
-- Task Attachments Table (Optional Enhancement)
-- ===================================
CREATE TABLE task_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  file_type VARCHAR(50),
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id)
);

-- ===================================
-- Login Activity Table (Security Audit)
-- ===================================
CREATE TABLE login_activity (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  login_method ENUM('email', 'google', 'otp') DEFAULT 'email',
  success BOOLEAN DEFAULT TRUE,
  failure_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- ===================================
-- User Settings Table
-- ===================================
CREATE TABLE user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  theme ENUM('light', 'dark') DEFAULT 'light',
  notification_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  deadline_reminder_hours INT DEFAULT 24,
  tasks_per_page INT DEFAULT 10,
  default_view ENUM('board', 'list', 'calendar') DEFAULT 'board',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===================================
-- Create Views for Statistics
-- ===================================

-- User Task Statistics View
CREATE VIEW user_task_statistics AS
SELECT 
  u.id as user_id,
  u.name,
  COUNT(t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'Done' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
  SUM(CASE WHEN t.status = 'TODO' THEN 1 ELSE 0 END) as todo_tasks,
  SUM(CASE WHEN t.status = 'Done' AND t.completed_at IS NOT NULL THEN 1 ELSE 0 END) as completed_count,
  SUM(CASE WHEN t.deadline IS NOT NULL AND t.deadline < NOW() AND t.status != 'Done' THEN 1 ELSE 0 END) as overdue_tasks,
  SUM(CASE WHEN t.deadline IS NOT NULL AND t.deadline < DATE_ADD(NOW(), INTERVAL 24 HOUR) AND t.deadline > NOW() AND t.status != 'Done' THEN 1 ELSE 0 END) as due_soon_tasks
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id AND t.is_deleted = FALSE
GROUP BY u.id, u.name;

-- Task Priority Distribution View
CREATE VIEW task_priority_distribution AS
SELECT 
  user_id,
  priority,
  COUNT(*) as count,
  SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as completed
FROM tasks
WHERE is_deleted = FALSE
GROUP BY user_id, priority;

-- ===================================
-- Create Indexes for Performance
-- ===================================

-- Additional composite indexes for common queries
CREATE INDEX idx_tasks_user_status_deadline ON tasks(user_id, status, deadline);
CREATE INDEX idx_otp_email_purpose ON otp_verification(email, purpose);

-- ===================================
-- Sample Data (Optional)
-- ===================================

-- Insert sample user (password: Test@123 -> bcrypt)
-- Note: Password hash should be generated using bcrypt in application
INSERT INTO users (email, name, password_hash, is_verified, verification_date)
VALUES ('demo@example.com', 'Demo User', 'hashed_password_here', TRUE, NOW());

-- ===================================
-- Stored Procedures
-- ===================================

-- Procedure to get user statistics
DELIMITER //

CREATE PROCEDURE GetUserStatistics(IN p_user_id INT)
BEGIN
  SELECT 
    COUNT(CASE WHEN status = 'TODO' THEN 1 END) as todo_count,
    COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN status = 'Done' THEN 1 END) as done_count,
    COUNT(*) as total_count,
    COUNT(CASE WHEN deadline < NOW() AND status != 'Done' THEN 1 END) as overdue_count
  FROM tasks
  WHERE user_id = p_user_id AND is_deleted = FALSE;
END //

-- Procedure to clean up expired OTP records
CREATE PROCEDURE CleanupExpiredOTP()
BEGIN
  DELETE FROM otp_verification 
  WHERE expires_at < NOW();
END //

-- Procedure to clean up expired reset tokens
CREATE PROCEDURE CleanupExpiredResetTokens()
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW() AND is_used = FALSE;
END //

DELIMITER ;

-- ===================================
-- Create Events for Maintenance
-- ===================================

-- Event to clean up expired OTP records daily
CREATE EVENT cleanup_otp_daily
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO CALL CleanupExpiredOTP();

-- Event to clean up expired reset tokens daily
CREATE EVENT cleanup_reset_tokens_daily
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO CALL CleanupExpiredResetTokens();
