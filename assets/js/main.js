/**
 * main.js
 * ------------------------------------------------------------------
 * Application entry point. Boots the preloader, wires Lenis smooth
 * scrolling into GSAP's ScrollTrigger, handles the sticky navbar
 * state, back-to-top button, footer year and form interactions, then
 * kicks off the cursor / menu / swiper / animation modules.
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Preloader — brand logo, fake progress, GSAP fade out
  --------------------------------------------------------------- */
  function runPreloader(done) {
    var preloader = document.getElementById("preloader");
    var fill = document.getElementById("preloaderFill");
    var percentLabel = document.getElementById("preloaderPercent");

    if (!preloader) return done();

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        gsap.to(fill, { width: "100%", duration: 0.2 });
        gsap.to(percentLabel, {
          innerText: 100,
          duration: 0.2,
          snap: { innerText: 1 },
        });

        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          delay: 0.35,
          onComplete: function () {
            preloader.style.display = "none";
            done();
          },
        });
        return;
      }

      gsap.to(fill, { width: progress + "%", duration: 0.3, ease: "power1.out" });
      gsap.to(percentLabel, {
        innerText: Math.floor(progress),
        duration: 0.3,
        snap: { innerText: 1 },
      });
    }, 220);
  }

  /* ---------------------------------------------------------------
     Lenis smooth scroll, synced with GSAP ticker + ScrollTrigger
  --------------------------------------------------------------- */
  function initLenis() {
    if (typeof Lenis === "undefined") return null;

    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
    });

    lenis.on("scroll", function () {
      if (window.ScrollTrigger) ScrollTrigger.update();
    });

    if (window.gsap) {
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    return lenis;
  }

  /* ---------------------------------------------------------------
     Navbar background state on scroll
  --------------------------------------------------------------- */
  function initNavbarScroll() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;

    function update() {
      if (window.scrollY > 60) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Back-to-top button
  --------------------------------------------------------------- */
  function initBackToTop(lenis) {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 700);
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ---------------------------------------------------------------
     Smooth anchor navigation via Lenis (nav links, footer links, CTAs)
  --------------------------------------------------------------- */
  function initAnchorLinks(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.1, offset: -80 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     Contact form — floating labels driven by real input, validation
  --------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var success = document.getElementById("formSuccess");

    form.querySelectorAll(".form-input").forEach(function (input) {
      input.addEventListener("input", function () {
        input.classList.toggle("has-value", input.value.trim().length > 0);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll(".form-input").forEach(function (input) {
        var error = input.closest(".form-group").querySelector(".form-error");
        var fieldValid = input.checkValidity() && input.value.trim().length > 0;
        if (!fieldValid) valid = false;
        if (error) error.classList.toggle("is-visible", !fieldValid);
      });

      if (!valid) return;

      success.style.opacity = "1";
      form.reset();
      form.querySelectorAll(".form-input").forEach(function (i) {
        i.classList.remove("has-value");
      });

      setTimeout(function () {
        success.style.opacity = "0";
      }, 4000);
    });
  }

  function initNewsletterForm() {
    var form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input");
      if (input) {
        input.placeholder = "Thanks — you're on the list!";
        input.value = "";
      }
      form.reset();
    });
  }

  function setFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     Boot sequence
  --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    setFooterYear();
    initNavbarScroll();
    initContactForm();
    initNewsletterForm();

    if (window.NoirCursor) window.NoirCursor.init();
    if (window.NoirMenu) window.NoirMenu.init();
    if (window.NoirSwiper) window.NoirSwiper.init();

    var lenis = initLenis();
    initBackToTop(lenis);
    initAnchorLinks(lenis);

    if (window.NoirAnimations) window.NoirAnimations.init();

    runPreloader(function () {
      if (window.NoirAnimations) window.NoirAnimations.revealHero();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
})();
