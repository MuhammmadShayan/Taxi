'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';
import LocationAutocomplete from '../../../components/LocationAutocomplete';
import { useI18n } from '../../../i18n/I18nProvider';

export default function CarDetail() {
  const { t } = useI18n();
  const params = useParams();
  const id = params.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedCars, setRelatedCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [mainImage, setMainImage] = useState('');

  const [bookingData, setBookingData] = useState({
    pickup_location: '',
    pickup_latitude: null,
    pickup_longitude: null,
    dropoff_location: '',
    dropoff_latitude: null,
    dropoff_longitude: null,
    pickup_date: '',
    pickup_time: '09:00',
    dropoff_date: '',
    dropoff_time: '09:00',
    passengers: 1
  });

  const [isHydrated, setIsHydrated] = useState(false);

  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [reviewData, setReviewData] = useState({
    name: '',
    email: '',
    message: '',
    service: 0,
    location: 0,
    value_for_money: 0,
    cleanliness: 0,
    facilities: 0
  });

  const [showEnquirySuccess, setShowEnquirySuccess] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  // Initialize booking data from search parameters
  useEffect(() => {
    if (searchParams) {
      const newBookingData = {
        pickup_location: searchParams.get('pickup_location') || '',
        pickup_latitude: searchParams.get('pickup_latitude') || null,
        pickup_longitude: searchParams.get('pickup_longitude') || null,
        dropoff_location: searchParams.get('dropoff_location') || searchParams.get('pickup_location') || '',
        dropoff_latitude: searchParams.get('dropoff_latitude') || null,
        dropoff_longitude: searchParams.get('dropoff_longitude') || null,
        pickup_date: searchParams.get('pickup_date') || '',
        pickup_time: searchParams.get('pickup_time') || '09:00',
        dropoff_date: searchParams.get('dropoff_date') || '',
        dropoff_time: searchParams.get('dropoff_time') || '09:00',
        passengers: parseInt(searchParams.get('passengers')) || 1
      };
      setBookingData(newBookingData);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCarDetails();
    fetchRelatedCars();
    fetchCarReviews();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cars/${id}`);
      if (response.ok) {
        const carData = await response.json();
        setCar(carData.car);

        // Parse images
        let images = [];
        if (carData.car.images) {
          try {
            images = typeof carData.car.images === 'string' ?
              JSON.parse(carData.car.images) : carData.car.images;
          } catch (e) {
            images = [carData.car.images];
          }
        }
        setSelectedImages(images);
        setMainImage(images[0] || '/html-folder/images/car-img.png');
      } else {
        console.error('Failed to fetch car details');
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCars = async () => {
    try {
      const response = await fetch(`/api/cars/related/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedCars(data.cars || []);
      }
    } catch (error) {
      console.error('Error fetching related cars:', error);
    }
  };

  const fetchCarReviews = async () => {
    try {
      const response = await fetch(`/api/cars/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching car reviews:', error);
    }
  };

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnquiryChange = (field, value) => {
    setEnquiryData(prev => ({ ...prev, [field]: value }));
  };

  const handleReviewChange = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRentalDays = () => {
    if (bookingData.pickup_date && bookingData.dropoff_date) {
      const pickup = new Date(bookingData.pickup_date);
      const dropoff = new Date(bookingData.dropoff_date);
      const diffTime = Math.abs(dropoff - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const calculateTotalPrice = () => {
    if (!car) return 0;
    const days = calculateRentalDays();
    // Base price per day
    const basePrice = car.price_per_day * days;

    // Additional cost per passenger (20% of daily rate per additional passenger)
    const passengerCost = car.price_per_day * 0.2 * (bookingData.passengers - 1) * days;

    return basePrice + passengerCost;
  };

  const handlePickupPlaceSelect = (place) => {
    let lat = null, lng = null;
    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }

    setBookingData(prev => ({
      ...prev,
      pickup_location: place.formatted_address || place.name,
      pickup_latitude: lat,
      pickup_longitude: lng
    }));
  };

  const handleDropoffPlaceSelect = (place) => {
    let lat = null, lng = null;
    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }

    setBookingData(prev => ({
      ...prev,
      dropoff_location: place.formatted_address || place.name,
      dropoff_latitude: lat,
      dropoff_longitude: lng
    }));
  };

  const handleBookNow = () => {
    const queryParams = new URLSearchParams({
      pickup_location: bookingData.pickup_location,
      pickup_latitude: bookingData.pickup_latitude || '',
      pickup_longitude: bookingData.pickup_longitude || '',
      dropoff_location: bookingData.dropoff_location,
      dropoff_latitude: bookingData.dropoff_latitude || '',
      dropoff_longitude: bookingData.dropoff_longitude || '',
      pickup_date: bookingData.pickup_date,
      pickup_time: bookingData.pickup_time,
      dropoff_date: bookingData.dropoff_date,
      dropoff_time: bookingData.dropoff_time,
      passengers: bookingData.passengers.toString()
    });

    router.push(`/cars/${id}/booking?${queryParams.toString()}`);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryData,
          car_id: id,
          type: 'car_enquiry'
        }),
      });

      if (response.ok) {
        setShowEnquirySuccess(true);
        setEnquiryData({ name: '', email: '', message: '' });
        setTimeout(() => setShowEnquirySuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/cars/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setShowReviewSuccess(true);
        setReviewData({
          name: '',
          email: '',
          message: '',
          service: 0,
          location: 0,
          value_for_money: 0,
          cleanliness: 0,
          facilities: 0
        });
        setTimeout(() => setShowReviewSuccess(false), 3000);
        fetchCarReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<i key={i} className="la la-star"></i>);
      } else {
        stars.push(<i key={i} className="la la-star-o"></i>);
      }
    }
    return stars;
  };

  const renderRatingStars = (rating, fieldName, onChange) => {
    return (
      <div className="rate-stars-option">
        {[1, 2, 3, 4, 5].map(star => (
          <div key={`${fieldName}-${star}`} className="d-inline">
            <input
              type="checkbox"
              className="form-check-input"
              id={`${fieldName}${star}`}
              value={star}
              checked={rating >= star}
              onChange={() => onChange(fieldName, star)}
            />
            <label htmlFor={`${fieldName}${star}`}></label>
          </div>
        ))}
      </div>
    );
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading car details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <h4>Car not found</h4>
            <p>The requested car could not be found.</p>
            <Link href="/cars" className="theme-btn">
              Back to Car List
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Parse features
  let features = [];
  if (car.features) {
    try {
      features = typeof car.features === 'string' ?
        (car.features.startsWith('[') ? JSON.parse(car.features) : car.features.split(',')) :
        car.features;
    } catch (e) {
      features = car.features.split(',');
    }
  }

  return (
    <>
      <Header />

      <Breadcrumb
        title={`${car.make} ${car.model} or Similar`}
        breadcrumbItems={[
          { label: 'Car', href: '/cars' },
          { label: `${car.make} ${car.model}` }
        ]}
      />

      <section className="car-detail-area padding-bottom-90px">
        <div className="single-content-navbar-wrap menu section-bg" id="single-content-navbar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="single-content-nav" id="single-content-nav">
                  <ul>
                    <li>
                      <a data-scroll="description" href="#description" className="scroll-link active">
                        Car Details
                      </a>
                    </li>
                    <li>
                      <a data-scroll="faq" href="#faq" className="scroll-link">
                        Faqs
                      </a>
                    </li>
                    <li>
                      <a data-scroll="reviews" href="#reviews" className="scroll-link">
                        Reviews
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="single-content-box">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="single-content-wrap padding-top-60px">
                  <div id="description" className="page-scroll">
                    <div className="single-content-item pb-4">
                      <h3 className="title font-size-26">
                        {car.make} {car.model} or Similar
                      </h3>
                      <div className="d-flex align-items-center pt-2">
                        <p className="me-2">{car.location}</p>
                        <p>
                          <span className="badge text-bg-warning text-white font-size-16">
                            {car.rating || 4.0}
                          </span>
                          <span>({car.total_bookings || 0} Reviews)</span>
                        </p>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    <div className="single-content-item py-4">
                      <div className="row">
                        <div className="col-lg-6 responsive-column">
                          <div className="single-feature-titles mb-3">
                            <h3 className="title font-size-16">Pick-up location details</h3>
                            <span className="font-size-13">Phone: 1-0825889755</span>
                          </div>
                          <div className="section-block"></div>
                          <div className="single-feature-titles my-3">
                            <h3 className="title font-size-15 font-weight-medium">Pick-up Time</h3>
                            <span className="font-size-13">
                              {bookingData.pickup_date && bookingData.pickup_time
                                ? `${bookingData.pickup_date}, ${bookingData.pickup_time}`
                                : 'To be selected'}
                            </span>
                          </div>
                          <div className="single-feature-titles mb-3">
                            <h3 className="title font-size-15 font-weight-medium">Location</h3>
                            <span className="font-size-13">{bookingData.pickup_location || car.location}</span>
                          </div>
                        </div>

                        <div className="col-lg-6 responsive-column">
                          <div className="single-feature-titles mb-3">
                            <h3 className="title font-size-16">Drop-off location details</h3>
                            <span className="font-size-13">Phone: 1-0825889755</span>
                          </div>
                          <div className="section-block"></div>
                          <div className="single-feature-titles my-3">
                            <h3 className="title font-size-15 font-weight-medium">Drop-off Time</h3>
                            <span className="font-size-13">
                              {bookingData.dropoff_date && bookingData.dropoff_time
                                ? `${bookingData.dropoff_date}, ${bookingData.dropoff_time}`
                                : 'To be selected'}
                            </span>
                          </div>
                          <div className="single-feature-titles mb-3">
                            <h3 className="title font-size-15 font-weight-medium">Location</h3>
                            <span className="font-size-13">{bookingData.dropoff_location || car.location}</span>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="section-block margin-bottom-35px"></div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Rental Company</h3>
                              <span className="font-size-13">{car.rental_company || 'Delta Rent a Car'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Car Type</h3>
                              <span className="font-size-13">{car.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Car Name</h3>
                              <span className="font-size-13">{car.make} {car.model}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-users"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Passengers</h3>
                              <span className="font-size-13">{car.seats}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-briefcase"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Baggage</h3>
                              <span className="font-size-13">{car.luggage_capacity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-gear"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Car Features</h3>
                              <span className="font-size-13">
                                {features.length > 0 ? `${features.length} features` : 'Standard'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Car Rental Information</h3>
                      <p className="py-3">
                        {car.description ||
                          `Experience comfort and reliability with our ${car.make} ${car.model}. This ${car.category} vehicle is perfect for your travel needs, featuring ${car.transmission} transmission and ${car.fuel_type} engine for optimal performance.`
                        }
                      </p>

                      {features.length > 0 && (
                        <div className="car-features mt-4">
                          <h4 className="font-size-18 mb-3">Features Include:</h4>
                          <div className="row">
                            {features.map((feature, index) => (
                              <div key={index} className="col-md-6 mb-2">
                                <div className="d-flex align-items-center">
                                  <i className="la la-check-circle text-success me-2"></i>
                                  <span>{feature.trim()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="section-block"></div>
                  </div>

                  {/* FAQ Section */}
                  <div id="faq" className="page-scroll">
                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Frequently Asked Questions</h3>
                      <div className="accordion accordion-item padding-top-30px" id="accordionExample2">
                        <div className="card">
                          <div className="card-header" id="faqHeadingFour">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseFour"
                                aria-expanded="true"
                                aria-controls="faqCollapseFour"
                              >
                                <span className="ms-3">What do I need to hire a car?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseFour"
                            className="collapse show"
                            aria-labelledby="faqHeadingFour"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body d-flex">
                              <p>
                                To hire a car, you'll need a valid driver's license, a credit card for the security deposit,
                                and proof of identity (passport or national ID). The minimum age requirement is typically 21 years old.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="faqHeadingFive">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseFive"
                                aria-expanded="false"
                                aria-controls="faqCollapseFive"
                              >
                                <span className="ms-3">How old do I have to be to rent a car?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseFive"
                            className="collapse"
                            aria-labelledby="faqHeadingFive"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body d-flex">
                              <p>
                                The minimum age to rent a car is 21 years old. However, drivers under 25 may be subject
                                to a young driver surcharge. Some luxury or specialty vehicles may have higher age requirements.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="faqHeadingSix">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseSix"
                                aria-expanded="false"
                                aria-controls="faqCollapseSix"
                              >
                                <span className="ms-3">Can I book a hire car for someone else?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseSix"
                            className="collapse"
                            aria-labelledby="faqHeadingSix"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body d-flex">
                              <p>
                                Yes, you can make a reservation for someone else, but the primary driver must be present
                                at pickup with their valid driver's license and credit card. The booking must match their details.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="faqHeadingSeven">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseSeven"
                                aria-expanded="false"
                                aria-controls="faqCollapseSeven"
                              >
                                <span className="ms-3">What is included in the rental price?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseSeven"
                            className="collapse"
                            aria-labelledby="faqHeadingSeven"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body d-flex">
                              <p>
                                The rental price includes basic insurance coverage, unlimited mileage (for most rentals),
                                and 24/7 roadside assistance. Additional insurance, GPS, and other extras can be added for an extra fee.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="section-block"></div>
                  </div>

                  {/* Reviews Section */}
                  <div id="reviews" className="page-scroll">
                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Reviews</h3>
                      <div className="review-container padding-top-30px">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="review-summary">
                              <h2>{car.rating || 4.5}<span>/5</span></h2>
                              <p>
                                {car.rating >= 4.5 ? 'Excellent' :
                                  car.rating >= 4 ? 'Very Good' :
                                    car.rating >= 3 ? 'Good' : 'Average'}
                              </p>
                              <span>Based on {reviews.length} reviews</span>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="review-bars">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Service</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="70%">
                                          <div className="progressbar-line-item bar-bg-1"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">4.6</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Location</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="55%">
                                          <div className="progressbar-line-item bar-bg-2"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">4.7</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Value for Money</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="40%">
                                          <div className="progressbar-line-item bar-bg-3"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">2.6</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Cleanliness</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="60%">
                                          <div className="progressbar-line-item bar-bg-4"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">3.6</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    {/* Review List */}
                    <div className="single-content-item padding-top-40px">
                      <h3 className="title font-size-20">
                        Showing {reviews.length} guest reviews
                      </h3>
                      <div className="comments-list padding-top-50px">
                        {reviews.map((review, index) => (
                          <div key={index} className="comment">
                            <div className="comment-avatar">
                              <img
                                className="avatar__img"
                                alt=""
                                src={review.avatar || `/html-folder/images/team${8 + (index % 3)}.jpg`}
                              />
                            </div>
                            <div className="comment-body">
                              <div className="meta-data">
                                <h3 className="comment__author">{review.name}</h3>
                                <div className="meta-data-inner d-flex">
                                  <span className="ratings d-flex align-items-center me-1">
                                    {renderStars(review.overall_rating)}
                                  </span>
                                  <p className="comment__date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <p className="comment-content">{review.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Write Review Form */}
                      <div className="comment-forum padding-top-40px">
                        <div className="form-box">
                          <div className="form-title-wrap">
                            <h3 className="title">Write a Review</h3>
                          </div>
                          <div className="form-content">
                            {showReviewSuccess && (
                              <div className="alert alert-success">
                                Thank you for your review! It has been submitted successfully.
                              </div>
                            )}
                            <div className="rate-option p-2">
                              <div className="row">
                                <div className="col-lg-4 responsive-column">
                                  <div className="rate-option-item">
                                    <label>Service</label>
                                    {renderRatingStars(reviewData.service, 'service', handleReviewChange)}
                                  </div>
                                </div>
                                <div className="col-lg-4 responsive-column">
                                  <div className="rate-option-item">
                                    <label>Location</label>
                                    {renderRatingStars(reviewData.location, 'location', handleReviewChange)}
                                  </div>
                                </div>
                                <div className="col-lg-4 responsive-column">
                                  <div className="rate-option-item">
                                    <label>Value for Money</label>
                                    {renderRatingStars(reviewData.value_for_money, 'value_for_money', handleReviewChange)}
                                  </div>
                                </div>
                                <div className="col-lg-4 responsive-column">
                                  <div className="rate-option-item">
                                    <label>Cleanliness</label>
                                    {renderRatingStars(reviewData.cleanliness, 'cleanliness', handleReviewChange)}
                                  </div>
                                </div>
                                <div className="col-lg-4 responsive-column">
                                  <div className="rate-option-item">
                                    <label>Facilities</label>
                                    {renderRatingStars(reviewData.facilities, 'facilities', handleReviewChange)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="contact-form-action">
                              <form onSubmit={handleReviewSubmit}>
                                <div className="row">
                                  <div className="col-lg-6 responsive-column">
                                    <div className="input-box">
                                      <label className="label-text">Name</label>
                                      <div className="form-group">
                                        <span className="la la-user form-icon"></span>
                                        <input
                                          className="form-control"
                                          type="text"
                                          value={reviewData.name}
                                          onChange={(e) => handleReviewChange('name', e.target.value)}
                                          placeholder="Your name"
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 responsive-column">
                                    <div className="input-box">
                                      <label className="label-text">Email</label>
                                      <div className="form-group">
                                        <span className="la la-envelope-o form-icon"></span>
                                        <input
                                          className="form-control"
                                          type="email"
                                          value={reviewData.email}
                                          onChange={(e) => handleReviewChange('email', e.target.value)}
                                          placeholder="Email address"
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-12">
                                    <div className="input-box">
                                      <label className="label-text">Message</label>
                                      <div className="form-group">
                                        <span className="la la-pencil form-icon"></span>
                                        <textarea
                                          className="message-control form-control"
                                          value={reviewData.message}
                                          onChange={(e) => handleReviewChange('message', e.target.value)}
                                          placeholder="Write your review"
                                          required
                                        ></textarea>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-12">
                                    <div className="btn-box">
                                      <button type="submit" className="theme-btn">
                                        Submit Review
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                <div className="sidebar single-content-sidebar mb-0">
                  <div className="sidebar-widget single-content-widget">
                    <div className="sidebar-widget-item">
                      <div className="sidebar-book-title-wrap mb-3">
                        <h3>Popular</h3>
                        <p>
                          <span className="text-form">From</span>
                          <span className="text-value ms-2 me-1">
                            ${car.price_per_day}
                            <small className="font-size-15 font-weight-bold ms-1 color-text-3">
                              /day
                            </small>
                          </span>
                          {car.original_price && car.original_price > car.price_per_day && (
                            <span className="before-price">${car.original_price}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="sidebar-widget-item">
                      <div className="contact-form-action">
                        <form onSubmit={(e) => { e.preventDefault(); handleBookNow(); }}>
                          <div className="input-box">
                            <label className="label-text">Pick-up From</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <LocationAutocomplete
                                className="form-control"
                                placeholder="Destination, city, or airport"
                                value={bookingData.pickup_location}
                                onChange={(value) => handleBookingChange('pickup_location', value)}
                                onPlaceSelect={handlePickupPlaceSelect}
                                required
                              />
                            </div>
                          </div>
                          <div className="input-box">
                            <label className="label-text">Drop-off to</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <LocationAutocomplete
                                className="form-control"
                                placeholder="Destination, city, or airport"
                                value={bookingData.dropoff_location}
                                onChange={(value) => handleBookingChange('dropoff_location', value)}
                                onPlaceSelect={handleDropoffPlaceSelect}
                                required
                              />
                            </div>
                          </div>
                          <div className="input-box">
                            <label className="label-text">Pick-up Date</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="form-control"
                                type="date"
                                value={bookingData.pickup_date}
                                onChange={(e) => handleBookingChange('pickup_date', e.target.value)}
                                min={today}
                                required
                              />
                            </div>
                          </div>
                          <div className="input-box">
                            <label className="label-text">Pick-up Time</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select
                                  className="select-contain-select"
                                  value={bookingData.pickup_time}
                                  onChange={(e) => handleBookingChange('pickup_time', e.target.value)}
                                  required
                                >
                                  {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="input-box">
                            <label className="label-text">Drop-off Date</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="form-control"
                                type="date"
                                value={bookingData.dropoff_date}
                                onChange={(e) => handleBookingChange('dropoff_date', e.target.value)}
                                min={bookingData.pickup_date || today}
                                required
                              />
                            </div>
                          </div>
                          <div className="input-box">
                            <label className="label-text">Drop-off Time</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select
                                  className="select-contain-select"
                                  value={bookingData.dropoff_time}
                                  onChange={(e) => handleBookingChange('dropoff_time', e.target.value)}
                                  required
                                >
                                  {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="input-box">
                            <div className="form-group">
                              <div className="qty-box mb-2 d-flex align-items-center justify-content-between">
                                <label className="font-size-16 color-text-2">Passengers</label>
                                <div className="qtyBtn d-flex align-items-center">
                                  <div
                                    className="qtyDec"
                                    onClick={() => handleBookingChange('passengers', Math.max(1, bookingData.passengers - 1))}
                                  >
                                    <i className="la la-minus"></i>
                                  </div>
                                  <input
                                    type="text"
                                    value={bookingData.passengers}
                                    readOnly
                                  />
                                  <div
                                    className="qtyInc"
                                    onClick={() => handleBookingChange('passengers', Math.min(car.seats, bookingData.passengers + 1))}
                                  >
                                    <i className="la la-plus"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Price Summary */}
                    {bookingData.pickup_date && bookingData.dropoff_date && (
                      <div className="sidebar-widget-item">
                        <div className="sidebar-price-summary">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Daily Rate:</span>
                            <span>${car.price_per_day}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Days:</span>
                            <span>{calculateRentalDays()}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Passengers:</span>
                            <span>{bookingData.passengers}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Base Cost:</span>
                            <span>${(car.price_per_day * calculateRentalDays()).toFixed(2)}</span>
                          </div>
                          {bookingData.passengers > 1 && (
                            <div className="d-flex justify-content-between mb-2">
                              <span>Extra Passengers ({bookingData.passengers - 1}):</span>
                              <span>${(car.price_per_day * 0.2 * (bookingData.passengers - 1) * calculateRentalDays()).toFixed(2)}</span>
                            </div>
                          )}
                          <hr />
                          <div className="d-flex justify-content-between font-weight-bold">
                            <span>Total:</span>
                            <span>${calculateTotalPrice().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="btn-box pt-2">
                      <button
                        onClick={handleBookNow}
                        className="theme-btn text-center w-100 mb-2"
                        disabled={!bookingData.pickup_date || !bookingData.dropoff_date || !bookingData.pickup_location}
                      >
                        <i className="la la-shopping-cart me-2 font-size-18"></i>Book Now
                      </button>
                      <a
                        href="#"
                        className="theme-btn text-center w-100 theme-btn-transparent"
                      >
                        <i className="la la-heart-o me-2"></i>Add to Wishlist
                      </a>
                      <div className="d-flex align-items-center justify-content-between pt-2">
                        <a
                          href="#"
                          className="btn theme-btn-hover-gray font-size-15"
                          data-bs-toggle="modal"
                          data-bs-target="#sharePopupForm"
                        >
                          <i className="la la-share me-1"></i>Share
                        </a>
                        <p>
                          <i className="la la-eye me-1 font-size-15 color-text-2"></i>
                          {car.views || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enquiry Form */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Enquiry Form</h3>
                    <div className="enquiry-forum">
                      <div className="form-box">
                        <div className="form-content">
                          {showEnquirySuccess && (
                            <div className="alert alert-success">
                              Thank you for your enquiry! We'll get back to you soon.
                            </div>
                          )}
                          <div className="contact-form-action">
                            <form onSubmit={handleEnquirySubmit}>
                              <div className="input-box">
                                <label className="label-text">Your Name</label>
                                <div className="form-group">
                                  <span className="la la-user form-icon"></span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={enquiryData.name}
                                    onChange={(e) => handleEnquiryChange('name', e.target.value)}
                                    placeholder="Your name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="input-box">
                                <label className="label-text">Your Email</label>
                                <div className="form-group">
                                  <span className="la la-envelope-o form-icon"></span>
                                  <input
                                    className="form-control"
                                    type="email"
                                    value={enquiryData.email}
                                    onChange={(e) => handleEnquiryChange('email', e.target.value)}
                                    placeholder="Email address"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="input-box">
                                <label className="label-text">Message</label>
                                <div className="form-group">
                                  <span className="la la-pencil form-icon"></span>
                                  <textarea
                                    className="message-control form-control"
                                    value={enquiryData.message}
                                    onChange={(e) => handleEnquiryChange('message', e.target.value)}
                                    placeholder="Write message"
                                    required
                                  ></textarea>
                                </div>
                              </div>
                              <div className="btn-box">
                                <button type="submit" className="theme-btn">
                                  Submit Enquiry
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why Book With Us */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Why Book With Us?</h3>
                    <div className="sidebar-list">
                      <ul className="list-items">
                        <li>
                          <i className="la la-dollar icon-element me-2"></i>No-hassle
                          best price guarantee
                        </li>
                        <li>
                          <i className="la la-microphone icon-element me-2"></i>
                          Customer care available 24/7
                        </li>
                        <li>
                          <i className="la la-thumbs-up icon-element me-2"></i>
                          Hand-picked Cars & Vehicles
                        </li>
                        <li>
                          <i className="la la-file-text icon-element me-2"></i>Free
                          Travel Insurance
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Get a Question?</h3>
                    <p className="font-size-14 line-height-24">
                      Do not hesitate to give us a call. We are an expert team and
                      we are happy to talk to you.
                    </p>
                    <div className="sidebar-list pt-3">
                      <ul className="list-items">
                        <li>
                          <i className="la la-phone icon-element me-2"></i>
                          <a href="#">+ 61 23 8093 3400</a>
                        </li>
                        <li>
                          <i className="la la-envelope icon-element me-2"></i>
                          <a href="mailto:info@trizen.com">info@trizen.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Cars Section */}
      {relatedCars.length > 0 && (
        <section className="related-area section--padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading text-center">
                  <h2 className="sec__title">You might also like</h2>
                </div>
              </div>
            </div>
            <div className="row padding-top-50px">
              {relatedCars.slice(0, 3).map(relatedCar => {
                let relatedImages = [];
                if (relatedCar.images) {
                  try {
                    relatedImages = typeof relatedCar.images === 'string' ?
                      JSON.parse(relatedCar.images) : relatedCar.images;
                  } catch (e) {
                    relatedImages = [relatedCar.images];
                  }
                }

                return (
                  <div key={relatedCar.id} className="col-lg-4 responsive-column">
                    <div className="card-item car-card">
                      <div className="card-img">
                        <Link href={`/cars/${relatedCar.id}`} className="d-block">
                          <img
                            src={relatedImages[0] || '/html-folder/images/car-img.png'}
                            alt={`${relatedCar.make} ${relatedCar.model}`}
                          />
                        </Link>
                        {relatedCar.rating >= 4.5 && <span className="badge">Bestseller</span>}
                        <div
                          className="add-to-wishlist icon-element"
                          data-bs-toggle="tooltip"
                          data-placement="top"
                          title="Save for later"
                        >
                          <i className="la la-heart-o"></i>
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-meta">{relatedCar.category}</p>
                        <h3 className="card-title">
                          <Link href={`/cars/${relatedCar.id}`}>
                            {relatedCar.make} {relatedCar.model} or Similar
                          </Link>
                        </h3>
                        <div className="card-rating">
                          <span className="badge text-white">{relatedCar.rating || 4.0}/5</span>
                          <span className="review__text">
                            {relatedCar.rating >= 4.5 ? 'Excellent' :
                              relatedCar.rating >= 4 ? 'Very Good' :
                                relatedCar.rating >= 3 ? 'Good' : 'Average'}
                          </span>
                          <span className="rating__text">({relatedCar.total_bookings || 0} Reviews)</span>
                        </div>
                        <div className="card-attributes">
                          <ul className="d-flex align-items-center">
                            <li
                              className="d-flex align-items-center"
                              data-bs-toggle="tooltip"
                              data-placement="top"
                              title="Passenger"
                            >
                              <i className="la la-users"></i><span>{relatedCar.seats}</span>
                            </li>
                            <li
                              className="d-flex align-items-center"
                              data-bs-toggle="tooltip"
                              data-placement="top"
                              title="Luggage"
                            >
                              <i className="la la-suitcase"></i><span>{relatedCar.luggage_capacity}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="card-price d-flex align-items-center justify-content-between">
                          <p>
                            <span className="price__from">From</span>
                            <span className="price__num">${relatedCar.price_per_day}</span>
                            <span className="price__text">Per day</span>
                          </p>
                          <Link href={`/cars/${relatedCar.id}`} className="btn-text">
                            See details<i className="la la-angle-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
