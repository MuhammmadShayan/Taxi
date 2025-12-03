"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";
import zh from "./locales/zh.json";

// KIRASTAY platform supports multiple languages
const DICTS = { en, de, fr, es, pt, zh };
const DEFAULT_LANG = "en";

// Language configuration for KIRASTAY
const LANGUAGES = {
  en: { name: "English", flag: "🇺🇸", dir: "ltr" },
  de: { name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  fr: { name: "Français", flag: "🇫🇷", dir: "ltr" },
  es: { name: "Español", flag: "🇪🇸", dir: "ltr" },
  pt: { name: "Português", flag: "🇵🇹", dir: "ltr" },
  zh: { name: "中文", flag: "🇨🇳", dir: "ltr" }
};

const I18nContext = createContext({
  lang: DEFAULT_LANG,
  setLang: (_l) => {},
  t: (key, vars) => key,
  languages: LANGUAGES,
  isRTL: false,
});

function interpolate(str, vars) {
  if (!vars) return str;
  return Object.keys(vars).reduce((acc, k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    return acc.replace(regex, String(vars[k]));
  }, str);
}

// Function to format numbers according to locale (KIRASTAY platform)
function formatNumber(number, lang) {
  const localeMap = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    pt: 'pt-PT',
    zh: 'zh-CN'
  };
  
  return new Intl.NumberFormat(localeMap[lang] || 'en-US').format(number);
}

// Function to format currency according to locale (Morocco MAD default)
function formatCurrency(amount, currency = 'MAD', lang) {
  const localeMap = {
    en: 'en-MA',
    de: 'de-DE',
    fr: 'fr-MA',
    es: 'es-ES',
    pt: 'pt-PT',
    zh: 'zh-CN'
  };
  
  return new Intl.NumberFormat(localeMap[lang] || 'en-MA', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Function to format dates according to locale
function formatDate(date, lang, options = {}) {
  const localeMap = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    pt: 'pt-PT',
    zh: 'zh-CN'
  };
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat(localeMap[lang] || 'en-US', { ...defaultOptions, ...options }).format(new Date(date));
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("kirastay_lang") : null;
    if (saved && DICTS[saved]) {
      setLang(saved);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && isInitialized) {
      document.documentElement.lang = lang;
      document.documentElement.dir = LANGUAGES[lang]?.dir || "ltr";
      
      // Update body class for RTL support
      const body = document.body;
      if (LANGUAGES[lang]?.dir === "rtl") {
        body.classList.add("rtl");
        body.classList.remove("ltr");
      } else {
        body.classList.add("ltr");
        body.classList.remove("rtl");
      }
    }
  }, [lang, isInitialized]);

  const t = useMemo(() => {
    const dict = DICTS[lang] || DICTS[DEFAULT_LANG];
    const fallback = DICTS[DEFAULT_LANG];
    return (key, vars) => {
      const val = key.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
      const fb = key.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), fallback);
      const out = (typeof val === "string" ? val : typeof fb === "string" ? fb : key);
      return interpolate(out, vars);
    };
  }, [lang]);

  const changeLang = (newLang) => {
    if (DICTS[newLang] && newLang !== lang) {
      setLang(newLang);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("kirastay_lang", newLang);
        
        // Dispatch a custom event for components to listen to language changes
        window.dispatchEvent(new CustomEvent('languageChange', { 
          detail: { oldLang: lang, newLang } 
        }));
      }
    }
  };

  const value = useMemo(() => ({
    lang,
    setLang: changeLang,
    t,
    languages: LANGUAGES,
    isRTL: LANGUAGES[lang]?.dir === "rtl",
    formatNumber: (number) => formatNumber(number, lang),
    formatCurrency: (amount, currency) => formatCurrency(amount, currency, lang),
    formatDate: (date, options) => formatDate(date, lang, options),
    isInitialized
  }), [lang, t, isInitialized]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

