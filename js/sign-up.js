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


    $nav.on("click", function() {
        $navbarToggler.show();
    });

if (document.body.classList.contains("sign-up")) {

// Track quiz page view
if (typeof fbq !== 'undefined') {
    fbq('track', 'ViewContent', {
        content_name: 'Quiz',
        content_category: 'Education',
        content_type: 'quiz'
    });
}
if (typeof gtag !== 'undefined') {
    gtag('event', 'quiz_started', {
        event_category: 'Quiz',
        event_label: 'Quiz Page Loaded'
    });
}

// Facebook Pixel Lead Tracking Functions
function trackFacebookLead(contactType) {
    if (typeof fbq !== 'undefined') {
        var course = getRecommendedCourse();
        fbq('track', 'Lead', {
            content_name: course.name,
            content_category: 'Education',
            contact_method: contactType,
            value: 1,
            currency: 'GBP'
        });
    }
    if (typeof gtag !== 'undefined') {
        var course = getRecommendedCourse();
        gtag('event', 'generate_lead', {
            event_category: 'Quiz',
            event_label: course.name,
            value: 1,
            currency: 'GBP'
        });
    }
}

var questionLabels = {
    1: 'Age',
    2: 'Gaming',
    3: 'Coding Experience',
    4: 'Interest'
};

function trackFormProgress(step) {
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', 'FormProgress', {
            step: step,
            question: questionLabels[step] || 'Unknown',
            progress_percentage: Math.round((step / getTotalVisibleQuestions()) * 100),
            age_range: userAnswers.ageRange || 'not_yet_answered'
        });
    }
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_progress', {
            event_category: 'Quiz',
            event_label: questionLabels[step] || 'Unknown',
            step: step,
            age_range: userAnswers.ageRange || 'not_yet_answered'
        });
    }
}

// Privacy Policy Modal Functionality
const privacyModal = $('#privacy-modal');
const privacyCheckbox = $('#privacy-agreement');
const privacyAcceptBtn = $('#privacy-accept');
const privacyDeclineBtn = $('#privacy-decline');
const privacyCloseBtn = $('.privacy-close');
const privacyContactLinks = $('.privacy-contact-link');
let pendingContactAction = null;

privacyCheckbox.on('change', function() {
    privacyAcceptBtn.prop('disabled', !this.checked);
});

privacyContactLinks.on('click', function(e) {
    e.preventDefault();
    const link = $(this);
    const contactType = link.data('contact-type');

    pendingContactAction = {
        url: link.attr('href'),
        type: contactType
    };

    privacyModal.fadeIn(300);
    privacyCheckbox.prop('checked', false);
    privacyAcceptBtn.prop('disabled', true);
    $('.privacy-modal-body').scrollTop(0);
});

privacyAcceptBtn.on('click', function() {
    if (pendingContactAction && privacyCheckbox.prop('checked')) {
        localStorage.setItem('privacyConsent', 'accepted');
        localStorage.setItem('privacyConsentDate', new Date().toISOString());
        privacyModal.fadeOut(300);

        if (pendingContactAction.submitForm) {
            pendingContactAction = null;
            setTimeout(function() {
                submitQuizBooking();
            }, 300);
        } else {
            trackFacebookLead(pendingContactAction.type);
            setTimeout(() => {
                window.open(pendingContactAction.url, '_blank');
                pendingContactAction = null;
            }, 300);
        }
    }
});

privacyDeclineBtn.on('click', function() {
    privacyModal.fadeOut(300);
    pendingContactAction = null;
    setTimeout(() => {
        alert('You need to accept the Privacy Policy to contact us. Your privacy and data protection are important to us.');
    }, 300);
});

privacyCloseBtn.on('click', function() {
    privacyModal.fadeOut(300);
    pendingContactAction = null;
});

privacyModal.on('click', function(e) {
    if (e.target === this) {
        privacyModal.fadeOut(300);
        pendingContactAction = null;
    }
});

