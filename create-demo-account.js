const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env.local file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createDemoAccount() {
  console.log('Creating demo teacher account...');

  try {
    const { data: demoData, error: demoError } = await supabase.auth.admin.createUser({
      email: 'teacher@demo.com',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo Teacher',
        role: 'demo',
        account_type: 'demo',
        school: 'Demo Elementary School',
        district: 'Demo School District',
        demo: true,
        created_by: 'system'
      }
    });

    if (demoError) {
      console.error('Error creating demo account:', demoError);
    } else {
      console.log('✅ Demo teacher account created successfully!');
      console.log('Email:', demoData.user.email);
      console.log('Password: demo123');
      console.log('User ID:', demoData.user.id);
      console.log('Role:', demoData.user.user_metadata.role);
      console.log('Account Type:', demoData.user.user_metadata.account_type);
      console.log('Demo Status:', demoData.user.user_metadata.demo);
    }
  } catch (err) {
    console.error('Demo account creation failed:', err);
  }

  console.log('Demo account creation complete!');
}

createDemoAccount();