-- Add password column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add index for email and password for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password);