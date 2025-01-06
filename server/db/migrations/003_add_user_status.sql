-- Add user status tracking
CREATE TYPE user_status AS ENUM ('online', 'offline', 'away', 'do_not_disturb');

ALTER TABLE users
ADD COLUMN status user_status DEFAULT 'offline',
ADD COLUMN last_seen_at TIMESTAMP WITH TIME ZONE; 