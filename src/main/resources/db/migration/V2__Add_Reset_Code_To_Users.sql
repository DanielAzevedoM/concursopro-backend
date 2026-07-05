ALTER TABLE users ADD COLUMN reset_code VARCHAR(6);
ALTER TABLE users ADD COLUMN reset_code_expiry TIMESTAMP;
