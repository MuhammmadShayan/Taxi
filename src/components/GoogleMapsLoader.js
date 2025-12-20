'use client';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

export default function GoogleMapsLoader({ children }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAC9IhpN0ggVpnvBYOkwMvwKzcZuPxuXX0',
        libraries,
    });

    if (loadError) {
        return <div className="p-3 text-red-500">Error loading Google Maps API</div>;
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
