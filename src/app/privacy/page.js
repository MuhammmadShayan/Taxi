import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - HOLIKEY',
  description: 'Read our Privacy Policy to understand how HOLIKEY collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <section className="breadcrumb-area bread-bg-7">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-content text-center">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Privacy Policy</h2>
                  </div>
                  <span className="arrow-blink">
                    <i className="la la-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-area padding-top-100px padding-bottom-60px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="card-item card-item-list-2">
                <div className="card-body">
                  <h3 className="card-title font-size-24 mb-3">1. Information We Collect</h3>
                  <p className="card-text mb-4">
                    We collect information you provide directly to us, such as when you create an account, make a booking, or contact customer support. This may include your name, email address, phone number, payment information, and driver's license details.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">2. How We Use Your Information</h3>
                  <p className="card-text mb-4">
                    We use the information we collect to facilitate your vehicle bookings, process payments, communicate with you about your reservations, and improve our services. We may also use your information to send you marketing communications if you have opted in.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">3. Information Sharing</h3>
                  <p className="card-text mb-4">
                    We share your information with vehicle suppliers to fulfill your bookings. We may also share information with third-party service providers who perform services on our behalf, such as payment processing and data analysis. We do not sell your personal information to third parties.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">4. Data Security</h3>
                  <p className="card-text mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">5. Your Rights</h3>
                  <p className="card-text mb-4">
                    You have the right to access, correct, or delete your personal information. You may also object to the processing of your data or request a copy of your data. To exercise these rights, please contact us.
                  </p>
                  
                  <h3 className="card-title font-size-24 mb-3">6. Cookies</h3>
                  <p className="card-text mb-4">
                    We use cookies and similar technologies to analyze traffic, administer the website, and track users' movements around the site. You can control the use of cookies at the individual browser level.
                  </p>
                  
                  <h3 className="card-title font-size-24 mb-3">7. Contact Us</h3>
                  <p className="card-text">
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@holikey.com" className="text-primary">privacy@holikey.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
