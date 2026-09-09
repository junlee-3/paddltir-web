/* ═══════════════════════════════════════════
   CrewCoach Landing Page — Interactions
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Scroll-reveal via IntersectionObserver ── */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ── Nav shadow on scroll ── */
  function initNavShadow() {
    const nav = document.getElementById("nav");
    if (!nav) return;

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          nav.classList.toggle("nav--scrolled", window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Mobile menu toggle ── */
  function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("mobileMenu");
    if (!hamburger || !menu) return;

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      menu.classList.toggle("open");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        menu.classList.remove("open");
      });
    });
  }

  /* ── Smooth scroll for anchor links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--nav-h")
            .trim()
        );
        const y =
          target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* ── Subtle parallax float on hero mockup ── */
  function initHeroParallax() {
    const visual = document.querySelector(".hero__visual");
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = visual.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const vh = window.innerHeight;
          const offset = ((center - vh / 2) / vh) * -18;
          visual.style.transform = "translateY(" + offset + "px)";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Lucide icons init ── */
  function initIcons() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  /* ── Boot ── */
  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initNavShadow();
    initMobileMenu();
    initSmoothScroll();
    initHeroParallax();
    initIcons();
  });
})();
