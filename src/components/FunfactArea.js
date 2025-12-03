'use client';
import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function FunfactArea() {
  const { t } = useI18n();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/site-statistics');
        if (response.ok) {
          const data = await response.json();
          setStats(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching site statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="funfact-area padding-top-100px">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading statistics...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
     <section className="funfact-area padding-top-100px">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading text-center">
              <h2 className="sec__title">
                {t('stats.title')}
              </h2>
              <p className="sec__desc pt-3">
                {t('stats.subtitle')}
              </p>
            </div>
            
          </div>
          
        </div>
        
        <div className="counter-box mt-5 pb-2">
          <div className="row">
            {stats.map((stat, index) => {
              // Calculate column size based on number of stats
              const colClass = stats.length <= 4 ? `col-lg-${12 / stats.length}` : 'col-lg-3';
              return (
                <div key={stat.id || index} className={`${colClass} responsive-column`}>
                  <div className="counter-item d-flex">
                    <div className="counter-icon flex-shrink-0">
                      <i className={stat.icon || 'la la-star'}></i>
                    </div>
                    <div className="counter-content">
                      <span
                        className="counter"
                        data-from="0"
                        data-to={stat.value}
                        data-refresh-interval="5"
                      >
                        {stat.value}
                      </span>
                      {stat.symbol && (
                        <span className="count-symbol">{stat.symbol}</span>
                      )}
                      <p className="counter__title">{stat.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
      
    </section>
  );
}
