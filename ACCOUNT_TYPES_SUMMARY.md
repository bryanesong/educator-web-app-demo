# 🎭 3-Tier Account System Summary

## **Account Hierarchy (Least → Most Authority)**

### 1. **📚 Demo Account** (Lowest Authority)
- **Purpose**: Allow prospective users to explore platform features
- **Data Access**: **Mock data only** - no real student information
- **Features**: View sample conversations, dashboard analytics, character stats
- **Restrictions**: Cannot access real API endpoints, admin features disabled
- **Visual Indicators**: Blue "Demo Mode" banner, "Demo" badge in sidebar

**Test Account:**
- **Email**: `teacher@demo.com`
- **Password**: `demo123`
- **Name**: Demo Teacher
- **School**: Demo Elementary School

---

### 2. **👩‍🏫 Educator Account** (Normal Authority)
- **Purpose**: Regular teachers and school staff managing their students
- **Data Access**: **Real student data** from Django API/Supabase
- **Features**: Full dashboard access, conversations, analytics, reports
- **Restrictions**: Cannot access admin portal, cannot manage other accounts
- **Visual Indicators**: No special badges (default user type)

**Test Account:**
- **Email**: `educator@school.edu`
- **Password**: `educator123`
- **Name**: Sarah Johnson
- **School**: Lincoln Elementary School

---

### 3. **🛡️ Admin Account** (Highest Authority)
- **Purpose**: System administrators who manage schools and educator accounts
- **Data Access**: **All real data** + administrative functions
- **Features**: Everything educators have + Admin Portal access
- **Admin Portal**: School management, educator account creation, system oversight
- **Visual Indicators**: "Admin" badge in sidebar, additional "Administration" nav section

**Test Account:**
- **Email**: `bryanesong@gmail.com`
- **Password**: `beary0021`
- **Name**: Bryan Song
- **Role**: Super Admin

---

## **🔄 Data Flow by Account Type**

### **Demo Users → Mock Data Service**
```
Demo Login → HybridApiClient → MockDataService → Sample Data
```
- **Conversations**: 8 realistic mock conversations with AI characters
- **Students**: 5 sample students (Emma, Liam, Sofia, Noah, Ava)
- **Analytics**: 650 total conversations, 8.3 avg mood score
- **Characters**: All 7 AI characters with usage stats

### **Educator Users → Django API**
```
Educator Login → HybridApiClient → Django API → Real Supabase Data
```
- **Conversations**: Actual student interactions from database
- **Students**: Real children profiles and data
- **Analytics**: Live statistics and metrics
- **Characters**: Real usage patterns and analytics

### **Admin Users → Django API + Admin Features**
```
Admin Login → HybridApiClient → Django API + Admin Portal
```
- **Everything Educators Have** +
- **School Management**: Create, edit, delete schools
- **Account Management**: Create educator accounts with auto-generated passwords
- **System Oversight**: View all data across schools

---

## **🚀 Technical Implementation**

### **User Type Detection** (`lib/auth.ts`)
```typescript
export async function getUserType(user: User | null): Promise<UserType> {
  // 1. Check Admin (highest priority)
  // 2. Check Demo (lowest priority) 
  // 3. Default to Educator (normal users)
}
```

### **Hybrid API Client** (`lib/api/hybrid-client.ts`)
```typescript
if (userType === 'demo') {
  return MockDataService.getData();
} else {
  return djangoApi.getRealData(); // educator + admin
}
```

### **Access Control**
- **Admin Portal**: Only `userType === 'admin'` can access `/dashboard/admin`
- **Demo Banner**: Only shows for `userType === 'demo'`
- **Navigation**: Admin users see additional "Administration" section
- **API Calls**: Demo users blocked from real API endpoints

---

## **🎯 Security & Data Protection**

### **Data Isolation**
- ✅ **Demo users cannot access real student data**
- ✅ **Educator users cannot access admin functions**
- ✅ **Admin users have appropriate elevated permissions**

### **Visual Feedback**
- 🔵 **Demo Mode Banner**: Clear indication when viewing sample data
- 🏷️ **User Type Badges**: "Demo" and "Admin" badges in sidebar
- 🚫 **Access Restrictions**: Proper redirects for unauthorized access

### **API Protection**
- 🛡️ **Demo users**: All real API calls return 403 Forbidden
- 🔐 **Role-based routing**: Admin portal requires admin privileges
- 📊 **Data segregation**: No cross-contamination between user types

---

## **🧪 Testing All Account Types**

### **Test Demo Account**
1. Login: `teacher@demo.com` / `demo123`
2. ✅ Should see blue "Demo Mode" banner
3. ✅ Should see mock conversations with sample students
4. ✅ Should NOT see admin navigation
5. ✅ Should show "Demo" badge in sidebar

### **Test Educator Account**
1. Login: `educator@school.edu` / `educator123`
2. ✅ Should see real data (if any in database)
3. ✅ Should NOT see demo banner
4. ✅ Should NOT see admin navigation
5. ✅ Should show no special badges (clean educator interface)

### **Test Admin Account**
1. Login: `bryanesong@gmail.com` / `beary0021`
2. ✅ Should see real data AND admin portal access
3. ✅ Should NOT see demo banner
4. ✅ Should see "Administration" section in navigation
5. ✅ Should show "Admin" badge in sidebar
6. ✅ Can access `/dashboard/admin` for school management

---

## **📋 Account Management Workflow**

### **For Admins Creating Educator Accounts:**
1. Login to admin account
2. Navigate to Admin Portal (`/dashboard/admin`)
3. Go to "Educator Accounts" tab
4. Click "Add Educator" button
5. Fill form: email, name, school selection, role
6. System auto-generates secure password
7. New educator gets email-based username + temporary password
8. Educator must change password on first login

### **Account Hierarchy Enforcement:**
- ✅ **Admins can create**: Educator accounts
- ✅ **Educators can view**: Their assigned students only
- ✅ **Demo users can explore**: Sample data safely
- ❌ **No cross-contamination**: Strict data boundaries

This 3-tier system ensures proper data security, user experience, and administrative control! 🎉