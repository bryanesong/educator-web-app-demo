const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Simulate the getUserType function locally
function getUserType(user) {
  if (!user) return 'demo';
  
  const metadata = user.user_metadata || {};
  const role = metadata.role;
  const permissions = metadata.permissions || [];
  const adminLevel = metadata.admin_level;
  const email = user.email?.toLowerCase() || '';
  
  console.log('User email:', email);
  console.log('User metadata:', metadata);
  console.log('Role:', role);
  console.log('Permissions:', permissions);
  console.log('Admin level:', adminLevel);
  
  // Check for admin users first (highest authority)
  if (
    role === 'admin' ||
    adminLevel === 'super_admin' ||
    permissions.includes('create_educator_accounts') ||
    permissions.includes('manage_educator_accounts') ||
    email === 'bryanesong@gmail.com' ||
    metadata.account_type === 'admin'
  ) {
    return 'admin';
  }
  
  // Check for demo users (lowest authority)
  if (
    email.includes('demo') ||
    email.includes('teacher@example.com') ||
    email.includes('educator@demo.com') ||
    metadata.account_type === 'demo' ||
    role === 'demo' ||
    metadata.demo === true
  ) {
    return 'demo';
  }
  
  // Everyone else is an educator (normal authority)
  return 'educator';
}

async function debugUserType() {
  console.log('Debugging user type detection for bryanesong@gmail.com...\n');

  try {
    // Get the user
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
    
    console.log('=== USER DATA ===');
    console.log('Email:', adminUser.email);
    console.log('ID:', adminUser.id);
    console.log('Full user object:', JSON.stringify(adminUser, null, 2));
    
    console.log('\n=== USER TYPE DETECTION ===');
    const detectedType = getUserType(adminUser);
    console.log('Detected user type:', detectedType);
    
    if (detectedType === 'admin') {
      console.log('✅ User correctly detected as admin!');
    } else {
      console.log('❌ User NOT detected as admin. Detected as:', detectedType);
    }
    
  } catch (err) {
    console.error('Debug failed:', err);
  }
}

debugUserType();