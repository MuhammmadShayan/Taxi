'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoginModal from '../../components/LoginModal';
import SignupModal from '../../components/SignupModal';

const DESTINATIONS = [
  { name: 'Casablanca', image: '/html-folder/images/destination-img2.jpg', region: 'Atlantic Coast', info: 'Modern city with Hassan II Mosque and seaside Corniche.' },
  { name: 'Marrakech', image: '/html-folder/images/destination-img3.jpg', region: 'High Atlas', info: 'Historic medina, Jemaa el-Fnaa, gardens, and riads.' },
  { name: 'Fes', image: '/html-folder/images/destination-img4.jpg', region: 'Middle Atlas', info: 'Ancient tanneries, labyrinth of alleys, and madrasas.' },
  { name: 'Rabat', image: '/html-folder/images/destination-img5.jpg', region: 'Capital', info: 'Oudayas Kasbah, Hassan Tower, and clean beaches.' },
  { name: 'Tangier', image: '/html-folder/images/destination-img6.jpg', region: 'Strait of Gibraltar', info: 'Port city with international vibe and coastal views.' },
  { name: 'Agadir', image: '/html-folder/images/destination-img7.jpg', region: 'South Coast', info: 'Beach resort with long promenade and surf spots.' },
  { name: 'Chefchaouen', image: '/html-folder/images/destination-img8.jpg', region: 'Rif Mountains', info: 'Blue city with picturesque alleys and hiking trails.' },
  { name: 'Essaouira', image: '/html-folder/images/img22.jpg', region: 'Atlantic Coast', info: 'Fortified town, arts scene, and windsurfing.' },
  { name: 'Ouarzazate', image: '/html-folder/images/img29.jpg', region: 'Gateway to Sahara', info: 'Film studios, kasbahs, and desert excursions.' },
  { name: 'Meknes', image: '/html-folder/images/img20.jpg', region: 'Imperial City', info: 'Bab Mansour gate and historic granaries.' },
  { name: 'Ifrane', image: '/html-folder/images/img19.jpg', region: 'Middle Atlas', info: 'Swiss-style town with cedar forests and lakes.' },
  { name: 'Dakhla', image: '/html-folder/images/img25.jpg', region: 'Western Sahara', info: 'Lagoon paradise for kitesurfing and eco-lodges.' }
];

export default function DestinationsPage() {
  const today = new Date();
  const start = new Date(today.getTime() + 86400000);
  const end = new Date(today.getTime() + 86400000 * 3);
  const fmt = (d) => d.toISOString().split('T')[0];

  return (
    <>
      <Header />

      <section className="breadcrumb-area bread-bg-8">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Top Destinations</h2>
                    <p className="text-white-50 pt-2">Discover Morocco’s most loved cities and routes</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><Link href="/" className="text-white">Home</Link></li>
                    <li className="text-white">Destinations</li>
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

      <section className="destination-area section--padding">
        <div className="container">
          <div className="row align-items-center mb-3">
            <div className="col-lg-8">
              <div className="section-heading">
                <h2 className="sec__title">Explore and plan your next trip</h2>
                <p className="sec__desc pt-2">Browse curated destinations with images and essential info</p>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <Link href="/search" className="theme-btn">
                Search Cars <i className="la la-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>

          <div className="row destination-grid">
            {DESTINATIONS.map((d, idx) => (
              <div key={idx} className="col-xl-3 col-lg-4 col-md-6 mb-4 responsive-column">
                <div className="card-item destination-card destination--card destination-elevated h-100">
                  <div className="card-img destination-thumb" role="img" aria-label={`${d.name} – ${d.region}`}>
                    <img src={d.image} alt={d.name} loading="lazy" />
                    <div className="destination-badge">{d.region}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title destination-heading">
                      <span className="destination-title">{d.name}</span>
                    </h3>
                    <p className="destination-info">{d.info}</p>
                    <div className="d-flex justify-content-end">
                      <Link
                        href={`/search?pickup_location=${encodeURIComponent(d.name)}&start_date=${fmt(start)}&end_date=${fmt(end)}&pickup_time=9:00AM&dropoff_time=9:00AM`}
                        className="theme-btn theme-btn-small border-0"
                        aria-label={`Explore cars in ${d.name}`}
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

      <Footer />

      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>

      <LoginModal />
      <SignupModal />

      <style jsx>{`
        .destination-grid .destination-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }
        .destination-elevated {
          transition: transform .25s ease, box-shadow .25s ease;
          box-shadow: 0 6px 18px rgba(0,0,0,.06);
        }
        .destination-elevated:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(0,0,0,.1);
        }
        .destination-thumb {
          position: relative;
        }
        .destination-thumb img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }
        .destination-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: rgba(255,255,255,.9);
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
        }
        .destination-card .card-body {
          position: static;
          padding: 16px;
          background: #fff;
        }
        .destination-heading { margin: 0 0 6px; }
        .destination-title {
          display: inline-block;
          font-weight: 700;
          font-size: 18px;
          line-height: 1.4;
          color: #0d233e;
        }
        .destination-info {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
        }
      `}</style>
    </>
  );
}