$(document).ready(function() {
    const consentDate = localStorage.getItem('privacyConsentDate');
    const consent = localStorage.getItem('privacyConsent');

    if (consent === 'accepted' && consentDate) {
        const consentTimestamp = new Date(consentDate);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        if (consentTimestamp > twelveMonthsAgo) {
            privacyContactLinks.off('click').on('click', function(e) {
                const contactType = $(this).data('contact-type');
                trackFacebookLead(contactType);
                return true;
            });
        }
    }
});

// Modal elements
const $modalOverlay = $(".modal-overlay");
const $triggerYes = $(".trigger-yes");
const $triggerNo = $(".trigger-no");
const $triggerNext = $(".trigger-next");
const $triggerBack = $(".trigger-back");
const $closeButton = $(".close-button");
const $questionBox = $(".question-box");
const $modal = $(".modal");
const $questionTitle = $(".model-sub-title");
const $introRow = $(".intro-display-none");

// Question and answer management
const qaData = [
    {
        question: "How old is your child?",
        type: "choice",
        answerClass: "a-1",
        answerNoClass: "no-1",
        options: [
            { label: "7 or under", value: "under-8", outOfRange: true },
            { label: "8 to 10", value: "8-10" },
            { label: "11 to 13", value: "11-13" },
            { label: "14 to 16", value: "14-16" },
            { label: "17 or older", value: "over-16", outOfRange: true }
        ]
    },
    {
        question: "Do they like playing games like Minecraft and Roblox?",
        type: "yesno",
        answerClass: "a-2",
        answerNoClass: "no-2"
    },
    {
        question: "Has your child tried any coding before?",
        type: "yesno",
        answerClass: "a-3",
        answerNoClass: "no-3"
    },
    {
        question: "What does your child enjoy more?",
        type: "choice",
        answerClass: "a-5",
        answerNoClass: null,
        options: [
            { label: "Art, Design & Creativity", value: "creative", icon: "fas fa-palette" },
            { label: "Maths, Logic & Problem-Solving", value: "logical", icon: "fas fa-brain" }
        ]
    }
];

// State management
let currentQuestionIndex = 0;
let userAnswers = {
    ageRange: null,
    likesGaming: null,
    hasCodingExp: null,
    interest: null
};

// Progress bar elements
const $progressFill = $('#progressFill');
const $progressText = $('#progressText');
const $progressContainer = $('.form-progress-container');

// Dynamic question count helpers
function getTotalVisibleQuestions() {
    // All age ranges now see the interest question
    return 4;
}

function getVisibleQuestionNumber() {
    // All questions are visible for all ages
    return currentQuestionIndex + 1;
}

function getNextQuestionIndex(currentIndex) {
    // No questions are skipped anymore
    return currentIndex + 1;
}

function getPreviousQuestionIndex(currentIndex) {
    // No questions are skipped anymore
    return currentIndex - 1;
}

// Update progress bar
function updateProgressBar() {
    const total = getTotalVisibleQuestions();
    const current = getVisibleQuestionNumber();
    const progressPercentage = (current / total) * 100;

    $progressFill.css('width', progressPercentage + '%');
    $progressText.text(`Question ${current} of ${total}`);
}

