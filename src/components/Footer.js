'use client';
import Link from 'next/link';
import { useI18n } from '../i18n/I18nProvider';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
   <section className="footer-area bg-white padding-top-90px padding-bottom-30px">
  <div className="container">
    <div className="row">
      <div className="col-lg-3 responsive-column">
        <div className="footer-item">
          <div className="footer-logo padding-bottom-30px">
            <a href="index.html" className="foot__logo"><img src="/html-folder/images/logo.png" alt="logo" /></a>
          </div>
          {/* end logo */}
          <p className="footer__desc">
            {t('footer.desc')}
          </p>
          <ul className="list-items pt-3">
            <li>
              3015 Grand Ave, Coconut Grove,<br />
              Cerrick Way, FL 12345
            </li>
            <li>+123-456-789</li>
            <li><a href="#">support@kirastay.com</a></li>
          </ul>
        </div>
        {/* end footer-item */}
      </div>
      {/* end col-lg-3 */}
      <div className="col-lg-3 responsive-column">
        <div className="footer-item">
          <h4 className="title curve-shape pb-3 margin-bottom-20px" data-text="curvs">
            {t('footer.company')}
          </h4>
          <ul className="list-items list--items">
            <li><Link href="/about">{t('footer.about_us')}</Link></li>
            <li><Link href="/service">{t('footer.services')}</Link></li>
            <li><Link href="/jobs">{t('footer.jobs')}</Link></li>
            <li><Link href="/support">{t('footer.support')}</Link></li>
            <li><Link href="/advertising">{t('footer.advertising')}</Link></li>
          </ul>
        </div>
        {/* end footer-item */}
      </div>
      {/* end col-lg-3 */}
      <div className="col-lg-3 responsive-column">
        <div className="footer-item">
          <h4 className="title curve-shape pb-3 margin-bottom-20px" data-text="curvs">
            {t('footer.other_services')}
          </h4>
          <ul className="list-items list--items">
            <li><Link href="/investor-relations">{t('footer.investor_relations')}</Link></li>
            <li><Link href="/rewards">{t('footer.rewards')}</Link></li>
            <li><Link href="/partners">{t('footer.partners')}</Link></li>
            <li><Link href="/list-hotel">{t('footer.list_hotel')}</Link></li>
            <li><Link href="/hotels">{t('footer.all_hotels')}</Link></li>
            <li><Link href="/tv-ads">{t('footer.tv_ads')}</Link></li>
          </ul>
        </div>
        {/* end footer-item */}
      </div>
      {/* end col-lg-3 */}
      <div className="col-lg-3 responsive-column">
        <div className="footer-item">
          <h4 className="title curve-shape pb-3 margin-bottom-20px" data-text="curvs">
            {t('footer.other_links')}
          </h4>
          <ul className="list-items list--items">
            <li><Link href="/vacation-packages">{t('footer.vacation_packages')}</Link></li>
            <li><Link href="/flights">{t('footer.flights')}</Link></li>
            <li><Link href="/hotels">{t('footer.hotels')}</Link></li>
            <li><Link href="/car-hire">{t('footer.car_hire')}</Link></li>
            <li><Link href="/register">{t('footer.create_account')}</Link></li>
            <li><Link href="/reviews">{t('footer.reviews')}</Link></li>
          </ul>
        </div>
        {/* end footer-item */}
      </div>
      {/* end col-lg-3 */}
    </div>
    {/* end row */}
    <div className="section-block" />
    <div className="row align-items-center">
      <div className="col-lg-7">
        <div className="copy-right padding-top-30px">
          <p className="copy__desc">
            {t('footer.copyright', { year })}
            <span className="la la-heart" /> {t('footer.by')} 
            <a href="#">SmartestDevelopers</a>
          </p>
        </div>
        {/* end copy-right */}
      </div>
      {/* end col-lg-7 */}
      <div className="col-lg-5">
        <div className="footer-social-box padding-top-30px text-end">
          <ul className="social-profile">
            <li>
              <a href="#"><i className="lab la-facebook-f" /></a>
            </li>
            <li>
              <a href="#"><i className="lab la-twitter" /></a>
            </li>
            <li>
              <a href="#"><i className="lab la-instagram" /></a>
            </li>
            <li>
              <a href="#"><i className="lab la-linkedin-in" /></a>
            </li>
          </ul>
        </div>
        {/* end copy-right-content */}
      </div>
      {/* end col-lg-5 */}
    </div>
    {/* end row */}
  </div>
  {/* end container */}
</section>

  );
}
