'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../../../components/Header';
import { I18nProvider } from '../../../i18n/I18nProvider';

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [returnUrl, setReturnUrl] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const returnUrlParam = searchParams.get('returnUrl');
    
    if (!tokenParam) {
      setError('Invalid or missing reset token. Please request a new password reset.');
      return;
    }
    setToken(tokenParam);
    
    if (returnUrlParam) {
      setReturnUrl(decodeURIComponent(returnUrlParam));
    }
  }, [searchParams]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear errors when user starts typing
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!formData.newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Redirect based on returnUrl or default to login after 3 seconds
        setTimeout(() => {
          if (returnUrl) {
            // If we have a returnUrl (booking page), go back there
            window.location.href = returnUrl;
          } else {
            // Default redirect to login page
            router.push('/auth/login?message=Password reset successful. Please login with your new password.');
          }
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'success';
      case 5: return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-area bread-bg-8">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Reset Password</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/">Login</Link></li>
                    <li>Reset Password</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bread-svg-box">
          <svg className="bread-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
            <polygon points="100 0 50 10 0 0 0 10 100 10"></polygon>
          </svg>
        </div>
      </section>

      {/* Reset Password Form */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="form-box">
                <div className="form-title-wrap">
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <div className="contact-icon me-3">
                      <i className="la la-lock color-text font-size-30"></i>
                    </div>
                    <div>
                      <h3 className="title mb-1">Reset Your Password</h3>
                      <p className="color-text-2 font-size-15">Enter your new secure password below</p>
                    </div>
                  </div>
                </div>
                
                {message ? (
                  <div className="text-center">
                    <div className="alert alert-success">
                      <i className="la la-check-circle font-size-24 mb-2"></i>
                      <h4 className="text-success">Password Reset Successful!</h4>
                      <p className="mb-0">{message}</p>
                      <small className="text-muted d-block mt-2">
                        <i className="la la-clock-o me-1"></i>
                        {returnUrl ? 'Redirecting back to your booking in 3 seconds...' : 'Redirecting to login page in 3 seconds...'}
                      </small>
                    </div>
                    
                    <div className="btn-box pt-3">
                      {returnUrl ? (
                        <button 
                          onClick={() => window.location.href = returnUrl}
                          className="theme-btn"
                        >
                          <i className="la la-arrow-left me-2"></i>Back to Booking
                        </button>
                      ) : (
                        <Link href="/" className="theme-btn">
                          <i className="la la-sign-in me-2"></i>Go to Login
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="contact-form-action">
                    {error && (
                      <div className="alert alert-danger">
                        <i className="la la-exclamation-triangle me-2"></i>{error}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      {/* New Password */}
                      <div className="input-box">
                        <label className="label-text">New Password</label>
                        <div className="form-group position-relative">
                          <span className="la la-lock form-icon"></span>
                          <input
                            className="form-control"
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter your new password"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="btn btn-link position-absolute"
                            style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '0', border: 'none' }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`la ${showPassword ? 'la-eye-slash' : 'la-eye'} text-muted`}></i>
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                          <div className="mt-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="text-muted">Password strength:</small>
                              <small className={`text-${getPasswordStrengthColor()} fw-bold`}>
                                {getPasswordStrengthText()}
                              </small>
                            </div>
                            <div className="progress" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getPasswordStrengthColor()}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="input-box">
                        <label className="label-text">Confirm New Password</label>
                        <div className="form-group position-relative">
                          <span className="la la-lock form-icon"></span>
                          <input
                            className="form-control"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your new password"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="btn btn-link position-absolute"
                            style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '0', border: 'none' }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`la ${showConfirmPassword ? 'la-eye-slash' : 'la-eye'} text-muted`}></i>
                          </button>
                        </div>
                        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                          <small className="text-danger mt-1 d-block">
                            <i className="la la-times-circle me-1"></i>Passwords do not match
                          </small>
                        )}
                      </div>
                      
                      {/* Password Requirements Box */}
                      <div className="alert alert-info">
                        <h6 className="mb-2"><i className="la la-info-circle me-2"></i>Password Requirements:</h6>
                        <ul className="list-unstyled mb-0" style={{ fontSize: '12px' }}>
                          <li className={formData.newPassword.length >= 6 ? 'text-success' : 'text-muted'}>
                            <i className={`la ${formData.newPassword.length >= 6 ? 'la-check text-success' : 'la-circle text-muted'} me-1`}></i>
                            At least 6 characters long
                          </li>
                          <li className={formData.newPassword.length >= 8 ? 'text-success' : 'text-muted'}>
                            <i className={`la ${formData.newPassword.length >= 8 ? 'la-check text-success' : 'la-circle text-muted'} me-1`}></i>
                            8+ characters (recommended)
                          </li>
                          <li className={/[A-Z]/.test(formData.newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`la ${/[A-Z]/.test(formData.newPassword) ? 'la-check text-success' : 'la-circle text-muted'} me-1`}></i>
                            At least one uppercase letter (recommended)
                          </li>
                          <li className={/[a-z]/.test(formData.newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`la ${/[a-z]/.test(formData.newPassword) ? 'la-check text-success' : 'la-circle text-muted'} me-1`}></i>
                            At least one lowercase letter (recommended)
                          </li>
                          <li className={/[0-9]/.test(formData.newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`la ${/[0-9]/.test(formData.newPassword) ? 'la-check text-success' : 'la-circle text-muted'} me-1`}></i>
                            At least one number (recommended)
                          </li>
                        </ul>
                      </div>
                      
                      {/* Submit Button */}
                      <div className="btn-box pt-3">
                        <button 
                          type="submit" 
                          className="theme-btn w-100"
                          disabled={loading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              <i className="la la-refresh la-spin me-2"></i>
                              Updating Password...
                            </>
                          ) : (
                            <>
                              <i className="la la-lock me-2"></i>
                              Reset My Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    
                    {/* Footer Links */}
                    <div className="account-assist mt-4 text-center">
                      <p className="account__desc">
                        <i className="la la-arrow-left me-1"></i>
                        <Link href="/" className="text-primary">
                          Back to Login
                        </Link>
                      </p>
                      <p className="account__desc">
                        Need help? 
                        <Link href="/auth/forgot-password" className="text-primary ms-1">
                          Request new reset link
                        </Link>
                      </p>
                    </div>
                    
                    {/* Security Notice */}
                    <div className="alert alert-warning mt-4">
                      <div className="d-flex align-items-start">
                        <i className="la la-shield text-warning me-2 font-size-20"></i>
                        <div>
                          <h6 className="text-warning mb-1">Security Notice</h6>
                          <small className="text-muted">
                            Reset tokens expire after 1 hour for your security. 
                            If this link has expired, please request a new password reset.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
