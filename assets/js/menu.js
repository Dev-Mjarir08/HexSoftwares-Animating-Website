/**
 * menu.js
 * ------------------------------------------------------------------
 * Unique mobile navigation: a morphing hamburger icon that triggers a
 * circular clip-path reveal (not an ordinary slide-in drawer), with a
 * GSAP stagger on the menu links and social icons.
 * Exposes: window.NoirMenu.init()
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  function init() {
    var btn = document.getElementById("hamburgerBtn");
    var menu = document.getElementById("mobileMenu");
    var links = menu ? menu.querySelectorAll(".menu-link") : [];
    var socials = document.getElementById("mobileMenuSocials");
    var isOpen = false;

    if (!btn || !menu) return;

    function openMenu() {
      isOpen = true;
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      gsap.to(menu, {
        clipPath: "circle(150% at 92% 4%)",
        duration: 0.9,
        ease: "power4.inOut",
      });

      gsap.to(links, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.35,
        ease: "power3.out",
      });

      if (socials) {
        gsap.to(socials, { opacity: 1, duration: 0.6, delay: 0.7 });
      }
    }

    function closeMenu() {
      isOpen = false;
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";

      gsap.to(menu, {
        clipPath: "circle(0% at 92% 4%)",
        duration: 0.7,
        ease: "power4.inOut",
      });

      gsap.set(links, { y: 40, opacity: 0 });
      if (socials) gsap.set(socials, { opacity: 0 });
    }

    btn.addEventListener("click", function () {
      isOpen ? closeMenu() : openMenu();
    });

    links.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && isOpen) closeMenu();
    });

    // Escape key closes the menu.
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) closeMenu();
    });
  }

  window.NoirMenu = { init: init };
})();
