'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function RewardsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');

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

  const rewardTiers = [
    {
      name: 'Explorer',
      level: 1,
      requirement: '0 - 999 points',
      benefits: ['5% discount on car rentals', 'Free booking modifications', 'Basic customer support'],
      color: '#4a5568'
    },
    {
      name: 'Adventurer',
      level: 2,
      requirement: '1,000 - 4,999 points',
      benefits: ['10% discount on car rentals', 'Free booking modifications', 'Priority customer support', 'Exclusive member deals'],
      color: '#3182ce'
    },
    {
      name: 'Explorer Pro',
      level: 3,
      requirement: '5,000 - 9,999 points',
      benefits: ['15% discount on car rentals', 'Free upgrades (when available)', 'VIP customer support', 'Early access to new features', 'Free cancellations'],
      color: '#805ad5'
    },
    {
      name: 'Elite Traveler',
      level: 4,
      requirement: '10,000+ points',
      benefits: ['20% discount on car rentals', 'Guaranteed free upgrades', 'Dedicated account manager', 'Complimentary insurance upgrades', 'Exclusive events access'],
      color: '#d69e2e'
    }
  ];

  const howToEarn = [
    {
      icon: 'la la-car',
      title: 'Book Car Rentals',
      description: 'Earn 100 points for every $10 spent on car rentals',
      points: '100 pts per $10'
    },
    {
      icon: 'la la-user-plus',
      title: 'Refer Friends',
      description: 'Get 500 points when your referred friend makes their first booking',
      points: '500 pts per referral'
    },
    {
      icon: 'la la-star',
      title: 'Write Reviews',
      description: 'Earn points by writing detailed reviews of your rental experience',
      points: '50 pts per review'
    },
    {
      icon: 'la la-share',
      title: 'Social Sharing',
      description: 'Share your travel experiences on social media and earn points',
      points: '25 pts per share'
    }
  ];

  const redemptions = [
    {
      icon: 'la la-percentage',
      title: 'Rental Discounts',
      description: 'Use points to get discounts on your next car rental',
      cost: '1,000 pts = $10 off'
    },
    {
      icon: 'la la-arrow-up',
      title: 'Free Upgrades',
      description: 'Redeem points for vehicle category upgrades',
      cost: '2,000 pts = Free upgrade'
    },
    {
      icon: 'la la-gift',
      title: 'Travel Accessories',
      description: 'Get travel accessories and rental add-ons',
      cost: '500 pts = GPS rental'
    },
    {
      icon: 'la la-plane',
      title: 'Partner Rewards',
      description: 'Redeem points with our travel partners for flights and hotels',
      cost: 'Varies by partner'
    }
  ];

  return (
    <>
      <Head>
        <title>Kirastay Rewards - Loyalty Program | Earn Points & Save</title>
        <meta name="description" content="Join Kirastay Rewards and earn points on every car rental booking. Enjoy exclusive discounts, free upgrades, and VIP benefits. Sign up for free today!" />
        <meta name="keywords" content="kirastay rewards, loyalty program, car rental points, travel rewards, booking discounts, VIP benefits" />
        <meta property="og:title" content="Kirastay Rewards - Loyalty Program" />
        <meta property="og:description" content="Join Kirastay Rewards and earn points on every car rental booking. Enjoy exclusive discounts and VIP benefits." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/rewards" />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-9">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Kirastay Rewards</h2>
                    <p className="sec__desc text-white">Earn points, unlock benefits, save more</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Programs</li>
                    <li>Rewards</li>
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

      {/* Rewards Overview */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Welcome to Kirastay Rewards</h2>
                <p className="sec__desc">
                  Join our loyalty program and start earning points on every booking. 
                  Unlock exclusive benefits, discounts, and VIP treatment.
                </p>
              </div>
            </div>
          </div>

          {/* Reward Tiers */}
          <div className="row margin-bottom-80px">
            <div className="col-lg-12">
              <h3 className="section-title text-center mb-5">Membership Tiers</h3>
              <div className="row">
                {rewardTiers.map((tier, index) => (
                  <div key={index} className="col-lg-3 responsive-column">
                    <div className="tier-card" style={{ borderColor: tier.color }}>
                      <div className="tier-header" style={{ backgroundColor: tier.color }}>
                        <div className="tier-icon">
                          <i className="la la-trophy"></i>
                        </div>
                        <h4 className="tier-name">{tier.name}</h4>
                        <p className="tier-requirement">{tier.requirement}</p>
                      </div>
                      <div className="tier-body">
                        <ul className="tier-benefits">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx}>
                              <i className="la la-check"></i>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="row">
            <div className="col-lg-12">
              <ul className="nav nav-tabs rewards-tabs" role="tablist">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="la la-info-circle"></i>
                    How It Works
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'earn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('earn')}
                  >
                    <i className="la la-plus"></i>
                    Earn Points
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'redeem' ? 'active' : ''}`}
                    onClick={() => setActiveTab('redeem')}
                  >
                    <i className="la la-gift"></i>
                    Redeem Points
                  </button>
                </li>
              </ul>

              <div className="tab-content rewards-tab-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="tab-pane fade show active">
                    <div className="how-it-works">
                      <div className="row">
                        <div className="col-lg-4 text-center">
                          <div className="step-item">
                            <div className="step-number">1</div>
                            <h4 className="step-title">Sign Up</h4>
                            <p className="step-desc">
                              Create your free Kirastay account and automatically join our rewards program.
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4 text-center">
                          <div className="step-item">
                            <div className="step-number">2</div>
                            <h4 className="step-title">Earn Points</h4>
                            <p className="step-desc">
                              Book car rentals, refer friends, write reviews, and earn points on every activity.
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4 text-center">
                          <div className="step-item">
                            <div className="step-number">3</div>
                            <h4 className="step-title">Enjoy Benefits</h4>
                            <p className="step-desc">
                              Redeem points for discounts, upgrades, and exclusive rewards. Level up for more benefits!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Earn Points Tab */}
                {activeTab === 'earn' && (
                  <div className="tab-pane fade show active">
                    <div className="earn-points">
                      <div className="row">
                        {howToEarn.map((method, index) => (
                          <div key={index} className="col-lg-6 responsive-column">
                            <div className="earn-method">
                              <div className="earn-icon">
                                <i className={method.icon}></i>
                              </div>
                              <div className="earn-content">
                                <h4 className="earn-title">{method.title}</h4>
                                <p className="earn-desc">{method.description}</p>
                                <div className="earn-points">{method.points}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Redeem Points Tab */}
                {activeTab === 'redeem' && (
                  <div className="tab-pane fade show active">
                    <div className="redeem-points">
                      <div className="row">
                        {redemptions.map((redemption, index) => (
                          <div key={index} className="col-lg-6 responsive-column">
                            <div className="redeem-option">
                              <div className="redeem-icon">
                                <i className={redemption.icon}></i>
                              </div>
                              <div className="redeem-content">
                                <h4 className="redeem-title">{redemption.title}</h4>
                                <p className="redeem-desc">{redemption.description}</p>
                                <div className="redeem-cost">{redemption.cost}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="cta-area cta-bg-2 bg-fixed section-padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title mb-3 text-white">Ready to Start Earning Rewards?</h2>
                <p className="sec__desc text-white">
                  Join thousands of travelers who are already earning points and saving money on their car rentals.
                  Sign up for free and start earning rewards today!
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <a href="/register" className="theme-btn border-0 me-3">
                  Join Rewards Program
                </a>
                <a href="/contact?subject=Rewards Program" className="theme-btn theme-btn-white">
                  Learn More
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
        .tier-card {
          border: 2px solid;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
          background: white;
          transition: transform 0.3s ease;
        }
        
        .tier-card:hover {
          transform: translateY(-5px);
        }
        
        .tier-header {
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .tier-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }
        
        .tier-name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .tier-requirement {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .tier-body {
          padding: 30px 20px;
        }
        
        .tier-benefits {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .tier-benefits li {
          padding: 8px 0;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .tier-benefits i {
          color: #38a169;
          font-weight: 600;
        }
        
        .rewards-tabs {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 40px;
          border: 1px solid #e9ecef;
        }
        
        .rewards-tabs .nav-link {
          border: none;
          background: transparent;
          color: #6c757d;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 6px;
          margin: 0 5px;
          transition: all 0.3s ease;
        }
        
        .rewards-tabs .nav-link.active {
          background: #3182ce;
          color: white;
        }
        
        .rewards-tabs .nav-link:hover {
          background: #e9ecef;
          color: #495057;
        }
        
        .rewards-tabs .nav-link.active:hover {
          background: #2c5aa0;
          color: white;
        }
        
        .rewards-tab-content {
          min-height: 400px;
          padding: 40px 0;
        }
        
        .step-item {
          margin-bottom: 40px;
        }
        
        .step-number {
          width: 60px;
          height: 60px;
          background: #3182ce;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          margin: 0 auto 20px;
        }
        
        .step-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .step-desc {
          color: #4a5568;
          line-height: 1.6;
        }
        
        .earn-method, .redeem-option {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: box-shadow 0.3s ease;
        }
        
        .earn-method:hover, .redeem-option:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .earn-icon, .redeem-icon {
          width: 60px;
          height: 60px;
          background: #3182ce;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .earn-content, .redeem-content {
          flex: 1;
        }
        
        .earn-title, .redeem-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .earn-desc, .redeem-desc {
          color: #4a5568;
          margin-bottom: 10px;
        }
        
        .earn-points, .redeem-cost {
          color: #3182ce;
          font-weight: 600;
          font-size: 14px;
        }
        
        .section-title {
          color: #2d3748;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