// Course recommendation logic
function getRecommendedCourse() {
    const { ageRange, hasCodingExp, interest } = userAnswers;

    // Age 10 or under (8-10)
    if (ageRange === "8-10") {
        // No coding experience - always Scratch
        if (!hasCodingExp) {
            return {
                name: "Scratch",
                icon: "fas fa-puzzle-piece",
                description: "Your child will build their own games, animations, and stories — no experience needed, just curiosity. They'll finish the session buzzing, already proud of what they've made.",
                color: "#FFB628",
                emailBenefit: "A fun, visual coding language where kids build games and animations using drag-and-drop blocks. Perfect for building confidence and creative thinking."
            };
        }

        // Has coding experience - use interest to decide
        if (interest === "creative") {
            return {
                name: "Scratch",
                icon: "fas fa-puzzle-piece",
                description: "Your child will build their own games, animations, and stories — no experience needed, just curiosity. They'll finish the session buzzing, already proud of what they've made.",
                color: "#FFB628",
                emailBenefit: "A fun, visual coding language where kids build games and animations using drag-and-drop blocks. Perfect for building confidence and creative thinking."
            };
        } else {
            return {
                name: "Python",
                icon: "fab fa-python",
                description: "Python is the coding language behind Google, Netflix, and NASA — and your child is about to learn it. They'll build real projects like games and mini apps that actually do something.",
                color: "#3776AB",
                emailBenefit: "A simple yet powerful, beginner-friendly programming language used by professionals worldwide. Great for building apps and games."
            };
        }
    }

    // Age 11-13 (older than 10, younger than 14) - always Python
    if (ageRange === "11-13") {
        return {
            name: "Python",
            icon: "fab fa-python",
            description: "Python is the coding language behind Google, Netflix, and NASA — and your child is about to learn it. They'll build real projects like games and mini apps that actually do something.",
            color: "#3776AB",
            emailBenefit: "A simple yet powerful, beginner-friendly programming language used by professionals worldwide. Great for building apps and games."
        };
    }

    // Age 14-16 (older than 13) - creative gets Web Dev, logical gets Python
    if (ageRange === "14-16") {
        if (interest === "creative") {
            return {
                name: "Web Development",
                icon: "fas fa-code",
                description: "Your child will design and build real websites from scratch, using the same tools professional developers use every day. It's creative, practical, and one of the most in-demand skills they can have.",
                color: "#E44D26",
                emailBenefit: "Learn HTML, CSS and JavaScript to design and build real websites. A creative, portfolio-ready skill used across every industry."
            };
        } else {
            return {
                name: "Python",
                icon: "fab fa-python",
                description: "Python is the coding language behind Google, Netflix, and NASA — and your child is about to learn it. They'll build real projects like games and mini apps that actually do something.",
                color: "#3776AB",
                emailBenefit: "A simple yet powerful, beginner-friendly programming language used by professionals worldwide. Great for building apps and games."
            };
        }
    }

    // Fallback
    return {
        name: "Scratch",
        icon: "fas fa-puzzle-piece",
        description: "Your child will build their own games, animations, and stories — no experience needed, just curiosity. They'll finish the session buzzing, already proud of what they've made.",
        color: "#FFB628",
        emailBenefit: "A fun, visual coding language where kids build games and animations using drag-and-drop blocks. Perfect for building confidence and creative thinking."
    };
}

function displayRecommendation() {
    const course = getRecommendedCourse();

    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', 'CourseRecommended', {
            course_name: course.name,
            age_range: userAnswers.ageRange,
            has_experience: userAnswers.hasCodingExp,
            interest: userAnswers.interest || 'n/a'
        });
    }
}

// Handle multi-choice answers
function handleChoiceAnswer(value) {
    // Age range question (index 0)
    if (currentQuestionIndex === 0) {
        const option = qaData[0].options.find(o => o.value === value);

        // Out-of-range age — show age restriction screen
        if (option && option.outOfRange) {
            userAnswers.ageRange = value;
            const noColor = "rgba(231, 76, 60, 0.9)";
            const transitionColor = "rgba(147, 51, 234, 0.9)";
            showNoModal(noColor, transitionColor);
            return;
        }

        userAnswers.ageRange = value;
        // Clear interest if age changed (in case user went back)
        userAnswers.interest = null;
    }

    // Interest question (index 3)
    if (currentQuestionIndex === 3) {
        userAnswers.interest = value;
    }

    trackFormProgress(currentQuestionIndex + 1);
    advanceQuiz();
}


// Get the center point of the screen
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;

// Calculate the maximum radius to cover the entire screen
var maxRadius = Math.sqrt(x * x + y * y);

// Advance to next question or show results
function advanceQuiz() {
    var nextIndex = getNextQuestionIndex(currentQuestionIndex);
    if (nextIndex >= qaData.length) {
        showResults();
    } else {
        showNextQuestion();
    }
}

