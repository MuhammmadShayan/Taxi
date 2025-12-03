'use client';
import Link from 'next/link';
import { useI18n } from '../i18n/I18nProvider';

export default function Breadcrumb({ title, subtitle, breadcrumbItems = [] }) {
  const { t } = useI18n();

  return (
    <section className="breadcrumb-area bread-bg-8">
      <div className="breadcrumb-wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="breadcrumb-content">
                <div className="section-heading">
                  <h2 className="sec__title text-white">{title}</h2>
                  {subtitle && <p className="sec__desc text-white">{subtitle}</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="breadcrumb-list text-end">
                <ul className="list-items">
                  <li><Link href="/">{t('nav.home')}</Link></li>
                  {breadcrumbItems.map((item, index) => (
                    <li key={index}>
                      {item.href ? (
                        <Link href={item.href}>{item.label}</Link>
                      ) : (
                        item.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bread-svg-box">
        <svg
          className="bread-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
        >
          <polygon points="100 0 50 10 0 0 0 10 100 10"></polygon>
        </svg>
      </div>
    </section>
  );
}
