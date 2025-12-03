'use client';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { useState } from 'react';

export default function LoginModal() {
  const { login, isLoading } = useAuth();
  const { t } = useI18n();
  const [error, setError] = useState('');
  return (
    <div className="modal-popup">
      <div
        className="modal fade"
        id="loginPopupForm"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title title" id="exampleModalLongTitle2">
                  {t('auth.login')}
                </h5>
                <p className="font-size-14">{t('auth.login_welcome')}</p>
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
                {/* Display error messages */}
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}
                
                <form method="post" onSubmit={async (e) => {
                  e.preventDefault();
                  setError('');
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const payload = Object.fromEntries(formData.entries());
                  
                  // Client-side validation
                  if (!payload.email || !payload.password) {
                    setError(t('errors.email_password_required'));
                    return;
                  }
                  
                  // Email validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(payload.email)) {
                    setError(t('errors.invalid_email'));
                    return;
                  }
                  
                  try {
                    // Get "Remember me" checkbox value
                    const remember = form.querySelector('#rememberchb').checked;
                    
                    const result = await login(payload.email, payload.password, remember);
                    
                    // Check if login was successful
                    if (result && result.success === false) {
                      setError(result.message || t('errors.login_failed'));
                      return;
                    }
                    
                    // Close modal on success (before redirect)
                    form.reset();
                    const modal = document.getElementById('loginPopupForm');
                    if (modal && window.bootstrap) {
                      const modalInstance = window.bootstrap.Modal.getInstance(modal);
                      if (modalInstance) {
                        modalInstance.hide();
                      }
                    }
                    
                    // Add a small delay to ensure modal closes before redirect
                    setTimeout(() => {
                      console.log('✅ Login successful, redirect handled by AuthContext');
                    }, 100);
                    
                    // Redirect is handled automatically by AuthContext
                    
                  } catch (error) {
                    console.error('Login error:', error);
                    setError(error.message || t('errors.login_failed'));
                  }
                }}>
                  <div className="input-box">
                    <label className="label-text">{t('common.email')}</label>
                    <div className="form-group">
                      <span className="la la-user form-icon"></span>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder={t('auth.email_placeholder')}
                      />
                    </div>
                  </div>
                  <div className="input-box">
                    <label className="label-text">{t('common.password')}</label>
                    <div className="form-group mb-2">
                      <span className="la la-lock form-icon"></span>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        placeholder={t('auth.password_placeholder')}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="custom-checkbox mb-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberchb"
                        />
                        <label htmlFor="rememberchb">{t('common.remember_me')}</label>
                      </div>
                      <p className="forgot-password">
                        <a href="/auth/forgot-password">{t('common.forgot_password')}</a>
                      </p>
                    </div>
                  </div>
                  <div className="btn-box pt-3 pb-4">
                    <button type="submit" className="theme-btn w-100" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {t('auth.logging_in')}
                        </>
                      ) : (
                        t('auth.login_button')
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
