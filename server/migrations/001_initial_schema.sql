-- ManageStudio PostgreSQL Production/Staging Schema
-- Migration: 001_initial_schema.sql

-- 1. Studios Table
CREATE TABLE IF NOT EXISTS studios (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  owner_uid VARCHAR(128),
  storage_limit_gb NUMERIC(10,2) DEFAULT 500.0,
  storage_used_gb NUMERIC(10,2) DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studios_owner_uid ON studios (owner_uid);
CREATE INDEX IF NOT EXISTS idx_studios_email ON studios (email);

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  studio_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  enquiry_type VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Albums Table
CREATE TABLE IF NOT EXISTS albums (
  id VARCHAR(64) PRIMARY KEY,
  studio_id VARCHAR(64) NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  wedding_date VARCHAR(64),
  description TEXT,
  cover_photo_url TEXT,
  client_token VARCHAR(128) UNIQUE NOT NULL,
  status VARCHAR(32) DEFAULT 'IN_PROGRESS',
  max_selections INTEGER DEFAULT 100,
  submitted_at TIMESTAMPTZ,
  client_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_albums_studio_id ON albums (studio_id);
CREATE INDEX IF NOT EXISTS idx_albums_client_token ON albums (client_token);
CREATE INDEX IF NOT EXISTS idx_albums_status ON albums (status);

-- 4. Photos Table
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(64) PRIMARY KEY,
  album_id VARCHAR(64) NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  size_bytes BIGINT DEFAULT 2500000,
  width INTEGER DEFAULT 2400,
  height INTEGER DEFAULT 1600,
  is_selected INTEGER DEFAULT 0,
  selected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos (album_id);
CREATE INDEX IF NOT EXISTS idx_photos_is_selected ON photos (album_id, is_selected);

-- 5. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  album_id VARCHAR(64) NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  action VARCHAR(128) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_album_id ON activity_logs (album_id);

-- 6. Subscription Orders Table
CREATE TABLE IF NOT EXISTS subscription_orders (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(128) UNIQUE NOT NULL,
  payment_id VARCHAR(128),
  user_uid VARCHAR(128) NOT NULL,
  studio_id VARCHAR(64) NOT NULL,
  amount_paise BIGINT NOT NULL,
  currency VARCHAR(16) DEFAULT 'INR',
  modules_json TEXT NOT NULL,
  storage_gb INTEGER NOT NULL,
  status VARCHAR(32) DEFAULT 'CREATED',
  razorpay_signature TEXT,
  coupon_code VARCHAR(64),
  discount_paise BIGINT DEFAULT 0,
  original_amount_paise BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON subscription_orders (order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON subscription_orders (user_uid);
CREATE INDEX IF NOT EXISTS idx_orders_status ON subscription_orders (status);

-- 7. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  user_uid VARCHAR(128) NOT NULL,
  studio_id VARCHAR(64) NOT NULL,
  plan_name VARCHAR(128) DEFAULT 'Custom',
  modules_json TEXT NOT NULL,
  storage_quota_gb INTEGER NOT NULL,
  status VARCHAR(32) DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_uid ON subscriptions (user_uid);
CREATE INDEX IF NOT EXISTS idx_subscriptions_studio_id ON subscriptions (studio_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);

-- 8. Payment Audit Logs Table
CREATE TABLE IF NOT EXISTS payment_audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(128),
  payment_id VARCHAR(128),
  event_type VARCHAR(128) NOT NULL,
  details_json TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_order_id ON payment_audit_logs (order_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON payment_audit_logs (event_type);

-- 9. Device Activations (Desktop Licensing) Table
CREATE TABLE IF NOT EXISTS device_activations (
  id VARCHAR(64) PRIMARY KEY,
  user_uid VARCHAR(128) NOT NULL,
  studio_id VARCHAR(64) NOT NULL,
  device_id VARCHAR(128) NOT NULL,
  device_name VARCHAR(255),
  os_info VARCHAR(255),
  ip_address VARCHAR(64),
  is_active INTEGER DEFAULT 1,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_user_uid ON device_activations (user_uid);
CREATE INDEX IF NOT EXISTS idx_devices_user_device ON device_activations (user_uid, device_id);
CREATE INDEX IF NOT EXISTS idx_devices_active ON device_activations (user_uid, is_active);
