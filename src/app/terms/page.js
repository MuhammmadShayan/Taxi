import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - HOLIKEY',
  description: 'Read our Terms of Service for using the HOLIKEY car rental platform.',
};

export default function TermsPage() {
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
                    <h2 className="sec__title text-white">Terms of Service</h2>
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
                  <h3 className="card-title font-size-24 mb-3">1. Introduction</h3>
                  <p className="card-text mb-4">
                    Welcome to HOLIKEY. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">2. Rental Agreement</h3>
                  <p className="card-text mb-4">
                    When you book a vehicle through HOLIKEY, you are entering into a direct contract with the vehicle supplier. We act as an intermediary to facilitate your booking. The specific terms and conditions of the vehicle supplier will also apply to your rental.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">3. Eligibility</h3>
                  <p className="card-text mb-4">
                    To rent a vehicle, you must be at least 21 years old (age requirements may vary by location and vehicle type), possess a valid driver's license, and provide a valid credit card in your name for the security deposit.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">4. Booking and Cancellation</h3>
                  <p className="card-text mb-4">
                    Bookings are subject to availability. You may cancel your booking free of charge up to 24 hours before the scheduled pick-up time. Cancellations made within 24 hours may incur a fee.
                  </p>

                  <h3 className="card-title font-size-24 mb-3">5. User Responsibilities</h3>
                  <p className="card-text mb-4">
                    You are responsible for providing accurate information during the booking process. You must also ensure that you meet all requirements for renting the vehicle, including having the necessary documents at the time of pick-up.
                  </p>
                  
                  <h3 className="card-title font-size-24 mb-3">6. Limitation of Liability</h3>
                  <p className="card-text mb-4">
                    HOLIKEY is not liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                  </p>
                  
                  <h3 className="card-title font-size-24 mb-3">7. Changes to Terms</h3>
                  <p className="card-text mb-4">
                    We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new terms.
                  </p>
                  
                  <h3 className="card-title font-size-24 mb-3">8. Contact Us</h3>
                  <p className="card-text">
                    If you have any questions about these Terms, please contact us at <a href="mailto:support@holikey.com" className="text-primary">support@holikey.com</a>.
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
