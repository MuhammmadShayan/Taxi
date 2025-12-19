import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { I18nProvider } from '../i18n/I18nProvider';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import Script from 'next/script';
import GooglePlacesScript from '../components/GooglePlacesScript';

export const metadata = {
  title: 'KIRASTAY - Multi-vendor Vehicle Rental Platform',
  description: 'KIRASTAY connects Moroccan vehicle rental agencies with global customers. Search, book, and rent vehicles with trusted local partners.',
  keywords: ['vehicle rental','car rental','Morocco','booking platform','KIRASTAY','multi-vendor','travel']
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" href="/html-folder/images/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
        <Script id="metamask-guard" strategy="beforeInteractive">
          {`(()=>{if(typeof window==='undefined')return;function m(e){try{const a=(e&&(e.message||e.error&&e.error.message||''))||'';const s=(e&&(e.filename||e.error&&e.error.stack||''))||'';const k=e&&e.error&&e.error.stack||'';return /MetaMask|ethereum|inpage\.js/i.test(a)||/inpage\.js/i.test(s)||/nkbihfbeogaeaoehlefnkodbefgpgknn/i.test(k)}catch{return false}}window.addEventListener('error',function(e){if(m(e)){e.preventDefault();return false}},true);window.addEventListener('unhandledrejection',function(e){const r=e&&e.reason;const msg=typeof r==='string'?r:r&&r.message||'';const st=r&&r.stack||'';if(/MetaMask|ethereum|inpage\.js|nkbihfbeogaeaoehlefnkodbefgpgknn/i.test(msg+' '+st)){e.preventDefault();return false}});})()`}
        </Script>
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/html-folder/css/daterangepicker.css" />
        <link rel="stylesheet" href="/html-folder/css/animate.min.css" />
        <link rel="stylesheet" href="/html-folder/css/animated-headline.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery-ui.css" />
        <link rel="stylesheet" href="/html-folder/css/flag-icon.min.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery.autocomplete.css" />
        <link rel="stylesheet" href="/html-folder/css/leaflet.css" />
        <link rel="stylesheet" href="/html-folder/css/leaflet-routing-machine.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <I18nProvider>
          <CurrencyProvider>
            <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
          </CurrencyProvider>
          <GooglePlacesScript />
        </I18nProvider>
        
        {/* Essential JavaScript files loaded in proper order to prevent conflicts */}
        <script src="/html-folder/js/jquery-3.7.1.min.js"></script>
        <script src="/js/prevent-select2-react.js"></script>
        <script src="/html-folder/js/bootstrap.bundle.min.js"></script>
        <script src="/html-folder/js/owl.carousel.min.js"></script>
        <script src="/html-folder/js/jquery.fancybox.min.js"></script>
        <script src="/html-folder/js/daterangepicker.js"></script>
        <script src="/html-folder/js/jquery-ui.js"></script>
        <script src="/html-folder/js/select2.min.js"></script>
        <script src="/html-folder/js/main-safe.js"></script>
        <script src="/html-folder/js/dashboard.js"></script>
        <script src="/html-folder/js/chart.js"></script>
        <script src="/html-folder/js/line-chart.js"></script>
        <script src="/html-folder/js/bar-chart.js"></script>
        <script src="/html-folder/js/jquery.sparkline.js"></script>
      </body>
    </html>
  );
}

