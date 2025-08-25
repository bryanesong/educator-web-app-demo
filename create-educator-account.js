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

async function createEducatorAccount() {
  console.log('Creating educator account...');

  try {
    const { data: educatorData, error: educatorError } = await supabase.auth.admin.createUser({
      email: 'educator@school.edu',
      password: 'educator123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Sarah Johnson',
        role: 'educator',
        account_type: 'educator',
        school: 'Lincoln Elementary School',
        district: 'Metro School District',
        created_by: 'admin'
      }
    });

    if (educatorError) {
      console.error('Error creating educator account:', educatorError);
    } else {
      console.log('✅ Educator account created successfully!');
      console.log('Email:', educatorData.user.email);
      console.log('Password: educator123');
      console.log('User ID:', educatorData.user.id);
      console.log('Role:', educatorData.user.user_metadata.role);
      console.log('Account Type:', educatorData.user.user_metadata.account_type);
      console.log('School:', educatorData.user.user_metadata.school);
    }
  } catch (err) {
    console.error('Educator account creation failed:', err);
  }

  console.log('Educator account creation complete!');
}

createEducatorAccount();