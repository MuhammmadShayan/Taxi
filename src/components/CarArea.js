'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function CarArea() {
  const { t } = useI18n();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  function resolveImage(images) {
    try {
      if (!images) return '/html-folder/images/car-img.png';
      if (Array.isArray(images)) return images[0] || '/html-folder/images/car-img.png';
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed[0] || '/html-folder/images/car-img.png';
      if (typeof parsed === 'string' && parsed) return parsed;
      if (typeof images === 'string' && images) return images;
    } catch (_) {}
    return '/html-folder/images/car-img.png';
  }

  useEffect(() => {
    let isMounted = true;
    fetch('/api/cars')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load cars');
        return data;
      })
      .then((data) => {
        if (isMounted) setCars(data.cars || []);
      })
      .catch((e) => setError(e.message));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="car-area section--padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading text-center">
              <h2 className="sec__title">{t('cars.title')}</h2>
              <p className="sec__desc">
                {t('featured_cars.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <div className="row padding-top-50px">
          {error && (
            <div className="col-12"><p>{error}</p></div>
          )}
          {cars.length === 0 && !error && (
            <div className="col-12"><p>{t('cars.no_cars_found')}</p></div>
          )}
          {cars.map((car) => (
            <div className="col-lg-4 responsive-column" key={car.id}>
              <div className="card-item destination-card destination--card">
                <div className="card-img">
                  <img src={resolveImage(car.images)} alt={`${car.make} ${car.model}`} className="img-fluid" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">
                    <Link href={`/car-single/${car.id}`}>{car.make} {car.model}</Link>
                  </h3>
                  <div className="card-price">
                    <span className="price">${Number(car.price_per_day).toFixed(0)}</span>
                    <span className="price-text">{t('featured_cars.per_day')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
