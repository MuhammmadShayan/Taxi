'use client';
import Link from 'next/link';
import { useI18n } from '../i18n/I18nProvider';
import SubscribeForm from './SubscribeForm';

export default function CtaArea() {
  const { t } = useI18n();
  return (
    <section className="cta-area subscriber-area section-bg-2 padding-top-60px padding-bottom-60px">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="section-heading">
              <h2 className="sec__title font-size-30 text-white">
                {t('cta.subscribe_title')}
              </h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="subscriber-box">
              <div className="contact-form-action">
                <SubscribeForm
                  label={t('cta.email_address')}
                  placeholder={t('cta.email_placeholder')}
                  buttonText={t('cta.subscribe_now')}
                  // No disclaimer in CTA area per current design
                  disclaimer={null}
                  className="contact-form-style-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
