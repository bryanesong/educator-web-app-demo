# 🔐 Security Guide - Environment Variables & Secrets

## **⚠️ Critical Security Information**

This guide ensures all secrets and sensitive configuration are properly secured and not exposed in the codebase.

## **📁 Environment Variables Setup**

### **Required Files:**

1. **`.env.local`** - Your actual environment variables (NEVER commit this)
2. **`.env.example`** - Template showing required variables (safe to commit)

### **Environment Variables:**

```bash
# Django Backend Configuration
NEXT_PUBLIC_DJANGO_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Supabase Configuration (Public - safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Admin Configuration (PRIVATE - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## **🔒 Security Best Practices**

### **1. Environment Variable Types:**

- **`NEXT_PUBLIC_*`** - Exposed to browser (public data only)
- **No prefix** - Server-side only (sensitive data)

### **2. What's Safe vs Unsafe:**

✅ **SAFE TO EXPOSE (NEXT_PUBLIC_*):**
- Supabase URL
- Supabase Anon Key
- Django API URL
- Database connection strings (if using public endpoints)

❌ **NEVER EXPOSE (Server-side only):**
- Supabase Service Role Key
- Database passwords
- API secrets
- Admin tokens

### **3. File Security:**

```bash
# ✅ SAFE TO COMMIT:
.env.example          # Template file
.gitignore           # Includes .env.local

# ❌ NEVER COMMIT:
.env.local           # Your actual secrets
.env                 # Contains real values
.env.production      # Production secrets
```

## **🛡️ Implementation Status**

### **✅ Fixed Security Issues:**

1. **Hardcoded Supabase Keys Removed**
   - All account creation scripts now use environment variables
   - Added proper error handling for missing env vars

2. **Environment Variable Validation**
   - Scripts check for required variables before running
   - Clear error messages if configuration is missing

3. **Secure Account Creation Scripts**
   - `create-admin-account.js` ✅ Uses env vars
   - `create-demo-account.js` ✅ Uses env vars  
   - `create-educator-account.js` ✅ Uses env vars

### **📋 Security Checklist:**

- ✅ No hardcoded secrets in source code
- ✅ Environment variables properly configured
- ✅ .env.local excluded from version control
- ✅ .env.example provided as template
- ✅ Proper public/private variable separation
- ✅ Error handling for missing configuration

## **🚀 Setup Instructions**

### **1. Initial Setup:**
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual values
nano .env.local
```

### **2. Required Values:**
Get these from your Supabase project dashboard:
- Project URL: https://app.supabase.com/project/[your-project]/settings/api
- Anon Key: Public API key (safe to expose)
- Service Role Key: Admin key (keep secret!)

### **3. Verify Setup:**
```bash
# Test account creation (should use env vars)
node create-demo-account.js
```

## **🔍 Verification**

### **Check Your Setup:**

1. **Verify .env.local exists and has values**
2. **Confirm .env.local is in .gitignore**
3. **Test scripts work with environment variables**
4. **Ensure no secrets in committed code**

### **Red Flags:**
❌ Any file containing actual Supabase keys  
❌ Hardcoded URLs or tokens in JavaScript  
❌ .env.local committed to git  
❌ Service role keys in NEXT_PUBLIC_ variables  

## **🆘 Emergency Response**

### **If Secrets Were Exposed:**

1. **Immediately rotate all exposed keys**
2. **Revoke old service role keys in Supabase**
3. **Generate new API keys**
4. **Update .env.local with new values**
5. **Verify no secrets in git history**

### **Prevention:**
- Regular security audits
- Environment variable validation
- Automated secret scanning
- Team security training

## **📞 Support**

If you discover any security issues or need help with environment configuration:

1. Never post actual secrets in issues/chat
2. Use placeholder values in examples
3. Reference this guide for proper setup
4. Test all changes in development first

Remember: **Security is everyone's responsibility!** 🛡️