/* ============================================================
   1. Infinite carousel (your original loop logic)
   Additions: only the middle copy of the cards can be tabbed to
   with the keyboard, and the arrow buttons scroll one card.
   ============================================================ */
const tracks = document.querySelectorAll(".carousel-track");

tracks.forEach((track) => {
  // 1. Multiply the track heavily (16 sets total: 1 original + 15 clones)
  // This guarantees a massive invisible scroll runway, solving the 1200px container limit.
  // Because 16 is an even number, the math cuts perfectly between item sets.
  const originalItems = Array.from(track.children);

  for (let i = 0; i < 15; i++) {
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

  // Keyboard: with 16 copies of every card, tabbing would mean dozens of
  // duplicate stops. Only the set that starts at the initial scroll position
  // (set 8, the middle one) stays tabbable; the rest are skipped by keyboard
  // and hidden from screen readers. They are still clickable.
  const setSize = originalItems.length;
  const tabbableSet = 8;
  Array.from(track.children).forEach((item, index) => {
    if (Math.floor(index / setSize) !== tabbableSet) {
      item.setAttribute("tabindex", "-1");
      item.setAttribute("aria-hidden", "true");
    }
  });

  // 2. Center the scroll position deep inside the massive track
  function setInitialScroll() {
    track.scrollLeft = track.scrollWidth / 2;
  }
  window.addEventListener("load", setInitialScroll);
  setInitialScroll(); // Instant fallback call

  // 3. Mouse Wheel Loop Logic
  track.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const halfWidth = track.scrollWidth / 2;
      let targetScroll = track.scrollLeft + e.deltaY;

      // If user crosses the 75% mark, warp them seamlessly back to the 25% mark
      if (targetScroll >= halfWidth * 1.5) {
        targetScroll -= halfWidth;
      }
      // If user crosses the 25% mark, warp them seamlessly forward to the 75% mark
      else if (targetScroll <= halfWidth * 0.5) {
        targetScroll += halfWidth;
      }

      track.scrollLeft = targetScroll;
    },
    { passive: false },
  );

  // 4. Safety Trackpad / Swipe Support
  // This uses the exact same 25% / 75% boundary logic as the wheel.
  // Because the track is so long, you'll never hit the hard browser edge before warping.
  track.addEventListener("scroll", () => {
    const halfWidth = track.scrollWidth / 2;

    if (track.scrollLeft >= halfWidth * 1.5) {
      track.scrollLeft -= halfWidth;
    } else if (track.scrollLeft <= halfWidth * 0.5) {
      track.scrollLeft += halfWidth;
    }
  });

  // 5. Arrow buttons: scroll one card left or right
  const shell = track.closest(".work-carousel-container");
  if (shell) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function scrollByCard(direction) {
      const card = track.querySelector(".carousel-item-link");
      const step = card ? card.getBoundingClientRect().width : 300;
      track.scrollBy({
        left: direction * step,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    const prev = shell.querySelector(".carousel-btn.prev");
    const next = shell.querySelector(".carousel-btn.next");
    if (prev) prev.addEventListener("click", () => scrollByCard(-1));
    if (next) next.addEventListener("click", () => scrollByCard(1));
  }
});

/* ============================================================
   2. Mobile menu toggle
   ============================================================ */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", () => {
    setOpen(!links.classList.contains("open"));
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();

/* ============================================================
   3. Gentle scroll reveal
   Things fade up softly as they enter the viewport. Anything
   already on screen at load is left alone, and it's skipped
   entirely for people who prefer reduced motion.
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const targets = document.querySelectorAll(
    ".about-flex, .showreel-head, .showreel-band .window, .work-header, " +
      ".work-carousel-container, .works-text, .workscontainer-img, " +
      ".workscontainer-vid, .contact-info",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  targets.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    observer.observe(el);
  });
})();
