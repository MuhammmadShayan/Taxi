'use client';
import { useState, useEffect } from 'react';

export default function ClientOnlySelectors() {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState('English US');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading placeholder during SSR and initial hydration
  if (!mounted) {
    return (
      <div className="header-right d-flex align-items-center justify-content-end">
        <div className="header-right-action">
          <div className="select-contain select--contain w-auto">
            <div 
              className="loading-placeholder" 
              style={{
                width: '120px', 
                height: '38px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '14px', 
                color: '#6c757d'
              }}
            >
              English US
            </div>
          </div>
        </div>
        <div className="header-right-action">
          <div className="select-contain select--contain w-auto">
            <div 
              className="loading-placeholder" 
              style={{
                width: '80px', 
                height: '38px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '14px', 
                color: '#6c757d'
              }}
            >
              USD
            </div>
          </div>
        </div>
        <div className="header-right-action">
          <a href="/become-local-expert" className="theme-btn theme-btn-small">
            Become Local Expert
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="header-right d-flex align-items-center justify-content-end">
      <div className="header-right-action">
        <div className="select-contain select--contain w-auto">
          <select 
            className="select-contain-select" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Language selector"
          >
            <option value="English US">English US</option>
            <option value="Francais">Français</option>
            <option value="Español">Español</option>
          </select>
        </div>
      </div>
      <div className="header-right-action">
        <div className="select-contain select--contain w-auto">
          <select 
            className="select-contain-select" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Currency selector"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="MAD">MAD</option>
          </select>
        </div>
      </div>
      <div className="header-right-action">
        <a href="/become-local-expert" className="theme-btn theme-btn-small">
          Become Local Expert
        </a>
      </div>
    </div>
  );
}
