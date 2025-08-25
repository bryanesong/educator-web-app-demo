import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'

export interface WebAppAccount {
  id: number
  supabase_user_id: string
  email: string
  full_name?: string
  account_type: 'demo' | 'educator' | 'admin'
  role: string
  school?: string
  district?: string
  permissions: string[]
  admin_level?: string
  is_active: boolean
  demo_expires_at?: string
  created_at: string
  updated_at: string
  created_by?: string
  notes?: string
}

export type UserType = 'demo' | 'educator' | 'admin' | 'demo-admin'

/**
 * Get user type from database table (when available) or fallback to auth metadata
 */
export async function getUserTypeFromDatabase(user: User | null): Promise<UserType> {
  if (!user) return 'demo'
  
  const supabase = createClient()
  
  try {
    // Try to get from database table first
    const { data: account, error } = await supabase
      .from('web_app_accounts')
      .select('account_type, is_active, demo_expires_at')
      .eq('supabase_user_id', user.id)
      .single()
    
    if (!error && account) {
      // Check if demo account is expired
      if (account.account_type === 'demo' && account.demo_expires_at) {
        const expiryDate = new Date(account.demo_expires_at)
        if (expiryDate < new Date()) {
          console.warn('Demo account expired:', account.demo_expires_at)
          return 'demo' // Still return demo but could be handled differently
        }
      }
      
      // Check if account is active
      if (!account.is_active) {
        console.warn('User account is disabled')
        return 'demo' // Fallback to demo for inactive accounts
      }
      
      return account.account_type as UserType
    }
  } catch (dbError) {
    console.warn('Database lookup failed, falling back to auth metadata:', dbError)
  }
  
  // Fallback to auth metadata if database table doesn't exist or lookup fails
  return getUserTypeFromMetadata(user)
}

/**
 * Get user type from Supabase auth metadata (current method)
 */
export function getUserTypeFromMetadata(user: User | null): UserType {
  if (!user) return 'demo'
  
  const metadata = user.user_metadata || {}
  const role = metadata.role
  const permissions = metadata.permissions || []
  const adminLevel = metadata.admin_level
  const email = user.email?.toLowerCase() || ''
  
  // Check for demo admin users (special case)
  if (email === 'admin@school.edu') {
    return 'demo-admin'
  }
  
  // Check for admin users first (highest authority)
  if (
    role === 'admin' ||
    adminLevel === 'super_admin' ||
    permissions.includes('create_educator_accounts') ||
    permissions.includes('manage_educator_accounts') ||
    email === 'bryanesong@gmail.com' ||
    metadata.account_type === 'admin'
  ) {
    return 'admin'
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
    return 'demo'
  }
  
  // Everyone else is an educator (normal authority)
  return 'educator'
}

/**
 * Get full account information from database
 */
export async function getWebAppAccount(user: User | null): Promise<WebAppAccount | null> {
  if (!user) return null
  
  const supabase = createClient()
  
  try {
    const { data: account, error } = await supabase
      .from('web_app_accounts')
      .select('*')
      .eq('supabase_user_id', user.id)
      .single()
    
    if (error) {
      console.warn('Could not fetch web app account:', error)
      return null
    }
    
    return account as WebAppAccount
  } catch (error) {
    console.warn('Database error fetching web app account:', error)
    return null
  }
}

/**
 * Create or update web app account in database
 */
export async function upsertWebAppAccount(user: User, accountData: Partial<WebAppAccount>): Promise<WebAppAccount | null> {
  if (!user) return null
  
  const supabase = createClient()
  
  const accountRecord = {
    supabase_user_id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name || accountData.full_name,
    account_type: accountData.account_type || 'educator',
    role: accountData.role || 'educator', 
    school: accountData.school || user.user_metadata?.school,
    district: accountData.district || user.user_metadata?.district,
    permissions: accountData.permissions || [],
    admin_level: accountData.admin_level,
    created_by: accountData.created_by || 'system',
    notes: accountData.notes
  }
  
  try {
    const { data: account, error } = await supabase
      .from('web_app_accounts')
      .upsert(accountRecord, {
        onConflict: 'supabase_user_id'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Could not upsert web app account:', error)
      return null
    }
    
    return account as WebAppAccount
  } catch (error) {
    console.error('Database error upserting web app account:', error)
    return null
  }
}

/**
 * Get user permissions from database or fallback to metadata
 */
export async function getUserPermissions(user: User | null): Promise<string[]> {
  if (!user) return []
  
  // Try database first
  const account = await getWebAppAccount(user)
  if (account?.permissions) {
    return account.permissions
  }
  
  // Fallback to metadata
  const metadata = user.user_metadata || {}
  return metadata.permissions || []
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(user: User | null, permission: string): Promise<boolean> {
  const permissions = await getUserPermissions(user)
  return permissions.includes(permission)
}

/**
 * Sync auth metadata to database (migration helper)
 */
export async function syncAuthMetadataToDatabase(user: User): Promise<WebAppAccount | null> {
  const metadata = user.user_metadata || {}
  
  const userType = getUserTypeFromMetadata(user);
  const accountData: Partial<WebAppAccount> = {
    account_type: userType === 'demo-admin' ? 'demo' : userType,
    role: metadata.role || 'educator',
    school: metadata.school,
    district: metadata.district,
    permissions: metadata.permissions || [],
    admin_level: metadata.admin_level,
    created_by: metadata.created_by || 'migration'
  }
  
  return await upsertWebAppAccount(user, accountData)
}