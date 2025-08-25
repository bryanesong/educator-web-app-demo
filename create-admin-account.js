const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAccount() {
  console.log('Creating admin account...');

  try {
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'bryanesong@gmail.com',
      password: 'beary0021',
      email_confirm: true,
      user_metadata: {
        full_name: 'Bryan Song',
        role: 'admin',
        permissions: [
          'view_all_children_data',
          'create_educator_accounts',
          'manage_educator_accounts',
          'view_all_conversations',
          'view_all_analytics',
          'export_data',
          'system_administration'
        ],
        school: 'Wiillow Platform',
        district: 'System Administrator',
        admin_level: 'super_admin',
        created_by: 'system',
        account_type: 'admin'
      }
    });

    if (adminError) {
      console.error('Error creating admin account:', adminError);
    } else {
      console.log('✅ Admin account created successfully!');
      console.log('Email:', adminData.user.email);
      console.log('User ID:', adminData.user.id);
      console.log('Role:', adminData.user.user_metadata.role);
      console.log('Permissions:', adminData.user.user_metadata.permissions);
      console.log('Admin Level:', adminData.user.user_metadata.admin_level);
    }
  } catch (err) {
    console.error('Admin account creation failed:', err);
  }

  console.log('Admin account creation complete!');
}

createAdminAccount();