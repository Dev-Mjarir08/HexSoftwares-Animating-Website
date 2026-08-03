/**
 * cursor.js
 * ------------------------------------------------------------------
 * Custom cursor: a small dot that snaps to the pointer instantly and a
 * larger ring that trails behind it with GSAP easing. The ring expands
 * over images, shows a "View" label over card elements, and morphs into
 * a solid filled pointer over links/buttons.
 * Exposes: window.NoirCursor.init()
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  function init() {
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");

    // Skip entirely on touch/coarse-pointer devices.
    if (!dot || !ring || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX;
    var ringY = mouseY;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    });

    // Smooth trailing ring using a GSAP ticker loop (cheaper than many tweens).
    gsap.ticker.add(function () {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      gsap.set(ring, { x: ringX, y: ringY });
    });

    document.addEventListener("mouseover", function (e) {
      var target = e.target.closest("[data-cursor]");
      if (!target) return;
      var type = target.getAttribute("data-cursor");

      if (type === "link") {
        ring.classList.add("is-hover-link");
      } else if (type === "media") {
        ring.classList.add("is-hover-media");
        if (
          target.classList.contains("collection-card") ||
          target.classList.contains("showcase-item")
        ) {
          ring.classList.add("is-view");
        }
      }
    });

    document.addEventListener("mouseout", function (e) {
      var target = e.target.closest("[data-cursor]");
      if (!target) return;
      ring.classList.remove("is-hover-link", "is-hover-media", "is-view");
    });

    // Hide the native-replacement cursor when the pointer leaves the window.
    document.addEventListener("mouseleave", function () {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener("mouseenter", function () {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    });
  }

  window.NoirCursor = { init: init };
})();
