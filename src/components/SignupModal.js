'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';

export default function SignupModal() {
  const { register, isLoading } = useAuth();
  const { t } = useI18n();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Prevent registration if user already exists
    if (userExists) {
      setError(t('errors.email_exists'));
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Client-side validation
    if (!data.first_name || !data.last_name || !data.email || !data.password || !data.password2 || !data.phone_number) {
      setError(t('errors.required_fields'));
      return;
    }

    if (data.password !== data.password2) {
      setError(t('errors.password_mismatch'));
      return;
    }

    if (data.password.length < 6) {
      setError(t('errors.password_length'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError(t('errors.invalid_email'));
      return;
    }

    // Phone validation
    const phoneRegex = /^[\d\-\+\s\(\)]+$/;
    if (!phoneRegex.test(data.phone_number)) {
      setError(t('errors.invalid_phone'));
      return;
    }

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      date_of_birth: data.date_of_birth || '1990-01-01',
      user_type: 'client'
    };

    try {
      const result = await register(payload);
      
      // Check if registration was successful
      if (result && result.success === false) {
        setError(result.message || t('errors.registration_failed'));
        return;
      }
      
      setSuccess(t('auth.registration_success'));
      form.reset();
      
      // Close modal after successful registration
      setTimeout(() => {
        const modal = document.getElementById('signupPopupForm');
        if (modal && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      }, 1000);
      
      // Redirect is handled automatically by AuthContext

    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || t('errors.registration_failed'));
    }
  };
  return (
    <div className="modal-popup">
      <div
        className="modal fade"
        id="signupPopupForm"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title title" id="exampleModalLongTitle">
                  {t('auth.signup')}
                </h5>
                <p className="font-size-14">{t('auth.signup_welcome')}</p>
              </div>
              <button
                type="button"
                className="btn-close close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" className="la la-close"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="contact-form-action">
                <form onSubmit={handleSubmit}>
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

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">{t('auth.first_name')}</label>
                        <div className="form-group">
                          <span className="la la-user form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="first_name"
                            placeholder={t('auth.first_name_placeholder')}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">{t('auth.last_name')}</label>
                        <div className="form-group">
                          <span className="la la-user form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="last_name"
                            placeholder={t('auth.last_name_placeholder')}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="input-box">
                    <label className="label-text">
                      {t('common.email')}
                      {checkingEmail && (
                        <span className="ms-2 text-info">
                          <small>{t('auth.checking')}</small>
                        </span>
                      )}
                      {userExists && (
                        <span className="ms-2 text-warning">
                          <small>{t('auth.account_exists')}</small>
                        </span>
                      )}
                    </label>
                    <div className="form-group">
                      <span className="la la-envelope form-icon"></span>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder={t('auth.email_placeholder')}
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={(e) => {
                          const newEmail = e.target.value;
                          setEmail(newEmail);
                          
                          // Check user existence after 500ms of typing pause
                          if (newEmail && newEmail.includes('@')) {
                            setCheckingEmail(true);
                            const timer = setTimeout(async () => {
                              try {
                                const response = await fetch(`/api/auth/check-user?email=${encodeURIComponent(newEmail)}`);
                                const data = await response.json();
                                setUserExists(data.exists || false);
                              } catch (err) {
                                console.error('Error checking user:', err);
                              } finally {
                                setCheckingEmail(false);
                              }
                            }, 500);
                            
                            return () => clearTimeout(timer);
                          } else {
                            setUserExists(false);
                          }
                        }}
                      />
                    </div>
                    {userExists && (
                      <div className="alert alert-warning mt-2 mb-0">
                        <p className="mb-0">{t('errors.email_exists')}</p>
                        <button
                          type="button" 
                          className="btn btn-sm btn-warning mt-2"
                          onClick={() => {
                            // Close signup modal
                            const signupModal = document.getElementById('signupPopupForm');
                            if (signupModal && window.bootstrap) {
                              const modalInstance = window.bootstrap.Modal.getInstance(signupModal);
                              if (modalInstance) {
                                modalInstance.hide();
                                
                                // Open login modal after a short delay
                                setTimeout(() => {
                                  const loginModal = document.getElementById('loginPopupForm');
                                  if (loginModal && window.bootstrap) {
                                    const loginModalInstance = new window.bootstrap.Modal(loginModal);
                                    loginModalInstance.show();
                                  }
                                }, 400);
                              }
                            }
                          }}
                        >
                          {t('auth.login_instead')}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="input-box">
                    <label className="label-text">{t('common.phone')}</label>
                    <div className="form-group">
                      <span className="la la-phone form-icon"></span>
                      <input
                        className="form-control"
                        type="tel"
                        name="phone_number"
                        placeholder={t('auth.phone_placeholder')}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="input-box">
                    <label className="label-text">{t('auth.date_of_birth')}</label>
                    <div className="form-group">
                      <span className="la la-calendar form-icon"></span>
                      <input
                        className="form-control"
                        type="date"
                        name="date_of_birth"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="input-box">
                    <label className="label-text">{t('common.password')}</label>
                    <div className="form-group">
                      <span className="la la-lock form-icon"></span>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        placeholder={t('auth.password_placeholder')}
                        required
                        disabled={isLoading}
                        minLength="6"
                      />
                    </div>
                  </div>
                  
                  <div className="input-box">
                    <label className="label-text">{t('auth.repeat_password')}</label>
                    <div className="form-group">
                      <span className="la la-lock form-icon"></span>
                      <input
                        className="form-control"
                        type="password"
                        name="password2"
                        placeholder={t('auth.repeat_password_placeholder')}
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
                      onClick={(e) => {
                        console.log('💆 SignupModal: Button clicked!', e.type);
                        // Let the form submission handler take over
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {t('auth.registering')}
                        </>
                      ) : (
                        t('auth.register_button')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
