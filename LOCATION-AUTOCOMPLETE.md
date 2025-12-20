
# Google Maps Location Autocomplete Implementation

This directory contains the implementation of the Google Places Autocomplete components.

## Components

1.  **`src/components/LocationAutocomplete.js`**:
    *   A reusable input component that wraps the Google Maps Autocomplete widget.
    *   Handles place selection and returns formated addresses + geometry.
    *   Falls back to standard text input if API fails (e.g. billing error).

2.  **`src/components/GoogleMapsLoader.js`**:
    *   A wrapper component ensuring the Google Maps script is loaded only once.
    *   Handles loading errors and authentication failures (e.g., invalid key or billing issues).

## IMPORTANT: Billing Configuration

You are currently seeing a **BillingNotEnabledMapError**. This is an external configuration issue, not a code error.

**To fix this:**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/project/_/billing/enable).
2.  Select your project associated with key `AIzaSyAC9IhpN0ggVpnvBYOkwMvwKzcZuPxuXX0`.
3.  **Enable Billing** by adding a valid credit card. Google Maps Platform requires a billing account even for the free tier.

**If you cannot enable billing immediately:**
The `LocationAutocomplete` component is designed to allow manual text entry. Users can still type a location name (e.g., "London Heathrow") and submit the form. The system will process it as a text string, although map coordinates will be missing.