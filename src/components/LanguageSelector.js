'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function LanguageSelector({ className = '', showFlag = true, showText = true }) {
  const { lang, setLang, languages, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setIsOpen(false);
  };

  const currentLanguage = languages[lang];

  return (
    <div className={`language-selector ${className}`} ref={dropdownRef}>
      <div 
        className="lang-trigger"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        {showFlag && <span className="lang-flag">{currentLanguage?.flag}</span>}
        {showText && <span className="lang-text">{currentLanguage?.name}</span>}
        <i className={`la la-angle-down lang-arrow ${isOpen ? 'rotate' : ''}`}></i>
      </div>
      
      {isOpen && (
        <div className="lang-dropdown">
          {Object.entries(languages).map(([langCode, langInfo]) => (
            <div
              key={langCode}
              className={`lang-option ${langCode === lang ? 'active' : ''}`}
              onClick={() => handleLanguageChange(langCode)}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleLanguageChange(langCode);
                }
              }}
            >
              {showFlag && <span className="lang-flag">{langInfo.flag}</span>}
              <span className="lang-text">{langInfo.name}</span>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .language-selector {
          position: relative;
          display: inline-block;
        }
        
        .lang-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          justify-content: space-between;
        }
        
        .lang-trigger:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }
        
        .lang-flag {
          font-size: 16px;
          line-height: 1;
        }
        
        .lang-text {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
        }
        
        .lang-arrow {
          font-size: 12px;
          transition: transform 0.2s ease;
          color: #666;
        }
        
        .lang-arrow.rotate {
          transform: rotate(180deg);
        }
        
        .lang-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .lang-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .lang-option:last-child {
          border-bottom: none;
        }
        
        .lang-option:hover {
          background: #f8f9fa;
        }
        
        .lang-option.active {
          background: #007bff;
          color: white;
        }
        
        .lang-option.active .lang-text {
          color: white;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .lang-trigger {
            min-width: 100px;
            padding: 6px 10px;
          }
          
          .lang-text {
            font-size: 13px;
          }
          
          .lang-dropdown {
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  );
}

// Alternative compact version for headers
export function CompactLanguageSelector({ className = '' }) {
  return (
    <LanguageSelector 
      className={`compact-lang ${className}`}
      showText={false}
      showFlag={true}
    />
  );
}

// Alternative dropdown version for headers that matches the existing HTML structure
export function HeaderLanguageSelector({ className = '' }) {
  const { lang, setLang, languages } = useI18n();
  const selectRef = useRef(null);

  // Prevent Select2 from initializing on this select
  useEffect(() => {
    if (selectRef.current) {
      // Add a data attribute to prevent Select2 initialization
      selectRef.current.setAttribute('data-no-select2', 'true');
      
      // If Select2 has already been initialized, destroy it
      if (typeof window !== 'undefined' && window.jQuery && window.jQuery.fn.select2) {
        const $select = window.jQuery(selectRef.current);
        if ($select.hasClass('select2-hidden-accessible')) {
          $select.select2('destroy');
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    // React will automatically re-render all components using t()
  };

  return (
    <div className={`select-contain select--contain w-auto ${className}`}>
      <select 
        ref={selectRef}
        className="select-contain-select"
        value={lang}
        onChange={handleChange}
        aria-label="Language selector"
        data-no-select2="true"
        style={{
          appearance: 'auto',
          WebkitAppearance: 'menulist',
          MozAppearance: 'menulist'
        }}
      >
        {Object.entries(languages).map(([langCode, langInfo]) => (
          <option key={langCode} value={langCode}>
            {langInfo.flag} {langInfo.name}
          </option>
        ))}
      </select>
    </div>
  );
}
