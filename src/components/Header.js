'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { HeaderLanguageSelector } from './LanguageSelector';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { t, lang, setLang, isInitialized: i18nReady } = useI18n();
  const { currency, setCurrency, currencies, isInitialized: currencyReady } = useCurrency();
  const { user, logout, isLoading, loading, login } = useAuth();

  // Debug authentication state changes (uncomment for debugging)
  // useEffect(() => {
  //   console.log('🔍 Header - Auth state changed:', { user: !!user, loading, isLoading, mounted });
  // }, [user, loading, isLoading, mounted]);

  // Initialize component when all contexts are ready
  useEffect(() => {
    if (i18nReady && currencyReady) {
      setMounted(true);
    }
  }, [i18nReady, currencyReady]);

  // Prevent template JS from interfering with React dropdowns
  useEffect(() => {
    if (mounted) {
      // Prevent the main.js script from adding drop-menu-toggler buttons
      const preventDropMenuToggler = () => {
        const existingButtons = document.querySelectorAll('.drop-menu-toggler');
        existingButtons.forEach(button => {
          if (button.parentNode && button.parentNode.querySelector('i.la-angle-down')) {
            button.remove();
          }
        });
      };
      
      // Destroy Select2 on language selector if it gets initialized
      const destroySelect2OnLanguage = () => {
        if (typeof window !== 'undefined' && window.jQuery && window.jQuery.fn.select2) {
          const $langSelects = window.jQuery('select[aria-label="Language selector"], .lang-select');
          $langSelects.each(function() {
            const $select = window.jQuery(this);
            if ($select.hasClass('select2-hidden-accessible')) {
              $select.select2('destroy');
              console.log('🔧 Destroyed Select2 on language selector');
            }
          });
        }
      };
      
      preventDropMenuToggler();
      destroySelect2OnLanguage();
      
      // Set up a mutation observer to catch any dynamic additions
      const observer = new MutationObserver(() => {
        preventDropMenuToggler();
        destroySelect2OnLanguage();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Also check periodically
      const interval = setInterval(destroySelect2OnLanguage, 1000);
      
      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [mounted]);

  // Auth check is handled by AuthProvider automatically
  // No need to call checkAuthStatus here as it causes infinite re-renders

  // Attach login modal handler to show inline error on failed login
  useEffect(() => {
    const container = document.getElementById('loginPopupForm');
    const form = container?.querySelector('form');
    if (!form) return;

    const onSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Remove previous error
      const prev = form.querySelector('.login-error-alert');
      if (prev) prev.remove();

      const emailInput = form.querySelector('input[name="email"], input[type="email"]');
      const passwordInput = form.querySelector('input[name="password"], input[type="password"]');
      const rememberInput = form.querySelector('input[name="remember"], input[type="checkbox"][name*="remember"]');

      const email = emailInput?.value?.trim() || '';
      const password = passwordInput?.value || '';
      const remember = !!rememberInput?.checked;

      if (!email || !password) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger login-error-alert';
        alert.role = 'alert';
        alert.textContent = 'Please enter both email and password.';
        form.prepend(alert);
        return;
      }

      const result = await login(email, password, remember);
      if (!result?.success) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger login-error-alert';
        alert.role = 'alert';
        alert.textContent = result?.message || 'Invalid email or password.';
        form.prepend(alert);
      }
      // On success, AuthContext.login will redirect; leave modal open until navigation
    };

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [login]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
  };

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="header-area">
      {/* Header Top Bar */}
      <div className="header-top-bar padding-right-100px padding-left-100px">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="header-top-content">
                <div className="header-left">
                  <ul className="list-items pt-1">
                    <li>
                      <Link href="tel:+212600123456">
                        <i className="la la-phone me-1"></i>+212 600 123 456
                      </Link>
                    </li>
                    <li>
                      <Link href="mailto:info@kirastay.com">
                        <i className="la la-envelope me-1"></i>info@kirastay.com
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="header-top-content">
                <div className="header-right d-flex align-items-center justify-content-end">
                  {mounted ? (
                    <>
<div className="header-right-action">
                        <HeaderLanguageSelector />
                      </div>
                      <div className="header-right-action">
                        <div className="select-contain select--contain w-auto">
                          <select 
                            className="select-contain-select" 
                            value={currency}
                            onChange={handleCurrencyChange}
                            aria-label="Currency selector"
                          >
                            {Object.entries(currencies).map(([code, curr]) => (
                              <option key={code} value={code}>
                                {code} - {curr.symbol}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="header-right-action">
                        <div className="select-contain select--contain w-auto">
                          <div className="loading-placeholder" style={{width: '120px', height: '38px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#6c757d'}}>
                            English US
                          </div>
                        </div>
                      </div>
                      <div className="header-right-action">
                        <div className="select-contain select--contain w-auto">
                          <div className="loading-placeholder" style={{width: '80px', height: '38px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#6c757d'}}>
                            MAD
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="header-right-action">
                    <Link
                      href="/agency/register"
                      className="theme-btn theme-btn-small"
                    >
                      {t('agencies.become_partner')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header Menu */}
      <div className="header-menu-wrapper padding-right-100px padding-left-100px">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="menu-wrapper">
                <Link href="#" className="down-button">
                  <i className="la la-angle-down"></i>
                </Link>
                <div className="logo">
                  <Link href="/">
                    <img 
                      src="/html-folder/images/logo.png" 
                      alt="KIRASTAY logo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%232563eb' font-size='20' font-weight='bold'%3EKIRASTAY%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </Link>
                  <div className="menu-toggler">
                    <i className="la la-bars"></i>
                    <i className="la la-times"></i>
                  </div>
                </div>
                <div className="main-menu-content ms-auto">
                  <nav>
                    <ul>
                      <li>
                        <Link href="/">{t('nav.home')}</Link>
                      </li>
                      <li>
                        <Link href="/about">{t('nav.about')}</Link>
                      </li>
                      <li>
                        <Link href="/service">{t('nav.service')}</Link>
                      </li>
                      <li>
                        <Link href="/contact">{t('nav.contact')}</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="nav-btn">
                  {mounted && !loading && !user && (
                    <>
                      <button
                        type="button"
                        className="theme-btn theme-btn-small theme-btn-transparent me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#signupPopupForm"
                      >
                        {t('nav.signup')}
                      </button>
                      <button
                        type="button"
                        className="theme-btn theme-btn-small"
                        data-bs-toggle="modal"
                        data-bs-target="#loginPopupForm"
                      >
                        {t('nav.login')}
                      </button>
                    </>
                  )}
                  {loading && mounted && (
                    <div className="d-flex align-items-center">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">{t('common.loading')}</span>
                      </div>
                    </div>
                  )}
                  {mounted && !loading && user && (
                    <div className="d-flex align-items-center">
                      <div className="dropdown me-2">
                        <button
                          className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                          type="button"
                          id="userDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            color: '#007bff',
                            borderColor: '#007bff',
                            backgroundColor: '#fff',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff';
                            e.currentTarget.style.color = '#fff';
                            const small = e.currentTarget.querySelector('small');
                            if (small) small.style.color = '#f0f0f0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.color = '#007bff';
                            const small = e.currentTarget.querySelector('small');
                            if (small) small.style.color = '#6c757d';
                          }}
                        >
                          <i className="la la-user me-2" style={{ fontSize: '18px' }}></i>
                          <div className="d-flex flex-column align-items-start text-start">
                            <span className="fw-bold" style={{ lineHeight: '1.2', fontSize: '14px' }}>
                              {user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email?.split('@')[0] || 'User'}
                            </span>
                            <small className="text-capitalize" style={{ color: '#6c757d', fontSize: '12px', lineHeight: '1.2' }}>{user.role || 'User'}</small>
                          </div>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                          <li>
                            <Link 
                              href={user.role === 'admin' ? '/admin' : (user.role === 'agency_owner' ? '/agency/dashboard' : '/customer/dashboard')} 
                              className="dropdown-item"
                            >
                              <i className="la la-dashboard me-2"></i>{t('nav.dashboard')}
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href={`${user.role === 'admin' ? '/admin' : (user.role === 'agency_owner' ? '/agency' : '/customer')}/profile`} 
                              className="dropdown-item"
                            >
                              <i className="la la-user me-2"></i>{t('nav.profile')}
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href={`${user.role === 'admin' ? '/admin' : (user.role === 'agency_owner' ? '/agency' : '/customer')}/settings`} 
                              className="dropdown-item"
                            >
                              <i className="la la-cog me-2"></i>{t('common.settings')}
                            </Link>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button 
                              className="dropdown-item text-danger"
                              onClick={handleLogout}
                              disabled={isLoading}
                            >
                              <i className="la la-power-off me-2"></i>
                              {isLoading ? t('auth.logging_out') : t('nav.logout')}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
