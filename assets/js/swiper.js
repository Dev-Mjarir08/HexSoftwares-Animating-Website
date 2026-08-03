/**
 * swiper.js
 * ------------------------------------------------------------------
 * Testimonials slider powered by Swiper.js — autoplay, custom
 * prev/next buttons and a GSAP-driven progress bar synced to
 * autoplay timing.
 * Exposes: window.NoirSwiper.init()
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  function init() {
    var el = document.querySelector(".testimonial-swiper");
    var progressFill = document.getElementById("testimonialProgress");
    if (!el || typeof Swiper === "undefined") return;

    var AUTOPLAY_DELAY = 5000;

    var swiper = new Swiper(el, {
      loop: true,
      speed: 700,
      autoplay: {
        delay: AUTOPLAY_DELAY,
        disableOnInteraction: false,
      },
      effect: "slide",
      grabCursor: true,
      navigation: {
        nextEl: ".testimonial-next",
        prevEl: ".testimonial-prev",
      },
      on: {
        autoplayTimeLeft: function (s, time, progress) {
          if (progressFill) {
            gsap.set(progressFill, { width: (1 - progress) * 100 + "%" });
          }
        },
        slideChangeTransitionStart: function () {
          if (progressFill) gsap.set(progressFill, { width: "0%" });
        },
      },
    });

    return swiper;
  }

  window.NoirSwiper = { init: init };
})();
