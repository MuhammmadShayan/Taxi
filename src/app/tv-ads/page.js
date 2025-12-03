'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function TVAdsPage() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState('recent');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const scripts = [
      '/html-folder/js/jquery-3.7.1.min.js',
      '/html-folder/js/jquery-ui.js',
      '/html-folder/js/bootstrap.bundle.min.js',
      '/html-folder/js/select2.min.js',
      '/html-folder/js/moment.min.js',
      '/html-folder/js/daterangepicker.js',
      '/html-folder/js/owl.carousel.min.js',
      '/html-folder/js/jquery.fancybox.min.js',
      '/html-folder/js/jquery.countTo.min.js',
      '/html-folder/js/animated-headline.js',
      '/html-folder/js/jquery.ripples-min.js',
      '/html-folder/js/quantity-input.js',
      '/html-folder/js/main.js',
    ];

    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    });
  }, []);

  const tvAds = {
    recent: [
      {
        id: 1,
        title: 'Discover Morocco with Kirastay',
        description: 'Experience the magic of Morocco through our travel services',
        duration: '30 seconds',
        campaign: 'Summer 2024',
        thumbnail: '/html-folder/images/img21.jpg',
        videoUrl: '#',
        views: '2.5M',
        releaseDate: '2024-06-15'
      },
      {
        id: 2,
        title: 'Book Your Dream Hotel',
        description: 'Find perfect accommodations for every traveler',
        duration: '45 seconds',
        campaign: 'Hotel Booking Campaign',
        thumbnail: '/html-folder/images/img22.jpg',
        videoUrl: '#',
        views: '1.8M',
        releaseDate: '2024-05-20'
      },
      {
        id: 3,
        title: 'Adventure Awaits',
        description: 'Explore Morocco\'s adventures with our guided tours',
        duration: '60 seconds',
        campaign: 'Adventure Tours',
        thumbnail: '/html-folder/images/img23.jpg',
        videoUrl: '#',
        views: '3.2M',
        releaseDate: '2024-04-10'
      }
    ],
    campaigns: [
      {
        id: 4,
        title: 'Family Travel Made Easy',
        description: 'Creating unforgettable family memories across Morocco',
        duration: '30 seconds',
        campaign: 'Family Travel 2024',
        thumbnail: '/html-folder/images/img24.jpg',
        videoUrl: '#',
        views: '1.5M',
        releaseDate: '2024-03-12'
      },
      {
        id: 5,
        title: 'Business Travel Solutions',
        description: 'Efficient travel solutions for business professionals',
        duration: '25 seconds',
        campaign: 'Corporate Travel',
        thumbnail: '/html-folder/images/img25.jpg',
        videoUrl: '#',
        views: '890K',
        releaseDate: '2024-02-08'
      }
    ],
    awards: [
      {
        id: 6,
        title: 'Best Travel Platform 2024',
        description: 'Celebrating our award-winning travel services',
        duration: '40 seconds',
        campaign: 'Awards Recognition',
        thumbnail: '/html-folder/images/img26.jpg',
        videoUrl: '#',
        views: '1.2M',
        releaseDate: '2024-01-15'
      }
    ]
  };

  const adStats = [
    { number: '50+', label: 'TV Commercials', icon: 'la la-tv' },
    { number: '15M+', label: 'Total Views', icon: 'la la-eye' },
    { number: '25', label: 'Awards Won', icon: 'la la-trophy' },
    { number: '12', label: 'Countries Aired', icon: 'la la-globe' }
  ];

  const handleVideoPlay = (ad) => {
    setSelectedVideo(ad);
    // In a real implementation, this would open a video player modal
    alert(`Playing: ${ad.title}\nThis would open the video player in a real implementation.`);
  };

  return (
    <>
      <Head>
        <title>TV Advertisements - Kirastay Marketing Campaigns | Kirastay</title>
        <meta name="description" content="Watch Kirastay's TV advertisements and marketing campaigns. Discover our award-winning commercials showcasing Morocco travel, hotels, and tourism services." />
        <meta name="keywords" content="TV ads, commercials, marketing campaigns, Kirastay advertisements, Morocco tourism ads, travel commercials" />
        <meta property="og:title" content="TV Advertisements - Kirastay Marketing Campaigns | Kirastay" />
        <meta property="og:description" content="Watch our award-winning TV advertisements and marketing campaigns showcasing Morocco travel services." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/tv-ads" />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-11">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">TV Advertisements</h2>
                    <p className="sec__desc text-white">Our marketing campaigns and commercials</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Media</li>
                    <li>TV Ads</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bread-svg-box">
          <svg className="bread-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
            <polygon points="100 0 50 10 0 0 0 10 100 10"></polygon>
          </svg>
        </div>
      </section>

      {/* Ad Statistics */}
      <section className="funfact-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Our Advertising Impact</h2>
                <p className="sec__desc">
                  Showcasing Morocco's beauty and our services through compelling television advertising.
                </p>
              </div>
            </div>
          </div>
          <div className="row text-center">
            {adStats.map((stat, index) => (
              <div key={index} className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2">
                  <div className="counter-icon">
                    <i className={stat.icon}></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter-num count-symbol" data-toggle="counter-up">
                        {stat.number}
                      </span>
                    </div>
                    <p className="counter-text">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TV Ads Gallery */}
      <section className="gallery-area padding-top-100px padding-bottom-90px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Watch Our TV Commercials</h2>
                <p className="sec__desc">
                  Browse our collection of award-winning television advertisements.
                </p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-shared">
                <ul className="nav nav-tabs justify-content-center" role="tablist">
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeCategory === 'recent' ? 'active' : ''}`}
                      onClick={() => setActiveCategory('recent')}
                      role="tab"
                    >
                      <i className="la la-clock"></i>
                      Recent Ads
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeCategory === 'campaigns' ? 'active' : ''}`}
                      onClick={() => setActiveCategory('campaigns')}
                      role="tab"
                    >
                      <i className="la la-bullhorn"></i>
                      Campaigns
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeCategory === 'awards' ? 'active' : ''}`}
                      onClick={() => setActiveCategory('awards')}
                      role="tab"
                    >
                      <i className="la la-award"></i>
                      Award Winners
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ads Grid */}
          <div className="row margin-top-50px">
            {tvAds[activeCategory]?.map((ad) => (
              <div key={ad.id} className="col-lg-4 responsive-column">
                <div className="card-item ad-card">
                  <div className="card-img">
                    <div className="video-thumbnail" onClick={() => handleVideoPlay(ad)}>
                      <img 
                        src={ad.thumbnail} 
                        alt={ad.title}
                        className="ad-thumbnail"
                      />
                      <div className="play-btn">
                        <i className="la la-play"></i>
                      </div>
                      <div className="duration-label">{ad.duration}</div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">
                      <a href="#" onClick={() => handleVideoPlay(ad)}>{ad.title}</a>
                    </h3>
                    <p className="card-meta">
                      <i className="la la-calendar"></i>
                      {new Date(ad.releaseDate).toLocaleDateString()}
                    </p>
                    <p className="ad-description">{ad.description}</p>
                    
                    <div className="ad-stats">
                      <div className="stat-item">
                        <i className="la la-eye"></i>
                        <span>{ad.views} views</span>
                      </div>
                      <div className="stat-item">
                        <i className="la la-tag"></i>
                        <span>{ad.campaign}</span>
                      </div>
                    </div>

                    <div className="btn-box margin-top-20px">
                      <button 
                        className="theme-btn theme-btn-small w-100"
                        onClick={() => handleVideoPlay(ad)}
                      >
                        <i className="la la-play"></i>
                        Watch Commercial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="about-area padding-top-100px padding-bottom-90px">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-heading margin-bottom-40px">
                  <h2 className="sec__title">Behind Our Campaigns</h2>
                  <p className="sec__desc">
                    Our advertising campaigns are crafted to showcase the authentic beauty 
                    of Morocco and the exceptional service that Kirastay provides to travelers.
                  </p>
                </div>
                <div className="about-list-item">
                  <div className="info-list">
                    <ul className="list-items">
                      <li><i className="la la-check"></i>Award-winning creative team</li>
                      <li><i className="la la-check"></i>Authentic Moroccan locations</li>
                      <li><i className="la la-check"></i>Professional cinematography</li>
                      <li><i className="la la-check"></i>Multilingual campaigns</li>
                      <li><i className="la la-check"></i>Cultural authenticity</li>
                    </ul>
                  </div>
                </div>
                <div className="btn-box margin-top-35px">
                  <a href="/advertising" className="theme-btn">
                    Advertise With Us
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="image-box">
                <img 
                  src="/html-folder/images/img21.jpg" 
                  alt="Behind the scenes of Kirastay TV production"
                  className="about-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Team */}
      <section className="team-area section-bg padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Our Creative Team</h2>
                <p className="sec__desc">
                  Meet the talented professionals behind our advertising campaigns.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 responsive-column">
              <div className="team-item text-center">
                <div className="team-img">
                  <img src="/html-folder/images/team1.jpg" alt="Creative Director" />
                </div>
                <div className="team-body">
                  <h3 className="team-title">Sarah Martinez</h3>
                  <span className="team-meta">Creative Director</span>
                  <p className="team-text">
                    Leading our creative vision with 15+ years in advertising and travel marketing.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="team-item text-center">
                <div className="team-img">
                  <img src="/html-folder/images/team2.jpg" alt="Video Producer" />
                </div>
                <div className="team-body">
                  <h3 className="team-title">Ahmed Benali</h3>
                  <span className="team-meta">Video Producer</span>
                  <p className="team-text">
                    Capturing Morocco's beauty through cinematic storytelling and visual excellence.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="team-item text-center">
                <div className="team-img">
                  <img src="/html-folder/images/team3.jpg" alt="Brand Manager" />
                </div>
                <div className="team-body">
                  <h3 className="team-title">Lisa Chen</h3>
                  <span className="team-meta">Brand Manager</span>
                  <p className="team-text">
                    Ensuring brand consistency across all our advertising campaigns and media.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="testimonial-area padding-top-100px padding-bottom-90px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Awards & Recognition</h2>
                <p className="sec__desc">
                  Our advertising campaigns have been recognized by industry professionals.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="award-item text-center">
                <div className="award-icon">
                  <i className="la la-trophy"></i>
                </div>
                <h4 className="award-title">Best Travel Commercial</h4>
                <p className="award-desc">Morocco Tourism Awards 2024</p>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="award-item text-center">
                <div className="award-icon">
                  <i className="la la-star"></i>
                </div>
                <h4 className="award-title">Creative Excellence</h4>
                <p className="award-desc">International Ad Festival 2024</p>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="award-item text-center">
                <div className="award-icon">
                  <i className="la la-medal"></i>
                </div>
                <h4 className="award-title">People's Choice</h4>
                <p className="award-desc">Travel Marketing Awards 2023</p>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="award-item text-center">
                <div className="award-icon">
                  <i className="la la-certificate"></i>
                </div>
                <h4 className="award-title">Brand Campaign</h4>
                <p className="award-desc">Digital Marketing Excellence 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Kit Download */}
      <section className="cta-area section-bg-2 padding-top-100px padding-bottom-100px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="section-heading">
                <h2 className="sec__title text-white mb-3">Media Kit & Press Resources</h2>
                <p className="sec__desc text-white">
                  Download our media kit for high-resolution logos, brand guidelines, 
                  and press materials for media coverage and partnerships.
                </p>
              </div>
              <div className="btn-box margin-top-40px">
                <a href="/media-kit.zip" className="theme-btn border-0 me-3" download>
                  <i className="la la-download"></i>
                  Download Media Kit
                </a>
                <a href="/contact?subject=Media Inquiry" className="theme-btn theme-btn-white">
                  Media Inquiries
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>
      
      <SignupModal />
      <LoginModal />

      <style jsx>{`
        .ad-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .ad-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .video-thumbnail {
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }
        
        .ad-thumbnail {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .video-thumbnail:hover .ad-thumbnail {
          transform: scale(1.05);
        }
        
        .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #3182ce;
          transition: all 0.3s ease;
        }
        
        .video-thumbnail:hover .play-btn {
          background: white;
          transform: translate(-50%, -50%) scale(1.1);
        }
        
        .duration-label {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .ad-description {
          color: #4a5568;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .ad-stats {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          padding: 10px;
          background: #f7fafc;
          border-radius: 6px;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #4a5568;
        }
        
        .stat-item i {
          margin-right: 5px;
          color: #3182ce;
        }
        
        .counter-item {
          margin-bottom: 30px;
        }
        
        .counter-icon {
          font-size: 48px;
          color: #3182ce;
          margin-bottom: 20px;
        }
        
        .counter-num {
          font-size: 36px;
          font-weight: 700;
          color: #2d3748;
        }
        
        .counter-text {
          color: #4a5568;
          font-weight: 500;
          margin-top: 10px;
        }
        
        .award-item {
          margin-bottom: 40px;
          padding: 30px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .award-item:hover {
          transform: translateY(-5px);
        }
        
        .award-icon {
          font-size: 48px;
          color: #f6ad55;
          margin-bottom: 20px;
        }
        
        .award-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .award-desc {
          color: #718096;
          font-size: 14px;
        }
        
        .nav-link {
          color: #4a5568;
          border: none;
          border-bottom: 3px solid transparent;
          background: none;
          padding: 15px 25px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .nav-link.active {
          color: #3182ce;
          border-bottom-color: #3182ce;
          background: none;
        }
        
        .nav-link:hover {
          color: #3182ce;
          background: none;
        }
        
        .about-img {
          width: 100%;
          border-radius: 12px;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
