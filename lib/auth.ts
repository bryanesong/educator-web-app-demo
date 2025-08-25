import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signUp(email: string, password: string, userData?: {
  full_name?: string
  role?: string
  school?: string
  district?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}

// User type definitions
export type UserType = 'demo' | 'educator' | 'admin';

export async function getUserType(user: User | null): Promise<UserType> {
  if (!user) return 'demo';
  
  const metadata = user.user_metadata || {};
  const role = metadata.role;
  const permissions = metadata.permissions || [];
  const adminLevel = metadata.admin_level;
  const email = user.email?.toLowerCase() || '';
  
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

export async function isAdminUser(user: User | null): Promise<boolean> {
  const userType = await getUserType(user);
  return userType === 'admin';
}

export async function isEducatorUser(user: User | null): Promise<boolean> {
  const userType = await getUserType(user);
  return userType === 'educator';
}

export async function isDemoUser(user: User | null): Promise<boolean> {
  const userType = await getUserType(user);
  return userType === 'demo';
}

export async function getAdminPermissions(user: User | null): Promise<string[]> {
  if (!user) return []
  
  const metadata = user.user_metadata || {}
  return metadata.permissions || []
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Auth state change listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  const supabase = createClient()
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user ?? null)
    }
  )

  return () => subscription.unsubscribe()
}