'use client';
import { useState } from 'react';

export default function WorkingRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    console.log('🚀 Registration: Form submission started');
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('📝 Registration: Form data collected:', data);

    // Client-side validation
    if (!data.username || !data.email || !data.password || !data.password2) {
      console.warn('⚠️ Registration: Missing required fields');
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (data.password !== data.password2) {
      console.warn('⚠️ Registration: Password mismatch');
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (data.password.length < 6) {
      console.warn('⚠️ Registration: Password too short');
      setError('Password must be at least 6 characters long');
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
      first_name: data.username.split(' ')[0] || data.username,
      last_name: data.username.split(' ')[1] || '',
      email: data.email,
      password: data.password,
      user_type: 'passenger'
    };
    
    console.log('📤 Registration: Sending payload to API:', payload);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Registration: Response status:', response.status);
      const result = await response.json();
      console.log('📥 Registration: Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      console.log('✅ Registration: Registration successful');
      setSuccess('Registration successful! You are now logged in.');
      form.reset();
      
      // Redirect based on user type
      setTimeout(() => {
        if (result.user?.user_type === 'admin') {
          window.location.href = '/admin';
        } else if (result.user?.user_type === 'passenger') {
          window.location.href = '/user';
        } else {
          window.location.reload();
        }
      }, 2000);

    } catch (err) {
      console.error('❌ Registration: Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Registration: Form submission completed');
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
        <label className="label-text">Username</label>
        <div className="form-group">
          <span className="la la-user form-icon"></span>
          <input
            className="form-control"
            placeholder="Type your username"
            type="text"
            name="username"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="input-box">
        <label className="label-text">Email Address</label>
        <div className="form-group">
          <span className="la la-envelope-o form-icon"></span>
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
            minLength="6"
          />
        </div>
      </div>

      <div className="input-box">
        <label className="label-text">Repeat Password</label>
        <div className="form-group">
          <span className="la la-lock form-icon"></span>
          <input
            className="form-control"
            placeholder="Type again password"
            type="password"
            name="password2"
            required
            disabled={isLoading}
            minLength="6"
          />
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
              Registering...
            </>
          ) : (
            'Register Account'
          )}
        </button>
      </div>
    </form>
  );
}
