# 🔧 Authentication Fix Guide

## 🚨 Issue: AuthApiError: Invalid login credentials

### Root Cause Analysis
The authentication error is occurring because of one or more of these issues:

1. **No test user account exists** in your Supabase database
2. **Row Level Security (RLS) policies** are preventing access to the users table
3. **Database schema** might not be properly set up for authentication

### ✅ Environment Variables Status
Your Supabase environment variables are correctly configured:
- `NEXT_PUBLIC_SUPABASE_URL`: ✅ Set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: ✅ Set  
- `SUPABASE_SERVICE_ROLE_KEY`: ✅ Set

---

## 🛠️ Fix Steps

### Step 1: Verify Supabase Database Setup

1. **Login to your Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/hdiuifrlulzpvasknzqm
   - Navigate to `Authentication > Users`

2. **Check if any users exist**:
   - If no users exist, this confirms the issue
   - You need to create a test user account

### Step 2: Create Test User Account

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to `Authentication > Users` in your Supabase dashboard
2. Click `Add User`
3. Create a test user:
   ```
   Email: test@example.com
   Password: testpassword123
   ```
4. Make sure `Auto Confirm User` is checked

#### Option B: Via SQL (Advanced)
Execute this in your Supabase SQL Editor:
```sql
-- Create test user directly in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  FALSE,
  '',
  '',
  '',
  ''
);
```

### Step 3: Verify/Fix RLS Policies

1. **Check RLS Status**:
   Go to `Table Editor > users` table and verify:
   - RLS should be **enabled**
   - Policies should allow authenticated users to read their own data

2. **Apply Correct RLS Policies**:
   Execute in SQL Editor:
   ```sql
   -- Enable RLS on users table
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;

   -- Allow users to read their own data
   CREATE POLICY "Users can read their own data" ON users
   FOR SELECT USING (auth.uid() = id);

   -- Allow users to update their own data  
   CREATE POLICY "Users can update their own data" ON users
   FOR UPDATE USING (auth.uid() = id);

   -- Allow service role to manage all users
   CREATE POLICY "Service role can manage all users" ON users
   FOR ALL USING (auth.role() = 'service_role');
   ```

### Step 4: Verify Database Schema

Make sure your `users` table has the correct structure:
```sql
-- Check if users table exists and has correct columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

Expected columns:
- `id` (uuid, PRIMARY KEY)
- `email` (text, NOT NULL)
- `name` (text)
- `avatar_url` (text)
- `role` (text)
- `email_verified` (boolean)
- `phone` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Step 5: Test Authentication

1. **Clear browser cache and localStorage**
2. **Navigate to** `/login`
3. **Try logging in with**:
   ```
   Email: test@example.com
   Password: testpassword123
   ```

---

## 🧪 Advanced Debugging

### Debug the Authentication Flow

1. **Check Supabase Auth Logs**:
   - Go to `Logs > Auth` in your Supabase dashboard
   - Look for recent authentication attempts

2. **Enable Debug Logging**:
   Add this temporarily to your login component:
   ```javascript
   const onSubmit = async (data) => {
     console.log('Attempting login with:', data.email);
     
     try {
       // Add direct Supabase call for debugging
       const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
         email: data.email,
         password: data.password,
       });
       
       console.log('Supabase auth response:', { authData, authError });
       
       if (authError) {
         console.error('Supabase auth error details:', authError);
       }
       
       // Continue with your existing login logic
       const result = await login(data.email, data.password);
       // ... rest of your code
     } catch (error) {
       console.error('Login error:', error);
     }
   };
   ```

3. **Check Network Tab**:
   - Open browser DevTools
   - Go to Network tab
   - Look for the authentication request to Supabase
   - Check the response status and error details

### Common Solutions

1. **If "User not found"**:
   - Create a test user account (Step 2)

2. **If "Invalid password"**:
   - Reset the password in Supabase dashboard
   - Or create a new test user

3. **If "RLS violation"**:
   - Review and fix RLS policies (Step 3)

4. **If "Database connection error"**:
   - Check environment variables
   - Verify Supabase project is running

---

## 🎯 Quick Test Commands

Run these in your browser console to test Supabase connection:

```javascript
// Test 1: Check if Supabase client is working
console.log('Supabase client:', window.supabase || 'Not available');

// Test 2: Test direct authentication
await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'testpassword123'
}).then(result => console.log('Auth test result:', result));

// Test 3: Check current session
await supabase.auth.getSession().then(result => console.log('Current session:', result));
```

---

## ✅ Success Verification

After implementing the fixes, you should be able to:

1. ✅ Navigate to `/login` without errors
2. ✅ Enter test credentials and login successfully  
3. ✅ Get redirected to the appropriate dashboard
4. ✅ See user data in the browser console
5. ✅ No console errors related to authentication

---

## 📞 Next Steps

If the issue persists after following this guide:

1. **Check Supabase project status** - ensure it's not paused
2. **Verify API keys** - regenerate if necessary
3. **Review Supabase logs** - look for detailed error messages
4. **Test with a fresh Supabase project** - rule out configuration issues

The most common fix is **creating a test user account** in your Supabase dashboard. Start with that first!