function showNoModal(initialColor, transitionColor) {
    // Only used for age out-of-range on Q0
    const currentQ = qaData[currentQuestionIndex];
    if (!currentQ.answerNoClass) {
        return;
    }

    $modalOverlay.show();
    $modal.css({ display: "block", opacity: 1 });
    $modal[0].scrollTo({ top: 0, behavior: 'smooth' });
    const currentAnswerClass = currentQ.answerNoClass;
    $(`.${currentAnswerClass}`).fadeIn();

    $triggerNext.hide();

    if ($(".no-options-container").length === 0) {
        const $optionsContainer = $('<div class="no-options-container fadeInUp wow" data-wow-delay="0.3s"></div>');
        const $startAgainBtn = $('<button class="trigger trigger-restart">Start Again</button>');
        const $emailUsBtn = $('<a href="mailto:hello@headstartcoding.co.uk" class="trigger trigger-email">Email Us</a>');
        const $homePageBtn = $('<a href="/" class="trigger trigger-home">Visit Home Page</a>');

        $optionsContainer.append($startAgainBtn, $emailUsBtn, $homePageBtn);
        $(`.${currentAnswerClass}`).after($optionsContainer);

        $startAgainBtn.click(function() {
            resetForm();
        });
    } else {
        $(".no-options-container").show();
    }

    anime({
        targets: $modalOverlay[0],
        clipPath: [
            `circle(0% at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`
        ],
        backgroundColor: [initialColor, transitionColor],
        opacity: { value: [0, 1], duration: 1000 },
        duration: 1500,
        easing: "easeInOutQuad",
    });

    $questionBox.hide();
    $progressContainer.hide();
    $triggerBack.addClass('hide');
}

function resetForm() {
    const currentAnswerClass = qaData[currentQuestionIndex].answerClass;
    const currentAnswerNoClass = qaData[currentQuestionIndex].answerNoClass;
    $modal.hide();
    $(`.${currentAnswerClass}`).fadeOut();
    if (currentAnswerNoClass) $(`.${currentAnswerNoClass}`).fadeOut();
    $(".no-options-container").hide();

    anime({
        targets: $modalOverlay[0],
        clipPath: [
            `circle(${maxRadius}px at ${x}px ${y}px)`,
            `circle(0% at ${x}px ${y}px)`
        ],
        opacity: { value: [1, 0], duration: 1000 },
        duration: 1000,
        easing: "easeInOutQuad",
        complete: function () {
            $modalOverlay.hide();

            // Reset state
            currentQuestionIndex = 0;
            userAnswers = {
                ageRange: null,
                likesGaming: null,
                hasCodingExp: null,
                interest: null
            };

            $triggerBack.addClass('hide');
            updateQuestionUI();
        }
    });
}

function updateQuestionUI() {
    const currentQ = qaData[currentQuestionIndex];

    // Back button visibility
    if (currentQuestionIndex > 0) {
        $triggerBack.removeClass('hide');
        $('#quizTitle').hide();
    } else {
        $triggerBack.addClass('hide');
        $('#quizTitle').show();
    }

    if (currentQ.type === "choice") {
        // Hide yes/no, show choice buttons
        $(".yes-no-box").hide();
        const $choiceBox = $(".choice-box");
        $choiceBox.empty();

        currentQ.options.forEach(function(option) {
            const iconHtml = option.icon ? '<i class="' + option.icon + ' me-2"></i>' : '';
            const $btn = $('<button class="trigger trigger-choice" data-value="' + option.value + '">' +
                iconHtml + option.label +
            '</button>');
            $choiceBox.append($btn);
        });

        $choiceBox.show();

        // Bind click handlers
        $(".trigger-choice").off("click").on("click", function() {
            handleChoiceAnswer($(this).data("value"));
        });

    } else {
        // Standard yes/no question
        $(".choice-box").hide();
        $(".yes-no-box").show();

        $triggerNo.show();
        $triggerNo.text("No");
        $triggerYes.text("Yes");
    }

    // Update question text and show
    $questionTitle.text(currentQ.question);
    $questionBox.fadeIn(500);

    // Show and update progress bar
    $progressContainer.show();
    $progressFill.removeClass('completed');
    updateProgressBar();
}

