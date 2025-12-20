'use client';
import { useLoadScript } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const libraries = ['places'];

export default function GoogleMapsLoader({ children }) {
    const [authError, setAuthError] = useState(false);

    // Global handler for Google Maps Auth Failure
    useEffect(() => {
        window.gm_authFailure = () => {
            console.error("Google Maps Authentication Failed");
            setAuthError(true);
        };
    }, []);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAC9IhpN0ggVpnvBYOkwMvwKzcZuPxuXX0',
        libraries,
    });

    if (loadError || authError) {
        return (
            <div className="alert alert-danger p-3 m-3" role="alert">
                <h4 className="alert-heading">Google Maps Error</h4>
                <p>There was a problem loading the Google Maps API.</p>
                <hr />
                <p className="mb-0">
                    {authError
                        ? "Authentication Failed: Please check your API key restrictions and billing status in the Google Cloud Console."
                        : "Script Loading Failed: Please check your internet connection or API key configuration."}
                </p>
                <small className="text-muted mt-2 d-block">Error Code: {authError ? 'gm_authFailure' : loadError?.message}</small>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center p-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading options...</span>
                </div>
            </div>
        );
    }

    return children;
}
