'use client';
import { useState } from 'react';

export default function WorkingLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    console.log('🚀 Login: Form submission started');
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('📝 Login: Form data collected:', data);

    // Client-side validation
    if (!data.email || !data.password) {
      console.warn('⚠️ Login: Missing required fields');
      setError('Please fill in both email and password');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    const payload = {
      email: data.email,
      password: data.password
    };
    
    console.log('📤 Login: Sending payload to API:', { email: data.email, password: '[HIDDEN]' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Login: Response status:', response.status);
      const result = await response.json();
      console.log('📥 Login: Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      console.log('✅ Login: Login successful');
      setSuccess('Login successful! Redirecting...');
      form.reset();
      
      // Redirect based on user type
      setTimeout(() => {
        if (result.user?.user_type === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (result.user?.user_type === 'agency_owner') {
          window.location.href = '/agency/dashboard';
        } else if (result.user?.user_type === 'customer') {
          window.location.href = '/customer/dashboard';
        } else {
          window.location.reload();
        }
      }, 1000);

    } catch (err) {
      console.error('❌ Login: Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Login: Form submission completed');
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit}>
      {/* Display error or success messages */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-3" role="alert">
          {success}
        </div>
      )}

      <div className="input-box">
        <label className="label-text">Email</label>
        <div className="form-group">
          <span className="la la-user form-icon"></span>
          <input
            className="form-control"
            placeholder="Type your email"
            type="email"
            name="email"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="input-box">
        <label className="label-text">Password</label>
        <div className="form-group">
          <span className="la la-lock form-icon"></span>
          <input
            className="form-control"
            placeholder="Type password"
            type="password"
            name="password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="checkbox-wrap">
        <div className="custom-checkbox mb-0">
          <input 
            id="rememberchb" 
            type="checkbox" 
            name="remember"
            disabled={isLoading}
          />
          <label htmlFor="rememberchb">Remember me</label>
        </div>
      </div>

      <div className="btn-box pt-3 pb-4">
        <button 
          type="submit" 
          className="theme-btn w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging in...
            </>
          ) : (
            'Login Account'
          )}
        </button>
      </div>

      <div className="action-box text-center">
        <p className="font-size-14">
          Not have an account?{' '}
          <a href="#" className="btn-text" data-bs-toggle="modal" data-bs-target="#signupPopupForm" data-bs-dismiss="modal">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
}
