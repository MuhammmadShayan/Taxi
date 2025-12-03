// Client-side logout utility function
export const handleLogout = async () => {
  try {
    // Call the logout API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Clear any client-side storage
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear any cached data
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
      }
      
      // Redirect to login page or home page
      window.location.href = '/login';
      
    } else {
      console.error('Logout failed');
      // Even if API fails, redirect to home page for security
      window.location.href = '/';
    }
    
  } catch (error) {
    console.error('Logout error:', error);
    // On error, still redirect for security
    window.location.href = '/';
  }
};

// Alternative logout that redirects to home page instead of login
export const handleLogoutToHome = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Clear client-side storage regardless of API response
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    // Always redirect to home page
    window.location.href = '/';
    
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/';
  }
};
