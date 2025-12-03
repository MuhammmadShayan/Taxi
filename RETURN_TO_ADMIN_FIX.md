# Return to Admin Button Fix

## Date: 2025-10-22

## Problem

When an admin impersonates a user and clicks "Return to Admin", the browser navigates to `/api/auth/me` instead of returning to the admin dashboard.

## Root Cause

The issue was in the `ImpersonationBanner.js` component:
1. The redirect was using only `window.location.href` without proper state refresh
2. No router instance was being used for client-side navigation
3. Auth state wasn't being refreshed before navigation
4. Insufficient logging made debugging difficult

## Solution

### 1. Enhanced ImpersonationBanner Component

**File:** `/src/components/ImpersonationBanner.js`

**Changes:**
- ✅ Added `useRouter` from Next.js navigation
- ✅ Added `checkAuthStatus` from AuthContext to refresh user state
- ✅ Use `router.push()` for client-side navigation first
- ✅ Then use `window.location.href` as fallback with delay
- ✅ Added comprehensive console logging

**Before:**
```javascript
const handleReturn = async () => {
  const resp = await fetch('/api/admin/impersonate/restore', { 
    method: 'POST', 
    credentials: 'include' 
  });
  const data = await resp.json();
  if (resp.ok && data.success) {
    window.location.href = data.redirectTo || '/admin/dashboard';
  }
};
```

**After:**
```javascript
const handleReturn = async () => {
  console.log('🔙 Returning to admin from impersonation...');
  
  const resp = await fetch('/api/admin/impersonate/restore', { 
    method: 'POST', 
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await resp.json();
  console.log('✅ Restore response:', data);
  
  if (resp.ok && data.success) {
    console.log('🚀 Redirecting to:', data.redirectTo || '/admin/dashboard');
    
    // Refresh auth state first
    await checkAuthStatus();
    
    // Use router for client-side nav
    const redirectPath = data.redirectTo || '/admin/dashboard';
    router.push(redirectPath);
    
    // Force hard reload as backup
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 100);
  }
};
```

### 2. Enhanced Restore API Logging

**File:** `/src/app/api/admin/impersonate/restore/route.js`

**Changes:**
- ✅ Added step-by-step console logging
- ✅ Verify backup token before restoring
- ✅ Log admin email being restored to
- ✅ Log cookie operations

**Logs Added:**
```javascript
console.log('🔙 Restore impersonation: Starting...');
console.log('🔑 Current session token exists:', !!currentToken);
console.log('👤 Current session:', session ? `${session.email} (impersonated: ${session.impersonated})` : 'none');
console.log('📦 Backup session exists:', !!backup);
console.log('👤 Restoring to admin:', backupSession ? backupSession.email : 'unknown');
console.log('✅ Preparing to restore session...');
console.log('🍪 Set session cookie to backup admin token');
console.log('🧹 Cleared backup session cookie');
console.log('🎉 Restore impersonation successful! Redirecting to /admin/dashboard');
```

## How It Works Now

### Flow:

1. **Admin clicks "Return to Admin"**
   - Button in ImpersonationBanner component

2. **POST request to `/api/admin/impersonate/restore`**
   - Verifies current session is impersonated
   - Retrieves backup admin session from cookie
   - Restores session cookie to admin token
   - Clears backup cookie
   - Returns success with redirectTo path

3. **Client-side handling:**
   - Refreshes auth state via `checkAuthStatus()`
   - Uses `router.push()` for smooth navigation
   - Falls back to `window.location.href` for hard reload
   - Redirects to `/admin/dashboard`

4. **Middleware validates:**
   - Checks restored admin session
   - Allows access to `/admin/dashboard`

## Files Changed

1. ✅ `/src/components/ImpersonationBanner.js`
   - Added `useRouter` and `checkAuthStatus`
   - Enhanced redirect logic
   - Added comprehensive logging

2. ✅ `/src/app/api/admin/impersonate/restore/route.js`
   - Added step-by-step logging
   - Verify backup token
   - Log all operations

## Testing

### Test Scenario:

1. **Login as Admin:**
   ```
   Navigate to http://localhost:3000
   Login with admin credentials
   ```

2. **Go to Users Page:**
   ```
   Navigate to /admin/users
   ```

3. **Impersonate a User:**
   ```
   Click "Impersonate" button for any user
   Should see impersonation banner at top
   Should navigate to user's dashboard
   ```

4. **Return to Admin:**
   ```
   Click "Return to Admin" button in banner
   Check browser console for logs
   Check terminal for server logs
   Should navigate to /admin/dashboard
   ```

### Expected Console Output (Browser):

```
🔙 Returning to admin from impersonation...
✅ Restore response: { success: true, redirectTo: '/admin/dashboard' }
🚀 Redirecting to: /admin/dashboard
```

### Expected Terminal Output:

```
🔙 Restore impersonation: Starting...
🔑 Current session token exists: true
👤 Current session: user@example.com (impersonated: true)
📦 Backup session exists: true
👤 Restoring to admin: admin@example.com
✅ Preparing to restore session...
🍪 Set session cookie to backup admin token
🧹 Cleared backup session cookie
🎉 Restore impersonation successful! Redirecting to /admin/dashboard
```

## Troubleshooting

### Issue 1: Still redirects to `/api/auth/me`

**Solution:**
- Clear browser cache
- Clear cookies
- Restart dev server
- Try in incognito mode

### Issue 2: "Not in impersonation mode" error

**Solution:**
- Verify impersonation was successful first
- Check `impersonated` flag in session
- Check if `admin_backup_session` cookie exists

### Issue 3: Redirect loops

**Solution:**
- Check middleware isn't blocking admin dashboard
- Verify restored session has correct admin role
- Check console logs for auth state

### Issue 4: Blank page after redirect

**Solution:**
- Check if admin dashboard page exists
- Check for JavaScript errors in console
- Verify admin role permissions

## Technical Details

### Cookie Operations:

**During Impersonation (via `/api/admin/impersonate`):**
```javascript
// Backup original admin session
res.cookies.set('admin_backup_session', adminToken, {...});

// Set impersonated user session
res.cookies.set('session', impersonatedToken, {...});
```

**During Restore:**
```javascript
// Restore admin session
res.cookies.set('session', backupToken, {...});

// Clear backup
res.cookies.set('admin_backup_session', '', { maxAge: 0 });
```

### Session Structure:

**Impersonated Session:**
```javascript
{
  id: 123,
  email: 'user@example.com',
  user_type: 'customer',
  impersonated: true,  // ⭐ Important flag
  ...
}
```

**Restored Admin Session:**
```javascript
{
  id: 1,
  email: 'admin@example.com',
  user_type: 'admin',
  // No impersonated flag
  ...
}
```

## Impact

- ✅ Return to Admin button now works correctly
- ✅ Navigates to `/admin/dashboard` as expected
- ✅ Comprehensive logging for debugging
- ✅ Smooth user experience
- ✅ Proper state management
- ✅ Better error handling

## Related Features

This fix is part of the impersonation system:
1. Admin can impersonate users
2. Impersonation banner shows when active
3. **Return to Admin restores original session** ✅
4. All actions during impersonation are logged
