'use client';
import { useState, useEffect } from 'react';

export default function FaqArea() {
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faq-items?limit=8');
        if (response.ok) {
          const data = await response.json();
          setFaqItems(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching FAQ items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section className="faq-area section--padding">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading FAQ...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="faq-area section--padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading text-center">
              <h2 className="sec__title">Frequently Asked Questions</h2>
              <p className="sec__desc">
                Find answers to commonly asked questions about our services
              </p>
            </div>
          </div>
        </div>
        {faqItems.length > 0 && (
          <div className="row padding-top-50px">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                {faqItems.map((faq, index) => (
                  <div key={faq.id || index} className="accordion-item">
                    <h2 className="accordion-header" id={`heading${faq.id || index}`}>
                      <button
                        className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${faq.id || index}`}
                        aria-expanded={index === 0 ? 'true' : 'false'}
                        aria-controls={`collapse${faq.id || index}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse${faq.id || index}`}
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      aria-labelledby={`heading${faq.id || index}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
