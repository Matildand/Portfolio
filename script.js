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
});
