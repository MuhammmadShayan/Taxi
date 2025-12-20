
# LocationIQ Autocomplete Implementation

This project now uses the [LocationIQ Autocomplete API](https://locationiq.com/) instead of Google Maps Places API to avoid billing issues.

## Setup Instructions

1.  **Get a Free API Key:**
    *   Sign up at [https://locationiq.com/](https://locationiq.com/).
    *   Get your "Public Token" (starts with `pk.`).
    *   It's free for up to 5,000 requests/day.

2.  **Configure Environment Variable:**
    *   Open your `.env.local` file (create it if it doesn't exist).
    *   Add the following line:
        ```env
        NEXT_PUBLIC_LOCATIONIQ_API_KEY=pk.your_actual_key_here
        ```
    *   Replace `pk.your_actual_key_here` with your actual token.
    *   Restart your dev server (`npm run dev`) to load the new variable.

## Component Details

**`src/components/LocationAutocomplete.js`**:
*   A custom React component that fetches suggestions from LocationIQ.
*   Includes debounce (300ms) to reduce API calls.
*   Displays a dropdown with suggestions.
*   Returns `formatted_address`, `lat`, `lng` on selection.

**Differences from Google:**
*   LocationIQ uses standard `fetch` instead of a script loader.
*   No "BillingNotEnabled" errors (free tier works immediately).
*   Attribution is included in the dropdown footer as required by their free license.

## Removed Google Maps Code
*   The `GoogleMapsLoader` component is no longer used in `VehicleSearchForm.js` or `page.js`.
*   You can delete `src/components/GoogleMapsLoader.js` if you wish to clean up, though keeping it is harmless.
