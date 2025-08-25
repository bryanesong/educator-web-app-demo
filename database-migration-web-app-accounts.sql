-- Migration: Create web_app_accounts table
-- This should be applied to the Supabase database manually
-- This table is specifically for web app accounts (separate from mobile app testdb_userauth)

-- Create web_app_accounts table to track educator web app user account types and permissions
CREATE TABLE IF NOT EXISTS web_app_accounts (
    id BIGSERIAL PRIMARY KEY,
    supabase_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    account_type VARCHAR(50) NOT NULL DEFAULT 'educator' CHECK (account_type IN ('demo', 'educator', 'admin')),
    role VARCHAR(50) NOT NULL DEFAULT 'educator',
    school VARCHAR(255),
    district VARCHAR(255),
    permissions TEXT[] DEFAULT '{}',
    admin_level VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    demo_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by VARCHAR(255),
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_web_app_accounts_supabase_user_id ON web_app_accounts(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_web_app_accounts_email ON web_app_accounts(email);
CREATE INDEX IF NOT EXISTS idx_web_app_accounts_account_type ON web_app_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_web_app_accounts_school ON web_app_accounts(school);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_web_app_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_web_app_accounts_updated_at ON web_app_accounts;
CREATE TRIGGER trigger_web_app_accounts_updated_at
    BEFORE UPDATE ON web_app_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_web_app_accounts_updated_at();

-- Insert the existing admin user
INSERT INTO web_app_accounts (
    supabase_user_id, 
    email, 
    full_name, 
    account_type, 
    role, 
    school, 
    district, 
    permissions, 
    admin_level, 
    created_by
) VALUES (
    '6226ecb8-f4fd-46c8-b254-821bccbcb3c5',
    'bryanesong@gmail.com',
    'Bryan Song',
    'admin',
    'admin',
    'Wiillow Platform',
    'System Administrator',
    ARRAY['view_all_children_data', 'create_educator_accounts', 'manage_educator_accounts', 'view_all_conversations', 'view_all_analytics', 'export_data', 'system_administration'],
    'super_admin',
    'system'
) ON CONFLICT (supabase_user_id) DO UPDATE SET
    account_type = EXCLUDED.account_type,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    admin_level = EXCLUDED.admin_level,
    updated_at = now();

-- Add comments
COMMENT ON TABLE web_app_accounts IS 'Stores web app educator account information, permissions, and account types (separate from mobile app)';
COMMENT ON COLUMN web_app_accounts.supabase_user_id IS 'References the Supabase auth.users table';
COMMENT ON COLUMN web_app_accounts.account_type IS 'User account type: demo, educator, or admin';
COMMENT ON COLUMN web_app_accounts.permissions IS 'Array of permission strings for granular access control';
COMMENT ON COLUMN web_app_accounts.demo_expires_at IS 'When demo accounts expire (NULL for permanent accounts)';

-- Enable Row Level Security
ALTER TABLE web_app_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own account" ON web_app_accounts
    FOR SELECT USING (supabase_user_id = auth.uid());

CREATE POLICY "Admins can view all accounts" ON web_app_accounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM web_app_accounts ea 
            WHERE ea.supabase_user_id = auth.uid() 
            AND ea.account_type = 'admin'
        )
    );

CREATE POLICY "Admins can update all accounts" ON web_app_accounts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM web_app_accounts ea 
            WHERE ea.supabase_user_id = auth.uid() 
            AND ea.account_type = 'admin'
        )
    );

CREATE POLICY "Admins can insert new accounts" ON web_app_accounts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM web_app_accounts ea 
            WHERE ea.supabase_user_id = auth.uid() 
            AND ea.account_type = 'admin'
        )
    );