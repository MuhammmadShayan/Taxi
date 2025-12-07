/*---------------------------------------------
Safe version of main.js for Next.js compatibility
Includes proper null checks and error handling
----------------------------------------------*/

(function ($) {
    "use strict";
    
    // Wait for document ready and ensure jQuery is loaded
    if (typeof $ === 'undefined') {
        console.warn('jQuery not loaded, skipping main.js initialization');
        return;
    }
    
    var $window = $(window);
    var $document = $(document);

    // Function to safely wait for React hydration and all scripts to load
    function waitForHydrationAndScripts(callback, maxWait = 8000) {
        var start = Date.now();
        var interval = setInterval(function() {
            var hasJQ = typeof $ !== 'undefined' && typeof $.fn !== 'undefined';
            var hasOwl = hasJQ && typeof $.fn.owlCarousel !== 'undefined';
            var hydrated = typeof window !== 'undefined' && window.__NEXT_HYDRATED__ === true;

            if ((hasJQ && hydrated && (hasOwl || Date.now() - start > 2000)) || Date.now() - start > maxWait) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

    // Initialize when document is ready, after React hydration, and scripts are loaded
    $document.ready(function() {
        waitForHydrationAndScripts(function() {
            initializeComponents();
        });
    });

    function initializeComponents() {
        console.log('Initializing components safely...');
        
        // Safe element selectors with null checks
        function safeSelect(selector) {
            try {
                return $(selector).length ? $(selector) : null;
            } catch (e) {
                console.warn('Selector failed:', selector, e);
                return null;
            }
        }
        
        // Initialize variables safely
        var $dom = $('html, body');
        var preloader = safeSelect('#preloader');
        var dropdownMenu = safeSelect('.main-menu-content .dropdown-menu-item');
        var isMenuOpen = false;
        var topNav = document.querySelector('.header-menu-wrapper');
        var scrollTopBtn = safeSelect('#back-to-top');
        var scrollLink = safeSelect('#single-content-nav .scroll-link');
        var hotelCardCarousel = safeSelect('.hotel-card-carousel');
        var carCarousel = safeSelect('.car-carousel');
        var clientCarousel = safeSelect('.client-logo');
        var testimonialCarousel = safeSelect('.testimonial-carousel');
        var fancyVideo = safeSelect('[data-fancybox="video"]');
        var fancyGallery = safeSelect('[data-fancybox="gallery"]');
        var rippleBg = safeSelect('.ripple-bg');
        var rangeSlider = safeSelect('#slider-range');
        var rangeSliderAmount = safeSelect('#amount');
        var dateRangePicker = safeSelect('input[name="daterange"]');
        var select2Menu = safeSelect('.select-contain-select');
        var numberCounter = safeSelect('.counter');

        /* ======= Preloader (disabled by default to avoid React hydration mismatches) ======= */
        if (preloader && typeof window !== 'undefined' && window.ENABLE_LEGACY_PRELOADER === true) {
            preloader.delay(500).fadeOut(2000);
        }

        /*=========== Header top bar menu ============*/
        $document.on('click', '.down-button', function (e) {
            e.preventDefault();
            try {
                $(this).toggleClass('active');
                var headerTopBar = $('.header-top-bar');
                if (headerTopBar.length) {
                    headerTopBar.slideToggle(200);
                }
            } catch (err) {
                console.warn('Header toggle error:', err);
            }
        });

        /*=========== Responsive Mobile menu ============*/
        $document.on('click', '.menu-toggler', function (e) {
            e.preventDefault();
            try {
                $(this).toggleClass('active');
                var mainMenuContent = $('.main-menu-content');
                if (mainMenuContent.length) {
                    mainMenuContent.slideToggle(200);
                }
            } catch (err) {
                console.warn('Menu toggle error:', err);
            }
        });

        /*=========== Dropdown menu ============*/
        // Only modify DOM if we're in a browser environment and after hydration
        if (dropdownMenu && typeof window !== 'undefined') {
            try {
                // Add a small delay to ensure hydration is complete
                setTimeout(function() {
                    // Check if dropdown togglers already exist to prevent duplicates
                    var existingTogglers = dropdownMenu.parent('li').find('.drop-menu-toggler');
                    if (existingTogglers.length === 0) {
                        dropdownMenu.parent('li').children('a, .nav-link-wrapper').append(function() {
                            return '<button class="drop-menu-toggler" type="button"><i class="la la-angle-down"></i></button>';
                        });
                        // console.log('✅ Dropdown menu togglers added successfully');
                    }
                }, 100);
            } catch (err) {
                console.warn('Dropdown menu setup error:', err);
            }
        }

        /*=========== Dropdown menu click handler ============*/
        $document.on('click', '.main-menu-content .drop-menu-toggler', function(e) {
            e.preventDefault();
            try {
                var Self = $(this);
                var dropdownItem = Self.parent().parent().children('.dropdown-menu-item');
                if (dropdownItem.length) {
                    dropdownItem.toggle();
                }
            } catch (err) {
                console.warn('Dropdown toggle error:', err);
            }
            return false;
        });

        /*=========== Canvas menu open ============*/
        $document.on('click', '.user-menu-open', function (e) {
            e.preventDefault();
            try {
                var canvasContainer = $('.user-canvas-container');
                if (canvasContainer.length) {
                    canvasContainer.addClass('active');
                }
            } catch (err) {
                console.warn('Canvas menu open error:', err);
            }
        });

        /*=========== Canvas menu close ============*/
        $document.on('click', '.side-menu-close', function (e) {
            e.preventDefault();
            try {
                var elements = $('.user-canvas-container, .sidebar-nav');
                if (elements.length) {
                    elements.removeClass('active');
                }
            } catch (err) {
                console.warn('Canvas menu close error:', err);
            }
        });

        /*=========== Dashboard menu ============*/
        $document.on('click', '.menu-toggler', function (e) {
            try {
                var sidebarNav = $('.sidebar-nav');
                if (sidebarNav.length) {
                    sidebarNav.toggleClass('active');
                }
            } catch (err) {
                console.warn('Dashboard menu error:', err);
            }
        });

        /*=========== Window resize handler ============*/
        $window.on('resize', function () {
            try {
                if ($window.width() > 991) {
                    $('.main-menu-content').show();
                    $('.dropdown-menu-item').show();
                    $('.sub-menu').show();
                    $('.header-top-bar').show();
                } else {
                    if (isMenuOpen) {
                        $('.main-menu-content').show();
                        $('.dropdown-menu-item').show();
                        $('.sub-menu').show();
                        $('.header-top-bar').show();
                    } else {
                        $('.main-menu-content').hide();
                        $('.dropdown-menu-item').hide();
                        $('.sub-menu').hide();
                        $('.header-top-bar').hide();
                    }
                }
            } catch (err) {
                console.warn('Window resize error:', err);
            }
        });

        /*=========== Navbar offset top ============*/
        var topOfNav = 0;
        if (topNav) {
            topOfNav = topNav.offsetTop;
        }

        $window.on('scroll', function () {
            try {
                // Fixed navigation
                if (topNav && $window.scrollTop() >= topOfNav) {
                    if (document.body) {
                        document.body.style.paddingTop = topNav.offsetHeight + 'px';
                        document.body.classList.add('fixed-nav');
                    }
                } else {
                    if (document.body) {
                        document.body.style.paddingTop = '0px';
                        document.body.classList.remove('fixed-nav');
                    }
                }

                // Back to top button control
                if (scrollTopBtn) {
                    if ($window.scrollTop() > 500) {
                        scrollTopBtn.addClass('active');
                    } else {
                        scrollTopBtn.removeClass('active');
                    }
                }

                // Page scroll position
                findPosition();
            } catch (err) {
                console.warn('Scroll handler error:', err);
            }
        });

        /*========== Page scroll ==========*/
        if (scrollLink) {
            scrollLink.on('click', function(e) {
                try {
                    var target = $($(this).attr('href'));
                    if (target.length && target.offset()) {
                        $($dom).animate({
                            scrollTop: target.offset().top
                        }, 600);
                        $(this).addClass('active');
                    }
                } catch (err) {
                    console.warn('Scroll link error:', err);
                }
                e.preventDefault();
            });
        }

        function findPosition() {
            try {
                $('.page-scroll').each(function() {
                    if ($(this).offset() && ($(this).offset().top - $(window).scrollTop()) < 20) {
                        if (scrollLink) {
                            scrollLink.removeClass('active');
                        }
                        var navElement = $('#single-content-nav');
                        if (navElement.length) {
                            var scrollElement = navElement.find('[data-scroll="' + $(this).attr('id') + '"]');
                            if (scrollElement.length) {
                                scrollElement.addClass('active');
                            }
                        }
                    }
                });
            } catch (err) {
                console.warn('Find position error:', err);
            }
        }

        /*===== Back to top button ======*/
        $document.on("click", "#back-to-top", function(e) {
            e.preventDefault();
            try {
                $($dom).animate({
                    scrollTop: 0
                }, 800);
            } catch (err) {
                console.warn('Back to top error:', err);
            }
            return false;
        });

        /*==== Enhanced Owl Carousel initialization =====*/
        function initializeOwlCarousel(element, options, name) {
            if (!element || !element.length) {
                console.warn(name + ' element not found');
                return;
            }
            
            if (typeof $.fn.owlCarousel !== 'function') {
                console.warn('Owl Carousel plugin not loaded for ' + name);
                return;
            }
            
            try {
                // Destroy existing instance if it exists
                if (element.hasClass('owl-loaded')) {
                    element.trigger('destroy.owl.carousel');
                    element.removeClass('owl-loaded owl-carousel');
                }
                
                // Re-add necessary classes
                element.addClass('owl-carousel');
                
                // Initialize with options
                element.owlCarousel(options);
                // console.log('✅ ' + name + ' initialized successfully');
            } catch (err) {
                console.warn('❌ ' + name + ' initialization error:', err);
            }
        }

        /*==== Car-carousel =====*/
        if (carCarousel) {
            initializeOwlCarousel(carCarousel, {
                loop: true,
                items: 3,
                nav: true,
                dots: true,
                smartSpeed: 700,
                autoplay: false,
                margin: 30,
                navText: ['<i class="la la-angle-left"></i>', '<i class="la la-angle-right"></i>'],
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 }
                }
            }, 'Car Carousel');
        }

        /*==== Client logo carousel =====*/
        // To avoid React hydration mismatches, only initialize this carousel
        // if explicitly enabled by a global flag set by the React app.
        if (clientCarousel && typeof window !== 'undefined' && window.ENABLE_JQUERY_CLIENT_LOGO === true) {
            initializeOwlCarousel(clientCarousel, {
                loop: true,
                items: 6,
                nav: false,
                dots: false,
                smartSpeed: 700,
                autoplay: true,
                autoplayTimeout: 3000,
                autoplayHoverPause: true,
                responsive: {
                    0: { items: 1 },
                    425: { items: 2 },
                    480: { items: 2 },
                    767: { items: 4 },
                    992: { items: 6 }
                }
            }, 'Client Logo Carousel');
        }

        /*==== Fancybox for video =====*/
        if (fancyVideo && typeof $.fn.fancybox === 'function') {
            try {
                fancyVideo.fancybox({
                    buttons: ["share", "fullScreen", "close"]
                });
            } catch (err) {
                console.warn('Fancybox video initialization error:', err);
            }
        }

        /*==== Fancybox for gallery =====*/
        if (fancyGallery && typeof $.fn.fancybox === 'function') {
            try {
                fancyGallery.fancybox({
                    buttons: ["share", "slideShow", "fullScreen", "download", "thumbs", "close"]
                });
            } catch (err) {
                console.warn('Fancybox gallery initialization error:', err);
            }
        }

        /*====  Ripple-bg =====*/
        if (rippleBg && typeof $.fn.ripples === 'function') {
            try {
                rippleBg.ripples({
                    resolution: 500,
                    dropRadius: 20,
                    perturbance: 0
                });
            } catch (err) {
                console.warn('Ripple background initialization error:', err);
            }
        }

        /*======= UI price range slider ========*/
        if (rangeSlider && typeof $.fn.slider === 'function') {
            try {
                rangeSlider.slider({
                    range: true,
                    min: 0,
                    max: 1000,
                    values: [40, 800],
                    slide: function(event, ui) {
                        if (rangeSliderAmount) {
                            rangeSliderAmount.val("$" + ui.values[0] + " - $" + ui.values[1]);
                        }
                    }
                });
                
                if (rangeSliderAmount) {
                    rangeSliderAmount.val("$" + rangeSlider.slider("values", 0) + " - $" + rangeSlider.slider("values", 1));
                }
            } catch (err) {
                console.warn('Range slider initialization error:', err);
            }
        }

        /*==== Daterangepicker =====*/
        if (dateRangePicker && typeof $.fn.daterangepicker === 'function') {
            try {
                dateRangePicker.daterangepicker({
                    opens: 'right',
                    locale: {
                        format: 'DD/MM/YYYY',
                    }
                });
            } catch (err) {
                console.warn('Date range picker initialization error:', err);
            }
        }

        /*==== Enhanced select2 initialization =====*/
        function initializeSelect2(elements, name) {
            if (!elements || !elements.length) {
                return;
            }
            
            if (typeof $.fn.select2 !== 'function') {
                console.warn('Select2 plugin not loaded for ' + name);
                return;
            }
            
            try {
                // Only initialize if not already initialized and element is visible
                elements.each(function() {
                    var $element = $(this);
                    if (!$element.hasClass('select2-hidden-accessible') && $element.is(':visible')) {
                        $element.select2({
                            minimumResultsForSearch: Infinity,
                            width: '100%'
                        });
                    }
                });
                // console.log('✅ ' + name + ' initialized successfully');
            } catch (err) {
                console.warn('❌ ' + name + ' initialization error:', err);
            }
        }

        /*==== select2 with delay to ensure DOM is ready =====*/
        if (select2Menu) {
            // Add a delay to ensure the page is fully loaded and no hydration conflicts
            setTimeout(function() {
                initializeSelect2(select2Menu, 'Select2 Menu');
            }, 1000);
        }

        /*==== counter =====*/
        if (numberCounter && typeof $.fn.countTo === 'function') {
            try {
                numberCounter.countTo({
                    speed: 1200
                });
            } catch (err) {
                console.warn('Counter initialization error:', err);
            }
        }

        /*==== Bootstrap tooltip =====*/
        try {
            var tooltipElements = $('[data-bs-toggle="tooltip"]');
            if (tooltipElements.length && typeof tooltipElements.tooltip === 'function') {
                tooltipElements.tooltip();
            }
        } catch (err) {
            console.warn('Tooltip initialization error:', err);
        }

        /*==== Enhanced Bootstrap Modal Safe Handling =====*/
        try {
            // Ensure Bootstrap modals work properly without touching internal _config
            $document.on('show.bs.modal', function(e) {
                try {
                    var $modal = $(e.target);
                    if ($modal && $modal.length) {
                        // If no explicit backdrop setting, default to true via data attribute
                        var bd = $modal.attr('data-bs-backdrop');
                        if (typeof bd === 'undefined' || bd === null || bd === '') {
                            $modal.attr('data-bs-backdrop', 'true');
                        }
                    }
                } catch (modalErr) {
                    console.warn('Modal show event error:', modalErr);
                }
            });

            // Handle modal backdrop clicks safely using data attribute and robust instance checks
            $document.on('click', '.modal', function(e) {
                try {
                    if (e.target === this) {
                        var $modal = $(this);
                        var backdropSetting = ($modal && $modal.attr) ? $modal.attr('data-bs-backdrop') : undefined;
                        // Only allow closing when backdrop is not static
                        if (backdropSetting !== 'static') {
                            var B = (typeof window !== 'undefined' && window.bootstrap) ? window.bootstrap : null;
                            if (B && B.Modal) {
                                var inst = B.Modal.getInstance(this) || new B.Modal(this);
                                if (inst && typeof inst.hide === 'function') {
                                    inst.hide();
                                }
                            } else {
                                // Fallback: hide modal and cleanup backdrop manually
                                $modal.removeClass('show').attr('aria-hidden', 'true').hide();
                                try {
                                    document.body.classList.remove('modal-open');
                                    document.body.style.overflow = '';
                                    document.querySelectorAll('.modal-backdrop').forEach(function(el){ el.remove(); });
                                } catch {}
                            }
                        }
                    }
                } catch (modalErr) {
                    console.warn('Modal backdrop click error:', modalErr);
                }
            });
        } catch (err) {
            console.warn('Modal initialization error:', err);
        }

        /*====== Safe collapse handling ======*/
        try {
            $document.on('click', '[data-bs-toggle="collapse"]', function(e) {
                var target = $(this).data('bs-target') || $(this).attr('href');
                if (target) {
                    var targetElement = $(target);
                    if (targetElement.length) {
                        targetElement.collapse('toggle');
                    }
                }
            });
        } catch (err) {
            console.warn('Collapse handling error:', err);
        }

        /*===== Safe onclick handler for dynamic elements =====*/
        function addSafeClickHandler(selector, handler, description) {
            $document.off('click', selector).on('click', selector, function(e) {
                try {
                    if (this && typeof handler === 'function') {
                        handler.call(this, e);
                    }
                } catch (err) {
                    console.warn(description + ' click handler error:', err);
                }
            });
        }

        // Example safe click handlers
        addSafeClickHandler('.btn-search', function(e) {
            e.preventDefault();
            // Search functionality
        }, 'Search button');

        addSafeClickHandler('.login-btn', function(e) {
            e.preventDefault();
            // Login modal trigger
        }, 'Login button');

        /*========= Get year ========*/
        try {
            let currentYear = new Date().getFullYear();
            var yearElement = $('#get-year');
            if (yearElement.length) {
                yearElement.text(currentYear);
            }
        } catch (err) {
            console.warn('Year display error:', err);
        }

        // console.log('✅ All components initialized safely');
    }

})(typeof jQuery !== 'undefined' ? jQuery : null);
