# 🔐 Authentication Setup Guide

This project now includes Supabase authentication for the admin panel. Follow these steps to set it up:

## 1. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Environment Variables**:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 2. Database Setup

1. **Run the Schema**:
   - Copy the contents of `database/schema.sql`
   - Run it in your Supabase SQL editor

2. **Insert Sample Data**:
   - Copy the contents of `database/sample-data.sql`
   - Run it in your Supabase SQL editor

## 3. Create Admin User

1. **Enable Email Auth**:
   - Go to Authentication > Settings in Supabase
   - Enable "Enable email confirmations" if you want email verification
   - Or disable it for immediate access

2. **Create User**:
   - Go to Authentication > Users in Supabase
   - Click "Add user"
   - Enter email and password
   - This user can now log in to the admin panel

## 4. Features

### ✅ **What's Working**:
- **Login Page**: Beautiful, modern login form at `/login`
- **Protected Routes**: All `/admin/*` routes require authentication
- **Auto-redirect**: Unauthenticated users are redirected to login
- **Logout**: Working logout functionality in admin header
- **Session Management**: Persistent sessions across browser restarts

### 🔧 **Admin Features**:
- **Menu Management**: Add, edit, delete menu items
- **Category Management**: Add, edit, delete categories
- **Search & Filter**: Search menu items and filter by category
- **Responsive Design**: Mobile-friendly admin interface

## 5. Usage

1. **Access Login**: Navigate to `/login`
2. **Enter Credentials**: Use the email/password you created in Supabase
3. **Access Admin**: You'll be redirected to `/admin` after successful login
4. **Manage Content**: Use the admin panel to manage your menu

## 6. Security

- All admin routes are protected by authentication
- Sessions are managed securely by Supabase
- Middleware handles route protection at the server level
- No hardcoded credentials in the codebase

## 7. Troubleshooting

**Login Issues**:
- Check your environment variables are correct
- Ensure the user exists in Supabase
- Check browser console for errors

**Database Issues**:
- Verify the schema has been applied
- Check Supabase logs for any errors
- Ensure RLS policies are working correctly

---

**Need Help?** Check the Supabase documentation or create an issue in the project repository. 