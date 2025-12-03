'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrendingVehicles() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  // Sample car data matching the original design
  const vehicles = [
    {
      id: 1,
      image: '/html-folder/images/car-img.png',
      fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY4ZmYiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM2YjczODAiPkNhciBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K',
      badge: 'Bestseller',
      category: 'Compact SUV',
      title: 'Toyota Corolla or Similar',
      rating: '4.4/5',
      reviewText: 'Average',
      reviewCount: '(30 Reviews)',
      passengers: 4,
      luggage: 1,
      priceFrom: 'From',
      price: '$23.00',
      priceText: 'Per day',
      link: '/car-single'
    },
    {
      id: 2,
      image: '/html-folder/images/car-img2.png',
      fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY4ZmYiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM2YjczODAiPkNhciBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K',
      badge: null,
      category: 'Standard',
      title: 'Volkswagen Jetta 2 Doors or Similar',
      rating: '4.4/5',
      reviewText: 'Average',
      reviewCount: '(30 Reviews)',
      passengers: 4,
      luggage: 1,
      priceFrom: 'From',
      price: '$33.00',
      priceText: 'Per day',
      link: '/car-single'
    },
    {
      id: 3,
      image: '/html-folder/images/car-img3.png',
      fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY4ZmYiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM2YjczODAiPkNhciBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K',
      badge: 'Featured',
      category: 'Compact Elite',
      title: 'Toyota Yaris or Similar',
      rating: '4.4/5',
      reviewText: 'Average',
      reviewCount: '(30 Reviews)',
      passengers: 4,
      luggage: 1,
      priceFrom: 'From',
      price: '$23.00',
      priceText: 'Per day',
      link: '/car-single'
    },
    {
      id: 4,
      image: '/html-folder/images/car-img4.png',
      fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY4ZmYiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM2YjczODAiPkNhciBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K',
      badge: 'Bestseller',
      category: 'SUV',
      title: 'Honda CR-V or Similar',
      rating: '4.6/5',
      reviewText: 'Excellent',
      reviewCount: '(45 Reviews)',
      passengers: 5,
      luggage: 2,
      priceFrom: 'From',
      price: '$45.00',
      priceText: 'Per day',
      link: '/car-single'
    }
  ];

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + visibleItems >= vehicles.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? Math.max(0, vehicles.length - visibleItems) : prev - 1
    );
  };

  const handleImageError = (e) => {
    const vehicle = vehicles.find(v => v.image === e.target.src);
    if (vehicle) {
      e.target.src = vehicle.fallbackImage;
    }
  };

  return (
    <section className="car-area section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading text-center mb-12">
              <h2 className="sec__title text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Trending Used Cars
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our most popular vehicle rentals, chosen by travelers across Morocco
              </p>
            </div>
          </div>
        </div>

        <div className="row padding-top-50px">
          <div className="col-lg-12">
            <div className="car-carousel carousel-action relative">
              {/* Carousel Navigation */}
              <div className="carousel-nav absolute top-0 right-0 flex space-x-2 z-10">
                <button 
                  onClick={prevSlide}
                  className="nav-btn bg-white hover:bg-blue-600 hover:text-white text-gray-600 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <i className="la la-angle-left text-lg"></i>
                </button>
                <button 
                  onClick={nextSlide}
                  className="nav-btn bg-white hover:bg-blue-600 hover:text-white text-gray-600 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <i className="la la-angle-right text-lg"></i>
                </button>
              </div>

              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`
                  }}
                >
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className={`flex-none w-full ${visibleItems === 1 ? '' : visibleItems === 2 ? 'md:w-1/2' : 'md:w-1/2 lg:w-1/3'} px-3`}>
                      <div className="card-item car-card mb-0 border bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Card Image */}
                        <div className="card-img relative">
                          <Link href={vehicle.link} className="d-block">
                            <img 
                              src={vehicle.image} 
                              alt={vehicle.title}
                              className="w-full h-48 object-cover"
                              onError={handleImageError}
                            />
                          </Link>
                          
                          {/* Badge */}
                          {vehicle.badge && (
                            <span className={`badge absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                              vehicle.badge === 'Bestseller' 
                                ? 'bg-orange-500 text-white' 
                                : vehicle.badge === 'Featured'
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {vehicle.badge}
                            </span>
                          )}
                          
                          {/* Wishlist Button */}
                          <div className="add-to-wishlist icon-element absolute top-3 right-3 w-8 h-8 bg-white hover:bg-red-500 hover:text-white text-gray-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                               title="Add to wishlist">
                            <i className="la la-heart-o text-sm"></i>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="card-body p-4">
                          <p className="card-meta text-sm text-gray-500 mb-2">{vehicle.category}</p>
                          <h3 className="card-title text-lg font-semibold mb-3 hover:text-blue-600 transition-colors">
                            <Link href={vehicle.link}>
                              {vehicle.title}
                            </Link>
                          </h3>
                          
                          {/* Rating */}
                          <div className="card-rating flex items-center mb-4">
                            <span className="badge bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2">
                              {vehicle.rating}
                            </span>
                            <span className="review__text text-sm text-gray-600 mr-2">{vehicle.reviewText}</span>
                            <span className="rating__text text-sm text-gray-500">{vehicle.reviewCount}</span>
                          </div>
                          
                          {/* Attributes */}
                          <div className="card-attributes mb-4">
                            <ul className="d-flex align-items-center space-x-4">
                              <li className="d-flex align-items-center text-gray-600" title="Passenger">
                                <i className="la la-users mr-1"></i>
                                <span>{vehicle.passengers}</span>
                              </li>
                              <li className="d-flex align-items-center text-gray-600" title="Luggage">
                                <i className="la la-suitcase mr-1"></i>
                                <span>{vehicle.luggage}</span>
                              </li>
                            </ul>
                          </div>
                          
                          {/* Price and Details */}
                          <div className="card-price d-flex align-items-center justify-content-between">
                            <div className="price-info">
                              <span className="price__from text-sm text-gray-500">{vehicle.priceFrom}</span>
                              <span className="price__num text-xl font-bold text-blue-600 mx-1">{vehicle.price}</span>
                              <span className="price__text text-sm text-gray-500">{vehicle.priceText}</span>
                            </div>
                            <Link 
                              href={vehicle.link} 
                              className="btn-text text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                            >
                              See details
                              <i className="la la-angle-right ml-1"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(vehicles.length / visibleItems) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * visibleItems)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / visibleItems) === index 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
