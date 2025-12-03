'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCurrency } from '../../../contexts/CurrencyContext';

export default function CarSingle({ params }) {
  const router = useRouter();
  const { formatCurrency, convertAmount } = useCurrency();
  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Booking form state
  const [formData, setFormData] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_date: '',
    pickup_time: '9:00AM',
    dropoff_date: '',
    dropoff_time: '9:00AM',
    passengers: 1,
    car_id: params.id
  });

  useEffect(() => {
    // Fetch all vehicles and find the selected one + related cars
    fetch('/api/vehicles/trending')
      .then(async (res) => {
        const data = await res.json();
        if (data.success && data.vehicles) {
          // Find the specific car
          const selectedCar = data.vehicles.find(v => v.id == params.id);
          if (selectedCar) {
            setCar(selectedCar);
          } else {
            setError('Car not found');
          }
          
          // Get 3 random cars excluding current one for related section
          const filtered = data.vehicles.filter(v => v.id != params.id);
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setRelatedCars(shuffled.slice(0, 3));
        } else {
          setError('Failed to load vehicle data');
        }
      })
      .catch((e) => {
        console.error('Error fetching vehicle data:', e);
        setError('Failed to load vehicle data');
      });
  }, [params.id]);

  function resolveImage(images) {
    try {
      if (!images) return '/html-folder/images/car-img.png';
      if (Array.isArray(images)) return images[0] || '/html-folder/images/car-img.png';
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed[0] || '/html-folder/images/car-img.png';
      if (typeof parsed === 'string' && parsed) return parsed;
    } catch (_) {}
    return '/html-folder/images/car-img.png';
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePassengerChange = (increment) => {
    setFormData(prev => ({
      ...prev,
      passengers: Math.max(1, Math.min(8, prev.passengers + increment))
    }));
  };
  
  const handleBookNow = (e) => {
    e.preventDefault();
    console.log('Book Now clicked with data:', formData);
    
    if (!formData.pickup_location || !formData.pickup_date || !formData.dropoff_date) {
      alert('Please fill all required fields');
      return;
    }
    
    const urlParams = new URLSearchParams({
      pickup_location: formData.pickup_location,
      dropoff_location: formData.dropoff_location || formData.pickup_location,
      start_date: formData.pickup_date,
      end_date: formData.dropoff_date,
      pickup_time: formData.pickup_time,
      dropoff_time: formData.dropoff_time,
      car_type: '1',
      rental_company: '',
      discount_code: '0',
      preselected_car: params.id
    });
    
    console.log('Navigating to:', `/search?${urlParams.toString()}`);
    router.push(`/search?${urlParams.toString()}`);
  };

  if (error) {
    return (
      <>
        {/* CSS imports */}
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/html-folder/css/daterangepicker.css" />
        <link rel="stylesheet" href="/html-folder/css/animated-headline.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery-ui.css" />
        <link rel="stylesheet" href="/html-folder/css/flag-icon.min.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
        
        <Header />
        <main>
          <div className="container mt-5 pt-5">
            <div className="alert alert-danger">
              <h4>Error loading car details</h4>
              <p>{error}</p>
              <Link href="/" className="btn btn-primary">Go Home</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        {/* CSS imports */}
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/html-folder/css/daterangepicker.css" />
        <link rel="stylesheet" href="/html-folder/css/animated-headline.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery-ui.css" />
        <link rel="stylesheet" href="/html-folder/css/flag-icon.min.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
        
        <Header />
        <main>
          <div className="container mt-5 pt-5">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading car details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
      <link rel="stylesheet" href="/html-folder/css/owl.theme.default.min.css" />
      <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
      <link rel="stylesheet" href="/html-folder/css/daterangepicker.css" />
      <link rel="stylesheet" href="/html-folder/css/animated-headline.css" />
      <link rel="stylesheet" href="/html-folder/css/jquery-ui.css" />
      <link rel="stylesheet" href="/html-folder/css/flag-icon.min.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      
      <Header />
      
      {/* Breadcrumb Top Bar */}
      <section className="breadcrumb-top-bar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-list breadcrumb-top-list">
                <ul className="list-items bg-transparent radius-none p-0">
                  <li><Link href="/">Home</Link></li>
                  <li>{car.location || 'Location'}</li>
                  <li>{car.brand} {car.model} or Similar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hero Section with Background */}
      <section className="breadcrumb-area bread-bg-8 py-0">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-btn">
                  <div className="btn-box">
                    <a
                      className="theme-btn"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="la la-video-camera me-2"></i>Video
                    </a>
                    <a
                      className="theme-btn"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="la la-photo me-2"></i>More Photos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Car Detail Area */}
      <section className="car-detail-area padding-bottom-90px">
        {/* Navigation Tabs */}
        <div className="single-content-navbar-wrap menu section-bg" id="single-content-navbar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="single-content-nav" id="single-content-nav">
                  <ul>
                    <li>
                      <a
                        href="#description"
                        className={`scroll-link ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                      >
                        Car Details
                      </a>
                    </li>
                    <li>
                      <a
                        href="#faq"
                        className={`scroll-link ${activeTab === 'faq' ? 'active' : ''}`}
                        onClick={() => setActiveTab('faq')}
                      >
                        Faqs
                      </a>
                    </li>
                    <li>
                      <a
                        href="#reviews"
                        className={`scroll-link ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        Reviews
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="single-content-box">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="single-content-wrap padding-top-60px">
                  {/* Car Details Section */}
                  <div id="description" className="page-scroll">
                    <div className="single-content-item pb-4">
                      <h3 className="title font-size-26">
                        {car.brand} {car.model} or Similar
                      </h3>
                      <div className="d-flex align-items-center pt-2">
                        <p className="me-2">{car.location || 'Available Nationwide'}</p>
                        <p>
                          <span className="badge text-bg-warning text-white font-size-16">
                            {car.rating || '4.5'}
                          </span>
                          <span>({car.reviews || '150'} Reviews)</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="section-block"></div>
                    
                    {/* Car Features Grid */}
                    <div className="single-content-item py-4">
                      <div className="row">
                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">Rental Company</h3>
                              <span className="font-size-13">{car.agency_name || 'Premium Car Rental'}</span>
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
                              <span className="font-size-13">{car.category || 'Economy'}</span>
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
                              <span className="font-size-13">{car.brand} {car.model}</span>
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
                              <span className="font-size-13">{car.passengers || '4'}</span>
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
                              <span className="font-size-13">{car.luggage || '2'}</span>
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
                                {[car.air_conditioning && 'A/C', car.bluetooth && 'Bluetooth'].filter(Boolean).join(', ') || 'Available'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="section-block"></div>
                    
                    {/* Car Description */}
                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Car Rental Information</h3>
                      <p className="py-3">
                        {car.description || 'Experience the perfect blend of comfort and performance with this premium vehicle. Ideal for both city driving and longer journeys, offering exceptional fuel efficiency and modern safety features.'}
                      </p>
                      <p>
                        This vehicle comes fully equipped with modern amenities and is maintained to the highest standards. Whether you're traveling for business or leisure, this car provides the reliability and comfort you need for your journey.
                      </p>
                    </div>
                    
                    <div className="section-block"></div>
                  </div>
                  
                  {/* FAQ Section */}
                  <div id="faq" className="page-scroll">
                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Faqs</h3>
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
                                You'll need a valid driver's license, credit card in the main driver's name, and to meet the minimum age requirement (usually 21+). International visitors may need an International Driving Permit.
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
                                The minimum age for car rental is typically 21 years old. Drivers under 25 may be subject to additional young driver fees. Some luxury or specialty vehicles may have higher age requirements.
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
                                Yes, you can make a reservation for someone else, but the main driver must be present at pickup with their valid license and credit card. The booking and driver details must match.
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
                                <span className="ms-3">How do I find the cheapest car hire deal?</span>
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
                                Book in advance, compare different car categories, avoid airport pickup fees when possible, and check for special offers or discount codes. Flexibility with pickup dates can also lead to better rates.
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
                              <h2>{car.rating || '4.5'}<span>/5</span></h2>
                              <p>Excellent</p>
                              <span>Based on {car.reviews || '150'} reviews</span>
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
                                        <div className="progressbar-line" data-percent="90%">
                                          <div className="progressbar-line-item bar-bg-1"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">4.6</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Value for Money</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="85%">
                                          <div className="progressbar-line-item bar-bg-2"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">4.3</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Cleanliness</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="95%">
                                          <div className="progressbar-line-item bar-bg-3"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">4.8</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="col-lg-6">
                                  <div className="progress-item">
                                    <h3 className="progressbar-title">Facilities</h3>
                                    <div className="progressbar-content line-height-20 d-flex align-items-center justify-content-between">
                                      <div className="progressbar-box flex-shrink-0">
                                        <div className="progressbar-line" data-percent="80%">
                                          <div className="progressbar-line-item bar-bg-4"></div>
                                        </div>
                                      </div>
                                      <div className="bar-percent">4.2</div>
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
                  </div>
                </div>
              </div>
              
              {/* Sidebar with Booking Form */}
              <div className="col-lg-4">
                <div className="sidebar single-content-sidebar mb-0">
                  {/* Booking Form Widget */}
                  <div className="sidebar-widget single-content-widget">
                    <div className="sidebar-widget-item">
                      <div className="sidebar-book-title-wrap mb-3">
                        <h3>Book This Car</h3>
                        <p>
                          <span className="text-form">From</span>
                          <span className="text-value ms-2 me-1">
                            {formatCurrency(convertAmount(car.price))}
                            <small className="font-size-15 font-weight-bold ms-1 color-text-3">/day</small>
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="sidebar-widget-item">
                      <div className="contact-form-action">
                        <form onSubmit={handleBookNow}>
                          <div className="input-box">
                            <label className="label-text">Pick-up From</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="pickup_location"
                                value={formData.pickup_location}
                                onChange={handleInputChange}
                                placeholder="Destination, city, or airport"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="input-box">
                            <label className="label-text">Drop-off to</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="dropoff_location"
                                value={formData.dropoff_location}
                                onChange={handleInputChange}
                                placeholder="Different location (optional)"
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
                                name="pickup_date"
                                value={formData.pickup_date}
                                onChange={handleInputChange}
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
                                  name="pickup_time"
                                  value={formData.pickup_time}
                                  onChange={handleInputChange}
                                >
                                  <option value="9:00AM">9:00AM</option>
                                  <option value="10:00AM">10:00AM</option>
                                  <option value="11:00AM">11:00AM</option>
                                  <option value="12:00PM">12:00PM</option>
                                  <option value="1:00PM">1:00PM</option>
                                  <option value="2:00PM">2:00PM</option>
                                  <option value="3:00PM">3:00PM</option>
                                  <option value="4:00PM">4:00PM</option>
                                  <option value="5:00PM">5:00PM</option>
                                  <option value="6:00PM">6:00PM</option>
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
                                name="dropoff_date"
                                value={formData.dropoff_date}
                                onChange={handleInputChange}
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
                                  name="dropoff_time"
                                  value={formData.dropoff_time}
                                  onChange={handleInputChange}
                                >
                                  <option value="9:00AM">9:00AM</option>
                                  <option value="10:00AM">10:00AM</option>
                                  <option value="11:00AM">11:00AM</option>
                                  <option value="12:00PM">12:00PM</option>
                                  <option value="1:00PM">1:00PM</option>
                                  <option value="2:00PM">2:00PM</option>
                                  <option value="3:00PM">3:00PM</option>
                                  <option value="4:00PM">4:00PM</option>
                                  <option value="5:00PM">5:00PM</option>
                                  <option value="6:00PM">6:00PM</option>
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
                                    onClick={() => handlePassengerChange(-1)}
                                    style={{cursor: 'pointer'}}
                                  >
                                    <i className="la la-minus"></i>
                                  </div>
                                  <input 
                                    type="text" 
                                    name="passengers" 
                                    value={formData.passengers} 
                                    readOnly
                                    style={{textAlign: 'center', width: '50px'}}
                                  />
                                  <div 
                                    className="qtyInc"
                                    onClick={() => handlePassengerChange(1)}
                                    style={{cursor: 'pointer'}}
                                  >
                                    <i className="la la-plus"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="btn-box pt-2">
                            <button
                              type="submit"
                              className="theme-btn text-center w-100 mb-2"
                            >
                              <i className="la la-shopping-cart me-2 font-size-18"></i>Book Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    
                    <div className="btn-box pt-2">
                      <a
                        href="#"
                        className="theme-btn text-center w-100 theme-btn-transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="la la-heart-o me-2"></i>Add to Wishlist
                      </a>
                      <div className="d-flex align-items-center justify-content-between pt-2">
                        <a
                          href="#"
                          className="btn theme-btn-hover-gray font-size-15"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="la la-share me-1"></i>Share
                        </a>
                        <p>
                          <i className="la la-eye me-1 font-size-15 color-text-2"></i>
                          {car.views || '1,234'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enquiry Form Widget */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Enquiry Form</h3>
                    <div className="enquiry-forum">
                      <div className="form-box">
                        <div className="form-content">
                          <div className="contact-form-action">
                            <form method="post">
                              <div className="input-box">
                                <label className="label-text">Your Name</label>
                                <div className="form-group">
                                  <span className="la la-user form-icon"></span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    placeholder="Your name"
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
                                    name="email"
                                    placeholder="Email address"
                                  />
                                </div>
                              </div>
                              
                              <div className="input-box">
                                <label className="label-text">Message</label>
                                <div className="form-group">
                                  <span className="la la-pencil form-icon"></span>
                                  <textarea
                                    className="message-control form-control"
                                    name="message"
                                    placeholder="Write message about this car"
                                    rows="4"
                                  ></textarea>
                                </div>
                              </div>
                              
                              <div className="input-box">
                                <div className="form-group">
                                  <div className="custom-checkbox mb-0">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="agreechb"
                                    />
                                    <label htmlFor="agreechb">
                                      I agree with <a href="#">Terms of Service</a> and <a href="#">Privacy Statement</a>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="btn-box">
                                <button type="button" className="theme-btn">
                                  Submit Enquiry
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Why Book With Us Widget */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Why Book With Us?</h3>
                    <div className="sidebar-list">
                      <ul className="list-items">
                        <li>
                          <i className="la la-dollar icon-element me-2"></i>No-hassle best price guarantee
                        </li>
                        <li>
                          <i className="la la-microphone icon-element me-2"></i>Customer care available 24/7
                        </li>
                        <li>
                          <i className="la la-thumbs-up icon-element me-2"></i>Hand-picked Tours & Activities
                        </li>
                        <li>
                          <i className="la la-file-text icon-element me-2"></i>Free Travel Insurance
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Contact Information Widget */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Get a Question?</h3>
                    <p className="font-size-14 line-height-24">
                      Do not hesitate to give us a call. We are an expert team and we are happy to talk to you.
                    </p>
                    <div className="sidebar-list pt-3">
                      <ul className="list-items">
                        <li>
                          <i className="la la-phone icon-element me-2"></i>
                          <a href="tel:+61238093400">+ 61 23 8093 3400</a>
                        </li>
                        <li>
                          <i className="la la-envelope icon-element me-2"></i>
                          <a href="mailto:info@trizen.com">info@trizen.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Agency Information Widget */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Organized by</h3>
                    <div className="author-content">
                      <div className="d-flex">
                        <div className="author-img">
                          <a href="#">
                            <img src="/html-folder/images/team8.jpg" alt="agency logo" />
                          </a>
                        </div>
                        <div className="author-bio">
                          <h4 className="author__title">
                            <a href="#">{car.agency_name || 'Premium Car Rental'}</a>
                          </h4>
                          <span className="author__meta">Member Since 2017</span>
                          <span className="ratings d-flex align-items-center">
                            <i className="la la-star"></i>
                            <i className="la la-star"></i>
                            <i className="la la-star"></i>
                            <i className="la la-star"></i>
                            <i className="la la-star-o"></i>
                            <span className="ms-2">305 Reviews</span>
                          </span>
                          <div className="btn-box pt-3">
                            <a
                              href="#"
                              className="theme-btn theme-btn-small theme-btn-transparent"
                              onClick={(e) => e.preventDefault()}
                            >
                              Ask a Question
                            </a>
                          </div>
                        </div>
                      </div>
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
        <>
          <div className="section-block"></div>
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
                {relatedCars.map((relatedCar) => (
                  <div key={relatedCar.id} className="col-lg-4 responsive-column">
                    <div className="card-item car-card">
                      <div className="card-img">
                        <Link href={`/car-single/${relatedCar.id}`} className="d-block">
                          <img src={relatedCar.image} alt={`${relatedCar.brand} ${relatedCar.model}`} />
                        </Link>
                        {relatedCar.badge && <span className="badge">{relatedCar.badge}</span>}
                        <div className="add-to-wishlist icon-element" title="Save for later">
                          <i className="la la-heart-o"></i>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <p className="card-meta">{relatedCar.category}</p>
                        <h3 className="card-title">
                          <Link href={`/car-single/${relatedCar.id}`}>
                            {relatedCar.brand} {relatedCar.model} or Similar
                          </Link>
                        </h3>
                        
                        <div className="card-rating">
                          <span className="badge bg-primary text-white">{relatedCar.rating}/5</span>
                          <span className="review__text">Average</span>
                          <span className="rating__text">({relatedCar.reviews} Reviews)</span>
                        </div>
                        
                        <div className="card-attributes">
                          <ul className="d-flex align-items-center">
                            <li className="d-flex align-items-center" title="Passengers">
                              <i className="la la-users"></i><span>{relatedCar.passengers}</span>
                            </li>
                            <li className="d-flex align-items-center" title="Luggage">
                              <i className="la la-suitcase"></i><span>{relatedCar.luggage}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="card-price d-flex align-items-center justify-content-between">
                          <p>
                            <span className="price__from">From</span>
                            <span className="price__num">{formatCurrency(convertAmount(relatedCar.price))}</span>
                            <span className="price__text">Per day</span>
                          </p>
                          <Link href={`/car-single/${relatedCar.id}`} className="btn-text">
                            See details<i className="la la-angle-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
      
      <Footer />
    </>
  );
}
