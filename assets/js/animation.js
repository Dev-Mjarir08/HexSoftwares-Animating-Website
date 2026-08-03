/**
 * animation.js
 * ------------------------------------------------------------------
 * All GSAP / ScrollTrigger / SplitType driven motion for the site:
 * hero text reveal + infinite typing loop, mouse parallax, generic
 * scroll reveals, magnetic buttons, 3D card tilt, the sticky
 * horizontal "Featured Collection" pin, the tree-branch about
 * timeline, animated counters, infinite marquees and the ripple
 * click effect. Everything is namespaced under window.NoirAnimations.
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  var TYPING_WORDS = [
    "Luxury",
    "Minimal",
    "Streetwear",
    "Modern",
    "Timeless",
    "Premium",
  ];

  /* ---------------------------------------------------------------
     Hero GSAP Master Timeline — call once preloader ends
     Sequence: Navbar -> Luxury Label -> Heading -> Subtitle -> Description -> Buttons -> Marquee -> Background Glow
  --------------------------------------------------------------- */
  function revealHero() {
    var navbar = document.getElementById("navbar");
    var label = document.querySelector("[data-hero-label]");
    var heading = document.querySelector("[data-split-hero]");
    var subtitle = document.querySelector("[data-hero-subtitle]");
    var desc = document.querySelector("[data-hero-desc]");
    var btns = document.querySelectorAll("[data-hero-btns] > *");
    var marquee = document.querySelector("[data-hero-marquee]");
    var glow = document.querySelector(".hero-ambient-glow");
    var scrollInd = document.querySelector(".scroll-indicator");

    var tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // 1. Navbar
    if (navbar) {
      tl.fromTo(navbar, { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
    }

    // 2. Luxury Label
    if (label) {
      tl.fromTo(label, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");
    }

    // 3. Heading (SplitType letter reveal with stagger)
    if (heading && typeof SplitType !== "undefined") {
      var split = new SplitType(heading, { types: "chars, words" });
      gsap.set(split.chars, { yPercent: 125, opacity: 0, rotateX: -35 });
      tl.to(
        split.chars,
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.028,
        },
        "-=0.35"
      );
    }

    // 4. Animated Subtitle
    if (subtitle) {
      tl.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.45");
    }

    // 5. Description
    if (desc) {
      tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");
    }

    // 6. Buttons
    if (btns && btns.length) {
      tl.fromTo(btns, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.15 }, "-=0.4");
    }

    // 7. Marquee
    if (marquee) {
      tl.fromTo(marquee, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3");
    }

    // 8. Background Glow & Scroll Indicator
    if (glow) {
      tl.fromTo(glow, { opacity: 0, scale: 0.85 }, { opacity: 0.65, scale: 1, duration: 1.4, ease: "power2.out" }, "-=0.8");
    }
    if (scrollInd) {
      tl.fromTo(scrollInd, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=1.0");
    }

    startTypingLoop();
    initHeroParticles();
  }

  /* ---------------------------------------------------------------
     Infinite typing / deleting loop for the rotating hero word
  --------------------------------------------------------------- */
  function startTypingLoop() {
    var el = document.querySelector("[data-typing-target]");
    if (!el) return;

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var word = TYPING_WORDS[wordIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          return setTimeout(tick, 1400);
        }
        return setTimeout(tick, 90);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % TYPING_WORDS.length;
          return setTimeout(tick, 400);
        }
        return setTimeout(tick, 45);
      }
    }

    tick();
  }

  /* ---------------------------------------------------------------
     Mouse parallax on hero background shapes
  --------------------------------------------------------------- */
  function initParallax() {
    var shapes = gsap.utils.toArray("[data-parallax]");
    if (!shapes.length) return;

    window.addEventListener("mousemove", function (e) {
      var xRatio = e.clientX / window.innerWidth - 0.5;
      var yRatio = e.clientY / window.innerHeight - 0.5;

      shapes.forEach(function (shape) {
        var depth = parseFloat(shape.getAttribute("data-parallax")) || 0.05;
        gsap.to(shape, {
          x: xRatio * depth * 400,
          y: yRatio * depth * 400,
          duration: 1.2,
          ease: "power2.out",
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     Generic scroll reveals: fade/scale/rotate/clip-path
  --------------------------------------------------------------- */
  function initScrollReveals() {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest("#hero")) return; // hero handled separately
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    gsap.utils.toArray("[data-reveal-card]").forEach(function (el, i) {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0, rotate: -2 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          delay: (i % 4) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        }
      );
    });

    gsap.utils.toArray("[data-reveal-clip]").forEach(function (el, i) {
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          delay: (i % 4) * 0.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: el, start: "top 92%" },
        }
      );
    });
  }

  /* ---------------------------------------------------------------
     Magnetic buttons — cursor-follow translate within bounds
  --------------------------------------------------------------- */
  function initMagneticButtons() {
    gsap.utils.toArray("[data-magnetic]").forEach(function (btn) {
      var strength = 0.4;

      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: relX * strength,
          y: relY * strength,
          duration: 0.4,
          ease: "power3.out",
        });
      });

      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ---------------------------------------------------------------
     3D tilt on Featured Collection cards
  --------------------------------------------------------------- */
  function initTiltCards() {
    gsap.utils.toArray("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: px * 10,
          rotateX: py * -10,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 800,
        });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
      });
    });
  }

  /* ---------------------------------------------------------------
     Featured Collection — sticky horizontal scroll (pin + translateX)
  --------------------------------------------------------------- */
  function initHorizontalScroll() {
    var track = document.getElementById("horizontalTrack");
    var pinWrap = document.querySelector(".pin-wrap");
    if (!track || !pinWrap) return;

    function build() {
      var distance = track.scrollWidth - window.innerWidth + 120;
      if (distance <= 0) return null;

      return gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: "+=" + distance,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    var tween = build();
    window.addEventListener("resize", function () {
      if (tween) tween.scrollTrigger.kill();
      gsap.set(track, { x: 0 });
      tween = build();
      ScrollTrigger.refresh();
    });
  }

  /* ---------------------------------------------------------------
     Tree-branch About timeline — trunk grows, branches draw, leaves
     appear, cards fade in as the user scrolls (looks like a tree
     growing upward through the section).
  --------------------------------------------------------------- */
  function initTreeBranch() {
    var wrap = document.getElementById("treeWrap");
    var trunkFill = document.getElementById("trunkFill");
    if (!wrap || !trunkFill) return;

    gsap.to(trunkFill, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top 70%",
        end: "bottom 60%",
        scrub: true,
      },
    });

    gsap.utils.toArray("[data-branch]").forEach(function (row) {
      var line = row.querySelector("[data-branch-line]");
      var lineFill = row.querySelector(".branch-line-fill");
      var node = row.querySelector(".branch-node");
      var card = row.querySelector("[data-branch-card]");

      var tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: "top 75%" },
      });

      if (line) {
        tl.to(line, { width: "8%", duration: 0.5, ease: "power2.out" });
      }
      if (node) {
        tl.to(node, { scale: 1, duration: 0.4, ease: "back.out(3)" }, "-=0.2");
      }
      if (lineFill) {
        tl.to(lineFill, { width: "100%", duration: 0.5, ease: "power2.out" }, "-=0.3");
      }
      if (card) {
        tl.fromTo(
          card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.2"
        );
      }

      // Little leaf accents blooming near the node.
      for (var i = 0; i < 3; i++) {
        var leaf = document.createElement("span");
        leaf.className = "branch-leaf";
        leaf.style.left = "calc(50% + " + (i - 1) * 14 + "px)";
        leaf.style.top = "calc(50% - " + (10 + i * 6) + "px)";
        row.appendChild(leaf);
        tl.to(
          leaf,
          { opacity: 1, scale: 1.4, duration: 0.4, ease: "back.out(2)" },
          "-=0.35"
        );
      }
    });
  }

  /* ---------------------------------------------------------------
     Animated counters (Why Choose Us stats)
  --------------------------------------------------------------- */
  function initCounters() {
    gsap.utils.toArray("[data-counter]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-counter")) || 0;
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            innerText: target,
            duration: 1.6,
            ease: "power2.out",
            snap: { innerText: 1 },
          });
        },
      });
    });
  }

  /* ---------------------------------------------------------------
     Floating light particles system for Hero background
  --------------------------------------------------------------- */
  function initHeroParticles() {
    var canvas = document.getElementById("heroParticlesCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var width, height;
    var particles = [];
    var particleCount = 45;

    function resize() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        vy: -(Math.random() * 0.4 + 0.15),
        vx: (Math.random() - 0.5) * 0.25,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.vy;
        p.x += p.vx;
        p.pulse += 0.025;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        var currentAlpha = p.alpha + Math.sin(p.pulse) * 0.2;
        if (currentAlpha < 0) currentAlpha = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 169, 106, " + currentAlpha + ")";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(200, 169, 106, 0.7)";
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ---------------------------------------------------------------
     Infinite marquee strips (duplicated content, looped translateX)
  --------------------------------------------------------------- */
  function initMarquees() {
    ["marqueeTrack1", "marqueeTrack2", "heroMarqueeTrack"].forEach(function (id) {
      var track = document.getElementById(id);
      if (!track) return;
      var reverse = track.style.animationDirection === "reverse";
      var width = track.scrollWidth / 2;

      gsap.to(track, {
        x: reverse ? width : -width,
        duration: id === "heroMarqueeTrack" ? 18 : 22,
        ease: "none",
        repeat: -1,
      });
    });
  }

  /* ---------------------------------------------------------------
     Ripple click effect for .btn-ripple
  --------------------------------------------------------------- */
  function initRipple() {
    document.querySelectorAll(".btn-ripple").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement("span");
        var size = Math.max(rect.width, rect.height);
        ripple.className = "ripple-el";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(ripple);
        setTimeout(function () {
          ripple.remove();
        }, 650);
      });
    });
  }

  function init() {
    initParallax();
    initScrollReveals();
    initMagneticButtons();
    initTiltCards();
    initHorizontalScroll();
    initTreeBranch();
    initCounters();
    initMarquees();
    initRipple();
  }

  window.NoirAnimations = { init: init, revealHero: revealHero, initHeroParticles: initHeroParticles };
})();
