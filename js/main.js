(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();

    // Privacy Policy Modal Functionality
    const privacyModal = $('#privacy-modal');
    const privacyCheckbox = $('#privacy-agreement');
    const privacyAcceptBtn = $('#privacy-accept');
    const privacyDeclineBtn = $('#privacy-decline');
    const privacyCloseBtn = $('.privacy-close');
    const privacyContactLinks = $('.privacy-contact-link');
    let pendingContactAction = null;

    // Enable/disable accept button based on checkbox
    privacyCheckbox.on('change', function() {
        privacyAcceptBtn.prop('disabled', !this.checked);
    });

    // Show privacy modal when contact links are clicked
    privacyContactLinks.on('click', function(e) {
        e.preventDefault();
        const element = $(this);
        const contactType = element.data('contact-type');
        
        // Handle different types of contact actions
        if (contactType === 'form') {
            // Store the form element for submission
            pendingContactAction = {
                form: element.closest('form')[0],
                type: contactType
            };
        } else {
            // Store the URL for email/whatsapp links
            pendingContactAction = {
                url: element.attr('href'),
                type: contactType
            };
        }
        
        // Show privacy modal
        privacyModal.fadeIn(300);
        
        // Reset checkbox and button state
        privacyCheckbox.prop('checked', false);
        privacyAcceptBtn.prop('disabled', true);
        
        // Scroll to top of modal
        $('.privacy-modal-body').scrollTop(0);
    });

    // Handle accept button
    privacyAcceptBtn.on('click', function() {
        if (pendingContactAction && privacyCheckbox.prop('checked')) {
            // Store consent in localStorage for future visits
            localStorage.setItem('privacyConsent', 'accepted');
            localStorage.setItem('privacyConsentDate', new Date().toISOString());
            
            // Close modal
            privacyModal.fadeOut(300);
            
            // Handle the action after a brief delay
            setTimeout(() => {
                if (pendingContactAction.type === 'form') {
                    // Submit the form
                    pendingContactAction.form.submit();
                } else {
                    // Open the contact link
                    window.open(pendingContactAction.url, '_blank');
                }
                pendingContactAction = null;
            }, 300);
        }
    });

    // Handle decline button
    privacyDeclineBtn.on('click', function() {
        privacyModal.fadeOut(300);
        pendingContactAction = null;
        
        // Optional: Show a message that they need to accept to continue
        setTimeout(() => {
            alert('You need to accept the Privacy Policy to contact us. Your privacy and data protection are important to us.');
        }, 300);
    });

    // Handle close button
    privacyCloseBtn.on('click', function() {
        privacyModal.fadeOut(300);
        pendingContactAction = null;
    });

    // Close modal when clicking outside of it
    privacyModal.on('click', function(e) {
        if (e.target === this) {
            privacyModal.fadeOut(300);
            pendingContactAction = null;
        }
    });

    // Check if user has already consented
    $(document).ready(function() {
        const consentDate = localStorage.getItem('privacyConsentDate');
        const consent = localStorage.getItem('privacyConsent');
        
        // Check if consent is still valid (e.g., within last 12 months)
        if (consent === 'accepted' && consentDate) {
            const consentTimestamp = new Date(consentDate);
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            
            if (consentTimestamp > twelveMonthsAgo) {
                // Consent is still valid, allow direct contact
                privacyContactLinks.off('click').on('click', function(e) {
                    const contactType = $(this).data('contact-type');
                    
                    if (contactType === 'form') {
                        // For forms, allow normal submission
                        return true;
                    } else {
                        // For links, allow normal behavior
                        return true;
                    }
                });
            }
        }
    });


    //Overlay js
    var $navbarToggler = $('.navbar .navbar-toggler');
    var $navbarClose = $('.navbar .navbar-close');
    var $navbarCollapse = $('.navbar-collapse');
    var $nav = $('.navbar-collapse .navbar-nav a');
    var $overlay = $('.overlay');

    //Show overlay

    $navbarToggler.click(function(event) {
         // Get the center point of the screen
         var x = window.innerWidth / 2;
         var y = window.innerHeight / 2;
 
         // Calculate the maximum radius to cover the entire screen
         var maxRadius = Math.sqrt(x * x + y * y);
 
         // Show the modal overlay
         $overlay.show();
 
         anime({
         targets: $overlay[0],
         clipPath: ['circle(0% at ' + x + 'px ' + y + 'px)', 'circle(' + maxRadius + 'px at ' + x + 'px ' + y + 'px)'],
         duration: 1000, // Adjust the duration as needed
         easing: 'linear'
         });
      
        $navbarClose.toggle(); // Toggle the close button
        $(this).hide(); // Hide the toggle button
      });


    //Hide Overlay
    $navbarClose.click(function(event) {
        var x = event.pageX;
        var y = event.pageY;
      
        anime({
          targets: $overlay[0], // Use [0] to access the DOM element from the jQuery object
          clipPath: ['circle(100% at ' + x + 'px ' + y + 'px)', 'circle(0% at ' + x + 'px ' + y + 'px)'],
          duration: 500, // Animation duration in milliseconds
          easing: 'linear',
          complete: function() {
            // Hide the overlay when the animation is complete
            $overlay.hide();
          }
        });
      
        $navbarCollapse.toggleClass('show'); // Toggle the collapse class
        $(this).toggle(100); // Hide the close button
        $navbarToggler.show(); // Show the toggle button
    });


    $nav.on("click", function(event) {
        // Get click position for animation
        var x = event.pageX || window.innerWidth / 2;
        var y = event.pageY || window.innerHeight / 2;
      
        // Animate overlay out
        anime({
          targets: $overlay[0],
          clipPath: ['circle(100% at ' + x + 'px ' + y + 'px)', 'circle(0% at ' + x + 'px ' + y + 'px)'],
          duration: 500,
          easing: 'linear',
          complete: function() {
            $overlay.hide();
          }
        });
      
        // Hide mobile menu elements
        $navbarCollapse.removeClass('show');
        $navbarClose.hide();
        $navbarToggler.show();
    });

    // Sticky Navbar

    // var $navbarContainer = $('#navbarContainer');

    // if ($('#mobile-indicator').is(':visible')) {
    //     $('.navbar .navbar-collapse .navbar-nav a').on("click", function () {
    //         $overlay.toggle(500);
    //         $navbarCollapse.toggleClass('show');
    //         $navbarClose.toggle();
    //     });
    
    //     $(window).scroll(function () {
    //         if ($(this).scrollTop() > 45) {
    //             $navbarContainer.removeClass('sticky shadow-sm');
    //         } else {
    //             $navbarContainer.removeClass('sticky shadow-sm');
    //         }
    //     });
    
    // } else {
    //     $(window).scroll(function () {
    //         if ($(this).scrollTop() > 45) {
    //             $navbarContainer.addClass('sticky shadow-sm');
    //         } else {
    //             $navbarContainer.removeClass('sticky shadow-sm');
    //         }
    //     });
    // }

    //Modal JS

    const $modalOverlay = $(".modal-overlay");
    const $trigger = $(".trigger");
    const $closeButton = $(".close-button");

    $trigger.click(function(event) {
        // Get the center point of the screen
        var x = window.innerWidth / 2;
        var y = window.innerHeight / 2;

        // Find the closest modal that is a sibling of the clicked trigger
        const $modal = $(this).siblings(".modal");

        // Calculate the maximum radius to cover the entire screen
        var maxRadius = Math.sqrt(x * x + y * y);

        // Show the modal overlay
        $modalOverlay.show();

        anime({
        targets: $modalOverlay[0],
        clipPath: ['circle(0% at ' + x + 'px ' + y + 'px)', 'circle(' + maxRadius + 'px at ' + x + 'px ' + y + 'px)'],
        duration: 1000, // Adjust the duration as needed
        easing: 'linear'
        });

        $modal.slideToggle( "slow" );
    });

    $closeButton.click(function() {
        // Get the center point of the screen
        var x = window.innerWidth / 2;
        var y = window.innerHeight / 2;

        const $modal = $(this).closest(".modal");
    
        // Calculate the maximum radius to cover the entire screen
        var maxRadius = Math.sqrt(x * x + y * y);

        anime({
          targets: $modalOverlay[0],
          clipPath: ['circle(' + maxRadius + 'px at ' + x + 'px ' + y + 'px)', 'circle(0% at ' + x + 'px ' + y + 'px)'],
          duration: 1000, // Adjust the duration as needed
          easing: 'linear',
          complete: function() {
            // Hide the modal overlay when the animation is complete
            $modalOverlay.hide();
          }
        });

        $modal.slideToggle( "slow" );
    });

    //Rotate logo on scroll

    $(document).ready(function(){
        var bodyHeight = $("body").height()-$(window).height();
        window.onscroll = function() {
     
           //Determine the amount to rotate by.
           var deg = window.scrollY*(720/bodyHeight);
     
           $("#navbarContainer.sticky .navbar-light .logo-color img").css({
             "transform": "rotate("+deg+"deg)",
           });
     
        };
     });
 

    //Click functionality for service boxes

    $('.service-item-container a.btn').on("click", function(event) {
        event.preventDefault();
        $(this).parent().toggleClass('active');
        $(this).siblings('.flip-container').toggleClass('hover');
    });

    //Modal javascript

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });


    // Student carousel (mobile/tablet only)
    $(".student-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 6000,
        smartSpeed: 1200,
        margin: 30,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        loop: true,
        center: true,
        items: 5,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 3
            }
        }
    });



    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