function showNextQuestion() {
    currentQuestionIndex = getNextQuestionIndex(currentQuestionIndex);
    updateQuestionUI();
}

function showResults() {
    displayRecommendation();

    // Open the overlay and show the booking form
    $modalOverlay.show();
    $modal.css({ display: "block", opacity: 1 });
    $(`.a-7`).fadeIn(400);

    $triggerNext.hide();
    $triggerBack.addClass('hide');
    $questionBox.hide();
    $progressContainer.hide();
    $modal[0].scrollTo({ top: 0, behavior: 'smooth' });

    anime({
        targets: $modalOverlay[0],
        clipPath: [
            `circle(0% at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`
        ],
        backgroundColor: ["rgba(46, 204, 113, 0.9)", "rgba(147, 51, 234, 0.9)"],
        opacity: { value: [0, 1], duration: 1000 },
        duration: 1500,
        easing: "easeInOutQuad",
    });

    setTimeout(function () {
        launchFireworks();
    }, 500);

    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', 'FormCompleted', {
            total_questions: getTotalVisibleQuestions(),
            completion_rate: 100,
            recommended_course: getRecommendedCourse().name
        });
    }
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_completed', {
            event_category: 'Quiz',
            event_label: getRecommendedCourse().name,
            total_questions: getTotalVisibleQuestions()
        });
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex <= 0) return;
    currentQuestionIndex = getPreviousQuestionIndex(currentQuestionIndex);
    updateQuestionUI();
}


function launchFireworks() {
    const container = document.getElementById("fireworks-container");
    const fireworks = new Fireworks.default(container, {
        hue: { min: 0, max: 345 },
        acceleration: 1.1,
        brightness: { min: 17, max: 95 },
        decay: { min: 0.015, max: 0.036 },
        delay: { min: 30, max: 60 },
        explosion: 10,
        flickering: 50,
        intensity: 30,
        friction: 0.97,
        gravity: 1.5,
        opacity: 0.5,
        particles: 60,
        traceLength: 3,
        traceSpeed: 10,
        rocketsPoint: { min: 50, max: 50 },
        lineWidth: { explosion: { min: 1, max: 4 }, trace: { min: 0.1, max: 1 } },
        lineStyle: "round"
    });

    fireworks.start();

    setTimeout(() => {
        fireworks.stop();
    }, 4000);
}

// Testimonial code

document.addEventListener("DOMContentLoaded", function () {
    const testimonials = document.querySelectorAll(".testimonial");
    const dotsContainer = document.querySelector(".dots-container");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentIndex = 0;
    let autoSlide;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.remove("active");
            if (i === index) t.classList.add("active");
        });

        updateDots();
    }

    function updateDots() {
        document.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    function createDots() {
        testimonials.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = i;
                showTestimonial(currentIndex);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
        resetAutoSlide();
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
        resetAutoSlide();
    }

    function autoSlideTestimonials() {
        autoSlide = setInterval(nextTestimonial, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlideTestimonials();
    }

    prevBtn.addEventListener("click", prevTestimonial);
    nextBtn.addEventListener("click", nextTestimonial);

    createDots();
    showTestimonial(currentIndex);
    autoSlideTestimonials();
});

$triggerYes.click(function () {
    // Store yes/no answers
    if (currentQuestionIndex === 1) userAnswers.likesGaming = true;
    if (currentQuestionIndex === 2) userAnswers.hasCodingExp = true;

    trackFormProgress(currentQuestionIndex + 1);
    advanceQuiz();
});

$triggerNo.click(function () {
    // Store no answers
    if (currentQuestionIndex === 1) userAnswers.likesGaming = false;
    if (currentQuestionIndex === 2) userAnswers.hasCodingExp = false;

    trackFormProgress(currentQuestionIndex + 1);
    advanceQuiz();
});

