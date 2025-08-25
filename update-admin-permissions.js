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

async function updateAdminPermissions() {
  console.log('Updating admin permissions for bryanesong@gmail.com...');

  try {
    // First, get the user
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error fetching users:', getUserError);
      return;
    }
    
    const adminUser = users.users.find(user => user.email === 'bryanesong@gmail.com');
    
    if (!adminUser) {
      console.error('❌ User bryanesong@gmail.com not found');
      return;
    }
    
    console.log('Found user:', adminUser.email, 'ID:', adminUser.id);
    console.log('Current metadata:', adminUser.user_metadata);
    
    // Update the user's metadata
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          ...adminUser.user_metadata,
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
          account_type: 'admin'
        }
      }
    );

    if (updateError) {
      console.error('Error updating admin permissions:', updateError);
    } else {
      console.log('✅ Admin permissions updated successfully!');
      console.log('Email:', updateData.user.email);
      console.log('User ID:', updateData.user.id);
      console.log('Role:', updateData.user.user_metadata.role);
      console.log('Permissions:', updateData.user.user_metadata.permissions);
      console.log('Admin Level:', updateData.user.user_metadata.admin_level);
      console.log('Account Type:', updateData.user.user_metadata.account_type);
    }
  } catch (err) {
    console.error('Admin permission update failed:', err);
  }

  console.log('Admin permission update complete!');
}

updateAdminPermissions();