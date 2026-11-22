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

