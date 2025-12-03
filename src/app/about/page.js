'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function AboutPage() {
  const { t } = useI18n();
  const [teamMembers, setTeamMembers] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dynamic data
    const fetchData = async () => {
      try {
        const [teamResponse, aboutResponse, statsResponse] = await Promise.all([
          fetch('/api/team-members'),
          fetch('/api/about-sections'),
          fetch('/api/site-statistics')
        ]);

        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(teamData.data || []);
        }

        if (aboutResponse.ok) {
          const aboutData = await aboutResponse.json();
          setAboutSections(aboutData.data || []);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading content...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t('about.title')}</title>
<meta name="description" content={t('about.meta_desc')} />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-9">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title line-height-50 text-white" dangerouslySetInnerHTML={{ __html: t('about.hero_title') }} />
                  </div>
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

      {/* Info Cards Area */}
      <section className="info-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            {aboutSections.filter(section => ['who_we_are', 'what_we_do', 'our_mission'].includes(section.section_type)).map((section, index) => (
              <div key={section.id || index} className="col-lg-4 responsive-column">
                <div className="card-item">
                  <div className="card-img">
                    <img src={section.image || '/html-folder/images/img21.jpg'} alt="about-img" />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title mb-2">{section.title}</h3>
                    <p className="card-text">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Area */}
      <section className="about-area padding-bottom-90px overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading margin-bottom-40px">
                <h2 className="sec__title">{t('about.about_us')}</h2>
                <h4 className="title font-size-16 line-height-26 pt-4 pb-2">
                  {t('about.since')}
                </h4>
                <p className="sec__desc font-size-16 pb-3">
                  {t('about.p1')}
                </p>
                <p className="sec__desc font-size-16 pb-3">
                  {t('about.p2')}
                </p>
                <p className="sec__desc font-size-16">
                  {t('about.p3')}
                </p>
              </div>
            </div>
            <div className="col-lg-5 ms-auto">
              <div className="image-box about-img-box">
                <img src="/html-folder/images/img24.jpg" alt="about-img" className="img__item img__item-1" />
                <img src="/html-folder/images/img25.jpg" alt="about-img" className="img__item img__item-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Area */}
      <section className="funfact-area padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">{t('about.numbers_title')}</h2>
              </div>
            </div>
          </div>
          <div className="counter-box counter-box-2 margin-top-60px mb-0">
            <div className="row">
              {stats.map((stat, index) => (
                <div key={stat.id || index} className="col-lg-3 responsive-column">
                  <div className="counter-item counter-item-layout-2 d-flex">
                    <div className="counter-icon flex-shrink-0">
                      <i className={stat.icon}></i>
                    </div>
                    <div className="counter-content">
                      <div>
                        <span className="counter" data-from="0" data-to={stat.value} data-refresh-interval="5">
                          {stat.value}
                        </span>
                        <span className="count-symbol">{stat.symbol}</span>
                      </div>
                      <p className="counter__title">{stat.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="info-area padding-top-100px padding-bottom-60px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title">{t('about.team_title')}</h2>
              </div>
            </div>
          </div>
          <div className="row padding-top-100px">
            {teamMembers.map((member, index) => (
              <div key={member.id || index} className="col-lg-4 responsive-column">
                <div className="card-item team-card">
                  <div className="card-img">
                    <img src={member.image || '/html-folder/images/team1.jpg'} alt="team-img" />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{member.name}</h3>
                    <p className="card-meta">{member.position}</p>
                    <p className="card-text font-size-15 pt-2">
                      {member.description}
                    </p>
                    <ul className="social-profile padding-top-20px pb-2">
                      {member.social_facebook && (
                        <li>
                          <a href={member.social_facebook} target="_blank" rel="noopener noreferrer">
                            <i className="lab la-facebook-f"></i>
                          </a>
                        </li>
                      )}
                      {member.social_twitter && (
                        <li>
                          <a href={member.social_twitter} target="_blank" rel="noopener noreferrer">
                            <i className="lab la-twitter"></i>
                          </a>
                        </li>
                      )}
                      {member.social_instagram && (
                        <li>
                          <a href={member.social_instagram} target="_blank" rel="noopener noreferrer">
                            <i className="lab la-instagram"></i>
                          </a>
                        </li>
                      )}
                      {member.social_linkedin && (
                        <li>
                          <a href={member.social_linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="lab la-linkedin-in"></i>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Area */}
      <section className="cta-area cta-bg-2 bg-fixed section-padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title mb-3 text-white" dangerouslySetInnerHTML={{ __html: t('about.cta_title') }} />
                <p className="sec__desc text-white" dangerouslySetInnerHTML={{ __html: t('about.cta_desc') }} />
              </div>
              <div className="btn-box padding-top-35px">
                <a href="#" className="theme-btn border-0">{t('about.cta_btn')}</a>
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
    </>
  );
}

