# Failed to Fetch Error - Troubleshooting Guide

## Date: 2025-10-22

## Problem
Getting "Failed to fetch" errors when trying to login or register:
- Login fails with TypeError: Failed to fetch
- Registration fails with TypeError: Failed to fetch
- API routes are not responding

## Root Causes
1. **Database Connection Issues** - MySQL server not running or not accessible
2. **Missing Environment Variables** - JWT_SECRET or database credentials not set
3. **API Route Errors** - Unhandled exceptions in API routes
4. **CORS Issues** - Cross-origin requests being blocked

## Solutions Applied

### 1. Enhanced Error Logging

**Login API (`/src/app/api/auth/login/route.js`)**
- Added detailed console logging at every step
- Added database connection error handling
- Added password verification logging
- Shows database configuration on errors

**Register API (`/src/app/api/auth/register/route.js`)**
- Added detailed console logging
- Added database connection error handling
- Added user insertion error handling
- Shows database configuration on errors

### 2. Environment Variables

**Updated `.env.local` file:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=my_travel_app
DB_PORT=3306

# JWT Configuration
JWT_SECRET=holikey_jwt_secret_change_in_production_12345

# Application URL
APP_URL=http://localhost:3000

# Next.js Configuration
PORT=3000

# Other environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Database Connection Test Script

Created `test-db-connection.js` to verify:
- MySQL server is running
- Database exists
- Users table exists
- Credentials are correct

## How to Fix

### Step 1: Verify MySQL is Running

**Windows:**
```powershell
Get-Process -Name "mysqld"
```

**If MySQL is not running, start it:**
```powershell
net start MySQL80  # or your MySQL service name
```

### Step 2: Test Database Connection

Run the test script:
```bash
node test-db-connection.js
```

This will show you:
- ✅ If MySQL is accessible
- ✅ If database exists
- ✅ If users table exists
- ✅ How many users are in the database
- ❌ What's wrong if connection fails

### Step 3: Check Environment Variables

Ensure `.env.local` file exists in project root with correct values:
```bash
# Check if file exists
ls .env.local

# Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are correct
```

### Step 4: Restart Development Server

After making changes:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

**Important:** Next.js caches environment variables, so you MUST restart the server after changing `.env.local`

### Step 5: Check Browser Console

Open Browser DevTools (F12) and check:
1. **Console Tab** - Look for error messages
2. **Network Tab** - Check if API requests are:
   - Reaching the server (status code 200, 400, 500, etc.)
   - Or failing to connect (status: failed)

### Step 6: Check Server Logs

Look at your terminal where `npm run dev` is running. You should see:
- 🔐 Login attempt started
- 📧 Login email: user@example.com
- 📦 Querying database for user...
- ✅ Database query successful, found 1 users
- 🔑 Comparing passwords...
- ✅ Password verified successfully
- 🔐 Generating session token...
- ✅ Token generated successfully
- 🎉 Login successful for: user@example.com

**If you see errors instead:**
- 🔥 Database query error: [error details]
- 🔥 Database config: [shows your DB settings]

## Common Issues and Solutions

### Issue 1: MySQL Not Running
**Error:** `Database connection refused`

**Solution:**
```powershell
# Windows - Start MySQL service
net start MySQL80

# Or start XAMPP/WAMP MySQL
```

### Issue 2: Wrong Database Credentials
**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
- Check username and password in `.env.local`
- Verify MySQL user exists and has correct password
- Test with MySQL CLI: `mysql -u root -p`

### Issue 3: Database Doesn't Exist
**Error:** `ER_BAD_DB_ERROR`

**Solution:**
```sql
-- Create database
CREATE DATABASE my_travel_app;

-- Then run migrations
npm run migrate
```

### Issue 4: Users Table Missing
**Error:** `Table 'my_travel_app.users' doesn't exist`

**Solution:**
```bash
# Run database migrations
npm run migrate
```

### Issue 5: JWT_SECRET Not Set
**Error:** Token generation fails

**Solution:**
- Add `JWT_SECRET` to `.env.local`
- Restart dev server

### Issue 6: Port 3000 Already in Use
**Error:** `Port 3000 is already in use`

**Solution:**
```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill the process or change port in .env.local
PORT=3001
```

## Verification Steps

After fixing, verify everything works:

1. **Test Database Connection:**
   ```bash
   node test-db-connection.js
   ```
   Should show: ✅ All tests passed!

2. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Should show: Ready on http://localhost:3000

3. **Test Login:**
   - Open http://localhost:3000
   - Click "Login"
   - Enter valid credentials
   - Check browser console for errors
   - Check terminal for detailed logs

4. **Test Registration:**
   - Click "Sign Up"
   - Fill in the form
   - Check browser console for errors
   - Check terminal for detailed logs

## Debug Mode

To see more detailed logs, check your terminal where `npm run dev` is running. Every API call now logs:
- What it's doing
- What succeeded ✅
- What failed ❌
- Database configuration 🔥
- Detailed error messages

## Still Not Working?

If you're still having issues:

1. **Check all logs carefully** - The detailed logging will tell you exactly what's wrong

2. **Run the database test:**
   ```bash
   node test-db-connection.js
   ```

3. **Check browser Network tab:**
   - Are requests reaching the server?
   - What status code are they returning?
   - What's the response body?

4. **Restart everything:**
   ```bash
   # Stop dev server (Ctrl+C)
   # Restart MySQL
   net restart MySQL80
   # Start dev server
   npm run dev
   ```

5. **Check for typos in .env.local:**
   - Variable names must be exact: `DB_HOST`, `DB_USER`, etc.
   - No spaces around `=`
   - No quotes around values

## Files Changed

1. ✅ `/src/app/api/auth/login/route.js` - Added detailed logging
2. ✅ `/src/app/api/auth/register/route.js` - Added detailed logging
3. ✅ `.env.local` - Added JWT_SECRET and APP_URL
4. ✅ `test-db-connection.js` - New test script
5. ✅ Previous login/registration fixes still in place

## Next Steps

Once the "Failed to fetch" error is resolved:
1. Test login with existing user
2. Test registration with new user
3. Verify dashboard redirect works
4. Test all user roles (admin, agency, customer)
5. Check that session persists after page refresh
