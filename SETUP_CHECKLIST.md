# 🚨 **QUICK SETUP CHECKLIST**

## **Step 1: Check Environment Variables**

1. **Create `.env.local` file** in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. **Get your Supabase credentials**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use existing one
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key

## **Step 2: Create a Test User**

1. **In Supabase Dashboard**:
   - Go to Authentication → Users
   - Click "Add user"
   - Enter email: `admin@test.com`
   - Enter password: `password123`
   - Click "Add user"

2. **Disable Email Confirmation** (for testing):
   - Go to Authentication → Settings
   - Turn OFF "Enable email confirmations"

## **Step 3: Test Login**

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Go to `/login`** and try:
   - Email: `admin@test.com`
   - Password: `password123`

## **Step 4: Check Browser Console**

Open browser dev tools (F12) and check for:
- ✅ Environment variables loaded
- ✅ Login attempt logs
- ❌ Any error messages

## **Common Issues:**

### ❌ **"Missing environment variables"**
- Check `.env.local` file exists
- Restart dev server after adding env vars

### ❌ **"Invalid login credentials"**
- User doesn't exist in Supabase
- Wrong email/password
- Email confirmation required

### ❌ **"Network error"**
- Check Supabase URL is correct
- Check internet connection

---

**Need help?** Check the browser console for specific error messages! 