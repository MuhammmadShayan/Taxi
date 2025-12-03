'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get token from cookie for chat functionality
  const getTokenFromCookie = async () => {
    try {
      // Get token from document.cookie
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('session=')
      );
      
      if (tokenCookie) {
        const tokenValue = tokenCookie.split('=')[1];
        setToken(tokenValue);
      }
    } catch (error) {
      console.error('Error getting token from cookie:', error);
    }
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      // Tentatively load stored user to avoid a blank flash
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (storedUserData) {
        try { 
          const stored = JSON.parse(storedUserData);
          setUser(stored); 
        } catch {}
      }

      // Always verify with server to reflect cookie-based session changes (impersonation, restore, etc.)
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (response.ok) {
        const result = await response.json();
        const serverUser = result?.user || null;
        setUser(serverUser);

        // Persist the latest server user into session storage by default
        try {
          sessionStorage.setItem('userData', JSON.stringify(serverUser));
          sessionStorage.setItem('userLoggedIn', serverUser ? 'true' : 'false');
          // clear potentially stale rememberLogin to avoid overriding on next boot
          localStorage.removeItem('rememberLogin');
        } catch {}
      } else {
        setUser(null);
      }

      // Get token from cookie for chat functionality
      await getTokenFromCookie();
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // Always sync with server each mount to keep in step with session cookie

  // Check for existing session on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password, remember = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔐 Login API response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Login failed'
        };
      }

      // Validate user data exists and has required fields
      if (!data.user || !data.user.email) {
        console.error('❌ Invalid user data received from login API:', data);
        return {
          success: false,
          message: 'Invalid response from server. Please try again.'
        };
      }

      console.log('👤 Setting user:', data.user);
      
      // Ensure user_type exists (fallback to role if needed)
      const userData = {
        ...data.user,
        user_type: data.user.user_type || data.user.role || 'customer'
      };
      
      setUser(userData);
      
      // Store user data
      if (remember) {
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('rememberLogin', 'true');
      } else {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('userLoggedIn', 'true');
      }

      // Force a re-render by updating loading state
      setLoading(false);
      
      // Get token from cookie for chat functionality
      await getTokenFromCookie();

      // Auto-redirect to dashboard with more reliable timing
      setTimeout(() => {
        console.log('🚀 Auto-redirecting user after login...', userData);
        redirectToDashboard(userData.user_type);
      }, 500);

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registrationData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Registration failed'
        };
      }

      // Validate user data exists
      if (!data.user || !data.user.email) {
        console.error('❌ Invalid user data received from registration API:', data);
        return {
          success: false,
          message: 'Invalid response from server. Please try again.'
        };
      }

      // Ensure user_type exists (fallback to role if needed)
      const userData = {
        ...data.user,
        user_type: data.user.user_type || data.user.role || 'customer'
      };
      
      setUser(userData);
      
      // Store user data in session
      sessionStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('userLoggedIn', 'true');

      // Get token from cookie for chat functionality
      await getTokenFromCookie();

      // Auto-redirect to dashboard after a short delay
      setTimeout(() => {
        redirectToDashboard(userData.user_type);
      }, 1500);

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API first to clear httpOnly cookie reliably
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API failed:', error);
      // continue with client-side cleanup regardless
    }

    // Clear client state and storage
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('rememberLogin');
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('userLoggedIn');
    } catch (storageError) {
      console.error('Storage cleanup error:', storageError);
    }

    // Ensure any stale overlays are removed
    try {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    } catch {}

    // Use hard redirect to reset any client state fully
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    } else {
      router.replace('/');
    }
  };

  const redirectToDashboard = (userType) => {
    console.log('🔄 Redirecting user with type:', userType);
    switch (userType) {
      case 'admin':
        console.log('➡️ Redirecting to /admin/dashboard');
        router.push('/admin/dashboard');
        break;
      case 'agency_owner':
      case 'agency_admin':
        console.log('➡️ Redirecting to /agency/dashboard');
        router.push('/agency/dashboard');
        break;
      case 'driver':
        console.log('➡️ Redirecting to /driver/dashboard');
        router.push('/driver/dashboard');
        break;
      case 'customer':
      case 'client':
      case 'passenger':
      case 'user':
        console.log('➡️ Redirecting to /customer/dashboard');
        router.push('/customer/dashboard');
        break;
      default:
        console.log('➡️ Redirecting to /customer/dashboard (default)');
        router.push('/customer/dashboard');
    }
  };


  const checkUserExists = async (email) => {
    try {
      const response = await fetch(`/api/auth/check-user?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check user error:', error);
      return { exists: false };
    }
  };

  const isAdmin = () => user?.user_type === 'admin' || user?.role === 'admin';
  const isAgency = () => ['agency_owner', 'agency_admin', 'agency'].includes(user?.user_type) || ['agency_owner', 'agency_admin', 'agency'].includes(user?.role);
  const isCustomer = () => ['customer', 'client', 'passenger', 'user'].includes(user?.user_type) || ['customer', 'client', 'passenger', 'user'].includes(user?.role);
  const isLoggedIn = () => !!user;

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAdmin,
    isAgency,
    isCustomer,
    isLoggedIn,
    loading,
    isLoading,
    checkAuthStatus,
    checkUserExists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