$triggerBack.click(function () {
    showPreviousQuestion();
});

// Initialize first question
updateQuestionUI();

// Quiz booking form submission
function submitQuizBooking() {
    var $btn = $('#quizSubmitBtn');
    $btn.prop('disabled', true);
    $('#quizSubmitText').html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...');

    var course = getRecommendedCourse();

    var formData = {
        parentName: $('#quizParentName').val().trim(),
        parentEmail: $('#quizParentEmail').val().trim(),
        recommendedCourse: course.name,
        courseBenefit: course.emailBenefit,
        calendarLink: 'https://calendar.app.google/1u1P4sUKAf2WWSqE9',
        ageRange: userAnswers.ageRange,
        hasCodingExperience: userAnswers.hasCodingExp ? 'Yes' : 'No',
        interest: userAnswers.interest || 'N/A',
        submissionDate: new Date().toISOString(),
        source: 'quiz',
        sendCourseRecommendation: true
    };

    fetch('https://hooks.zapier.com/hooks/catch/19633836/4yreqvu/', {
        method: 'POST',
        body: JSON.stringify(formData)
    }).then(function(response) {
        if (response.ok) {
            trackFacebookLead('quiz_booking');

            // Redirect to results page
            window.location.href = 'quiz-results.html';
        } else {
            throw new Error('Submission failed');
        }
    }).catch(function() {
        $btn.prop('disabled', false);
        $('#quizSubmitText').text('Discover My Child\'s Path');
        $('#quizFormError').text('Something went wrong. Please try again or email hello@headstartcoding.co.uk').show();
    });
}

$('#quizBookingForm').on('submit', function(e) {
    e.preventDefault();

    var parentName = $('#quizParentName').val().trim();
    var parentEmail = $('#quizParentEmail').val().trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset validation
    $('.quiz-form-control').removeClass('is-invalid');
    $('#quizFormError').hide();

    var isValid = true;
    if (!parentName) { $('#quizParentName').addClass('is-invalid'); isValid = false; }
    if (!parentEmail || !emailRegex.test(parentEmail)) { $('#quizParentEmail').addClass('is-invalid'); isValid = false; }

    if (!isValid) {
        $('#quizFormError').show();
        return;
    }

    // Check if privacy consent already given (within 12 months)
    var consent = localStorage.getItem('privacyConsent');
    var consentDate = localStorage.getItem('privacyConsentDate');
    if (consent === 'accepted' && consentDate) {
        var consentTimestamp = new Date(consentDate);
        var twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        if (consentTimestamp > twelveMonthsAgo) {
            submitQuizBooking();
            return;
        }
    }

    // Show privacy modal — submit on accept
    pendingContactAction = { type: 'quiz_booking', submitForm: true };
    privacyModal.fadeIn(300);
    privacyCheckbox.prop('checked', false);
    privacyAcceptBtn.prop('disabled', true);
    $('.privacy-modal-body').scrollTop(0);
});

}

    // Sticky Navbar

    if($('#mobile-indicator').is(':visible')) {
        $('.navbar .navbar-collapse .navbar-nav a').on("click", function() {
            $overlay.toggle(500);
            $navbarCollapse.toggleClass('show');
            $navbarClose.toggle();
        });
        $(window).scroll(function () {
            if ($(this).scrollTop() > 45) {
                $('.navbar').removeClass('sticky-top shadow-sm');
            } else {
                $('.navbar').removeClass('sticky-top shadow-sm');
            }
        });
    } else {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 45) {
                $('.navbar').addClass('sticky-top shadow-sm');
            } else {
                $('.navbar').removeClass('sticky-top shadow-sm');
            }
        });
    }

    //Rotate logo on scroll

    $(document).ready(function(){
        var bodyHeight = $("body").height()-$(window).height();
        window.onscroll = function() {
     
           //Determine the amount to rotate by.
           var deg = window.scrollY*(720/bodyHeight);
     
           $(".sticky-top.navbar-light .logo-color img").css({
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

    //Intro Skills


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