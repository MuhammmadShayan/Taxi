// Settings utility functions for KIRASTAY application
// Provides helper functions to fetch and use system settings across the frontend

/**
 * Cache for settings to reduce API calls
 */
let settingsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all system settings from the API
 * @param {boolean} forceRefresh - Force refresh cache
 * @returns {Promise<Object>} Settings grouped by category
 */
export async function fetchSettings(forceRefresh = false) {
  // Check cache validity
  if (!forceRefresh && settingsCache && cacheTimestamp && 
      (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return settingsCache;
  }

  try {
    const response = await fetch('/api/admin/settings?grouped=true');
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    
    const data = await response.json();
    settingsCache = data.settings || {};
    cacheTimestamp = Date.now();
    
    return settingsCache;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

/**
 * Get a specific setting value by key
 * @param {string} key - Setting key
 * @param {string} defaultValue - Default value if setting not found
 * @returns {Promise<string>} Setting value
 */
export async function getSetting(key, defaultValue = '') {
  const settings = await fetchSettings();
  
  // Search through all categories for the setting
  for (const category of Object.values(settings)) {
    const setting = category.find(s => s.setting_key === key);
    if (setting) {
      return setting.setting_value || defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Get multiple settings by keys
 * @param {string[]} keys - Array of setting keys
 * @returns {Promise<Object>} Object with key-value pairs
 */
export async function getSettings(keys) {
  const settings = await fetchSettings();
  const result = {};
  
  keys.forEach(key => {
    result[key] = null;
    
    // Search through all categories for each setting
    for (const category of Object.values(settings)) {
      const setting = category.find(s => s.setting_key === key);
      if (setting) {
        result[key] = setting.setting_value;
        break;
      }
    }
  });
  
  return result;
}

/**
 * Get settings by category
 * @param {string} category - Category name
 * @returns {Promise<Object>} Settings in the category as key-value pairs
 */
export async function getSettingsByCategory(category) {
  const settings = await fetchSettings();
  const categorySettings = settings[category] || [];
  
  const result = {};
  categorySettings.forEach(setting => {
    result[setting.setting_key] = setting.setting_value;
  });
  
  return result;
}

/**
 * Get a boolean setting value
 * @param {string} key - Setting key
 * @param {boolean} defaultValue - Default boolean value
 * @returns {Promise<boolean>} Boolean setting value
 */
export async function getBooleanSetting(key, defaultValue = false) {
  const value = await getSetting(key, defaultValue.toString());
  return value === 'true' || value === true;
}

/**
 * Get a numeric setting value
 * @param {string} key - Setting key
 * @param {number} defaultValue - Default numeric value
 * @returns {Promise<number>} Numeric setting value
 */
export async function getNumericSetting(key, defaultValue = 0) {
  const value = await getSetting(key, defaultValue.toString());
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get a JSON setting value
 * @param {string} key - Setting key
 * @param {Object} defaultValue - Default object value
 * @returns {Promise<Object>} Parsed JSON setting value
 */
export async function getJSONSetting(key, defaultValue = {}) {
  const value = await getSetting(key, JSON.stringify(defaultValue));
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error parsing JSON setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Update a setting value (admin only)
 * @param {string} key - Setting key
 * @param {string} value - New setting value
 * @returns {Promise<boolean>} Success status
 */
export async function updateSetting(key, value) {
  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        setting_key: key,
        setting_value: value
      })
    });
    
    if (response.ok) {
      // Clear cache to force refresh
      settingsCache = null;
      cacheTimestamp = null;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating setting:', error);
    return false;
  }
}

/**
 * Get site branding settings
 * @returns {Promise<Object>} Branding settings
 */
export async function getBrandingSettings() {
  const keys = [
    'site_name',
    'site_tagline',
    'site_logo_url',
    'site_favicon_url',
    'site_description'
  ];
  
  return await getSettings(keys);
}

/**
 * Get contact information settings
 * @returns {Promise<Object>} Contact settings
 */
export async function getContactSettings() {
  const keys = [
    'contact_phone',
    'contact_email',
    'support_email',
    'business_address',
    'business_hours'
  ];
  
  return await getSettings(keys);
}

/**
 * Get payment settings
 * @returns {Promise<Object>} Payment settings
 */
export async function getPaymentSettings() {
  return await getSettingsByCategory('payment');
}

/**
 * Get booking settings
 * @returns {Promise<Object>} Booking settings
 */
export async function getBookingSettings() {
  return await getSettingsByCategory('booking');
}

/**
 * Get Google Maps settings
 * @returns {Promise<Object>} Maps settings
 */
export async function getMapsSettings() {
  return await getSettingsByCategory('maps');
}

/**
 * Get security settings
 * @returns {Promise<Object>} Security settings
 */
export async function getSecuritySettings() {
  return await getSettingsByCategory('security');
}

/**
 * Clear settings cache (useful after updates)
 */
export function clearSettingsCache() {
  settingsCache = null;
  cacheTimestamp = null;
}

/**
 * Check if a feature is enabled
 * @param {string} featureKey - Feature setting key
 * @returns {Promise<boolean>} Feature enabled status
 */
export async function isFeatureEnabled(featureKey) {
  return await getBooleanSetting(featureKey, false);
}

/**
 * Get currency formatting info
 * @returns {Promise<Object>} Currency info
 */
export async function getCurrencyInfo() {
  const [currency, symbol] = await Promise.all([
    getSetting('default_currency', 'MAD'),
    getSetting('currency_symbol', 'DH')
  ]);
  
  return { currency, symbol };
}

/**
 * Format currency value using site settings
 * @param {number} amount - Amount to format
 * @returns {Promise<string>} Formatted currency string
 */
export async function formatCurrency(amount) {
  const { symbol } = await getCurrencyInfo();
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${symbol}0.00`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Get commission rate for agencies
 * @returns {Promise<number>} Commission rate percentage
 */
export async function getCommissionRate() {
  return await getNumericSetting('default_commission', 15.0);
}

/**
 * Get maintenance mode status
 * @returns {Promise<boolean>} Maintenance mode status
 */
export async function isMaintenanceMode() {
  return await getBooleanSetting('maintenance_mode', false);
}

/**
 * Get maintenance message
 * @returns {Promise<string>} Maintenance message
 */
export async function getMaintenanceMessage() {
  return await getSetting('maintenance_message', 'We are currently performing scheduled maintenance. Please check back soon.');
}

/**
 * Get SEO settings
 * @returns {Promise<Object>} SEO settings
 */
export async function getSEOSettings() {
  const keys = [
    'site_meta_description',
    'site_meta_keywords',
    'google_analytics_id',
    'facebook_pixel_id'
  ];
  
  return await getSettings(keys);
}

/**
 * Get social media links
 * @returns {Promise<Object>} Social media URLs
 */
export async function getSocialMediaLinks() {
  return await getSettingsByCategory('social');
}

/**
 * Validate Google Maps API key
 * @returns {Promise<boolean>} API key validity
 */
export async function hasValidGoogleMapsKey() {
  const apiKey = await getSetting('google_maps_api_key', '');
  return apiKey.length > 0;
}

/**
 * Get upload limits and settings
 * @returns {Promise<Object>} Upload settings
 */
export async function getUploadSettings() {
  return await getSettingsByCategory('uploads');
}

/**
 * Hook for React components to use settings
 * @param {string} key - Setting key
 * @param {string} defaultValue - Default value
 * @returns {Object} { value, loading, error, refresh }
 */
export function useSetting(key, defaultValue = '') {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const settingValue = await getSetting(key, defaultValue);
      setValue(settingValue);
    } catch (err) {
      setError(err.message);
      setValue(defaultValue);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue]);
  
  useEffect(() => {
    fetchValue();
  }, [fetchValue]);
  
  return {
    value,
    loading,
    error,
    refresh: fetchValue
  };
}

// Export default object with all functions
export default {
  fetchSettings,
  getSetting,
  getSettings,
  getSettingsByCategory,
  getBooleanSetting,
  getNumericSetting,
  getJSONSetting,
  updateSetting,
  getBrandingSettings,
  getContactSettings,
  getPaymentSettings,
  getBookingSettings,
  getMapsSettings,
  getSecuritySettings,
  clearSettingsCache,
  isFeatureEnabled,
  getCurrencyInfo,
  formatCurrency,
  getCommissionRate,
  isMaintenanceMode,
  getMaintenanceMessage,
  getSEOSettings,
  getSocialMediaLinks,
  hasValidGoogleMapsKey,
  getUploadSettings,
  useSetting
};