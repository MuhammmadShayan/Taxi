'use client';

export default function ClientLogoArea() {
  return (
     <section
      className="clientlogo-area position-relative section-bg padding-top-140px padding-bottom-150px text-center"
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading text-center">
              <h2 className="sec__title">Big Brands, Big Discounts!</h2>
            </div>
            
          </div>
          
        </div>
        
        <div className="row padding-top-20px">
          <div className="col-lg-8 mx-auto">
            <div className="client-logo">
              <div className="client-logo-item client-logo-item-2">
                <img src="html-folder/images/alamo.png" alt="brand image" />
              </div>
              
              <div className="client-logo-item client-logo-item-2">
                <img src="html-folder/images/europcar.png" alt="brand image" />
              </div>
              
              <div className="client-logo-item client-logo-item-2">
                <img src="html-folder/images/hertz.png" alt="brand image" />
              </div>
              
              <div className="client-logo-item client-logo-item-2">
                <img src="html-folder/images/national.png" alt="brand image" />
              </div>
              <div className="client-logo-item client-logo-item-2">
                <img src="html-folder/images/thrifty.png" alt="brand image" />
              </div>
              <div className="client-logo-item client-logo-item-2">
                <img src="html-folder/images/vologo.png" alt="brand image" />
              </div>
            </div>
            
          </div>
          
        </div>
        
      </div>
      
      <svg className="cta-svg" viewBox="0 0 500 150" preserveAspectRatio="none">
        <path
          d="M-31.31,170.22 C164.50,33.05 334.36,-32.06 547.11,196.88 L500.00,150.00 L0.00,150.00 Z"
        ></path>
      </svg>
    </section>
  );
}
