'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TourGrid() {
  return (
    <>
      <Header />
      <main>
        <section className="breadcrumb-area bread-bg">
          <div className="breadcrumb-wrap">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title text-white">Tour Grid</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><Link href="/">Home</Link></li>
                      <li>Tour Grid</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="tour-area section--padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 responsive-column">
                <div className="card-item tour-card">
                  <div className="card-img">
                    <img src="/html-folder/images/destination-1.png" alt="tour" className="img-fluid" />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">
                      <Link href="/tour-details">Amazing Paris Tour</Link>
                    </h3>
                    <div className="card-price">
                      <span className="price">$299</span>
                      <span className="price-text">per person</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
