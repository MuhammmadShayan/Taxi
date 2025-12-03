/**
 * Car Carousel Component
 * Example implementation of Owl Carousel in Next.js using our custom hook
 */

'use client';
import { useCarCarousel } from '../hooks/useOwlCarousel';
import { useEffect, useState } from 'react';

const CarCarousel = ({ cars = [] }) => {
  const { carouselRef, isLoading, error, isInitialized } = useCarCarousel([cars]);
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server side to avoid hydration issues
  if (!mounted) {
    return (
      <div className="carousel-placeholder">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="car-carousel-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading text-center">
              <h2 className="sec__title">Featured Cars</h2>
              <p className="sec__desc">Discover our premium vehicle collection</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
                <br />
                <small>Please refresh the page or try again later.</small>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading carousel...</span>
                </div>
                <p className="mt-2">Initializing carousel...</p>
              </div>
            )}

            <div 
              ref={carouselRef}
              className={`owl-carousel owl-theme car-carousel ${isInitialized ? 'carousel-ready' : ''}`}
              style={{ 
                opacity: isLoading ? 0.5 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              {cars.length > 0 ? (
                cars.map((car, index) => (
                  <div key={car.id || index} className="item">
                    <CarCard car={car} />
                  </div>
                ))
              ) : (
                // Fallback demo cars if no data provided
                <DemoCarCards />
              )}
            </div>

            {!isLoading && cars.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No cars available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual Car Card Component
 */
const CarCard = ({ car }) => {
  const defaultImage = '/html-folder/images/car-img.png';
  
  const getCarImage = (images) => {
    if (!images) return defaultImage;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed[0] || defaultImage : parsed || defaultImage;
      } catch {
        return images || defaultImage;
      }
    }
    if (Array.isArray(images)) {
      return images[0] || defaultImage;
    }
    return defaultImage;
  };

  return (
    <div className="card-item car-card">
      <div className="card-img">
        <a href={`/cars/${car.id}`} className="d-block">
          <img 
            src={getCarImage(car.images)} 
            alt={`${car.make || ''} ${car.model || 'Vehicle'}`}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </a>
        <div className="card-badge">
          <span className="badge badge-primary">
            ${car.price_per_day || '0'}/day
          </span>
        </div>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">
          <a href={`/cars/${car.id}`} className="card-link">
            {car.make} {car.model}
          </a>
        </h3>
        
        <div className="card-meta">
          <div className="card-meta-item">
            <i className="la la-map-marker me-1"></i>
            <span>{car.city || 'Location'}</span>
          </div>
          
          <div className="card-meta-item">
            <i className="la la-users me-1"></i>
            <span>{car.seats || '4'} Seats</span>
          </div>
          
          <div className="card-meta-item">
            <i className="la la-cog me-1"></i>
            <span>{car.gear_type || 'Auto'}</span>
          </div>
        </div>
        
        <div className="card-price">
          <p className="price">
            <span className="price-text">From</span>
            <span className="price-value">${car.price_per_day || '0'}</span>
            <span className="price-text">per day</span>
          </p>
        </div>
        
        <div className="btn-box">
          <a href={`/cars/${car.id}`} className="theme-btn theme-btn-small w-100">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Demo Car Cards for fallback
 */
const DemoCarCards = () => {
  const demoCars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      price_per_day: '45',
      seats: '5',
      gear_type: 'Auto',
      city: 'Casablanca',
      images: '/html-folder/images/car-img.png'
    },
    {
      id: 2,
      make: 'BMW',
      model: 'X3',
      price_per_day: '85',
      seats: '5',
      gear_type: 'Auto',
      city: 'Rabat',
      images: '/html-folder/images/car-img2.jpg'
    },
    {
      id: 3,
      make: 'Mercedes',
      model: 'C-Class',
      price_per_day: '95',
      seats: '5',
      gear_type: 'Auto',
      city: 'Marrakech',
      images: '/html-folder/images/car-img3.jpg'
    },
    {
      id: 4,
      make: 'Audi',
      model: 'A4',
      price_per_day: '75',
      seats: '5',
      gear_type: 'Auto',
      city: 'Fes',
      images: '/html-folder/images/car-img4.jpg'
    }
  ];

  return (
    <>
      {demoCars.map((car) => (
        <div key={car.id} className="item">
          <CarCard car={car} />
        </div>
      ))}
    </>
  );
};

export default CarCarousel;
