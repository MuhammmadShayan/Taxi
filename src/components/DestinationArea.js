'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function DestinationArea() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations?featured=true&limit=6');
        if (response.ok) {
          const data = await response.json();
          setDestinations(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <section className="destination-area padding-top-50px padding-bottom-70px">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading destinations...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="destination-area padding-top-50px padding-bottom-70px">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="section-heading">
              <h2 className="sec__title">Top Destinations</h2>
              <p className="sec__desc pt-3">
                Morbi convallis bibendum urna ut viverra Maecenas quis
              </p>
            </div>

            
          </div>
          
          <div className="col-lg-4">
            <div className="btn-box btn--box text-end">
              <Link href="/destinations" className="theme-btn">
                Discover More <i className="la la-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="row padding-top-50px">
          {destinations.map((destination, index) => (
            <div key={destination.id || index} className="col-lg-4 responsive-column">
              <div className="card-item destination-card destination--card">
                <div className="card-img">
                  <img 
                    src={destination.image || '/html-folder/images/destination-img2.jpg'} 
                    alt={`${destination.name} destination`} 
                  />
                </div>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="card-title mb-0">
                      <Link href={`/cars?pickup_location=${encodeURIComponent(destination.name)}`}>
                        {destination.name}
                      </Link>
                    </h3>
                    {destination.country && (
                      <p className="text-muted small mb-0">{destination.country}</p>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/cars?pickup_location=${encodeURIComponent(destination.name)}`}
                      className="theme-btn theme-btn-small border-0"
                    >
                      Explore <i className="la la-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
