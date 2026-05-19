const tracks = document.querySelectorAll(".carousel-track");

tracks.forEach((track) => {
  // 1. Clone the items to double the track length
  const originalItems = Array.from(track.children);
  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  // 2. Center the scroll position on page load
  // This gives the user immediate room to scroll backward (left) right away
  function setInitialScroll() {
    track.scrollLeft = track.scrollWidth / 2;
  }

  window.addEventListener("load", setInitialScroll);
  setInitialScroll(); // Instant fallback call

  // 3. Convert Wheel Movement into a Seamless Mathematical Loop
  track.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const halfWidth = track.scrollWidth / 2;
      // Calculate where the user *wants* to go
      let targetScroll = track.scrollLeft + e.deltaY;

      // If they wheel past the right edge, instantly warp them back to the left half
      if (targetScroll >= halfWidth) {
        targetScroll -= halfWidth;
      }
      // If they wheel past the left edge, instantly warp them to the right half
      else if (targetScroll <= 0) {
        targetScroll += halfWidth;
      }

      // Apply the perfectly calculated position
      track.scrollLeft = targetScroll;
    },
    { passive: false },
  );

  // 4. Safety Trackpad / Swipe Support
  // If a user swipes with a trackpad or mobile screen instead of a mouse wheel,
  // this keeps the loop seamless for them too.
  track.addEventListener("scroll", () => {
    const halfWidth = track.scrollWidth / 2;

    if (track.scrollLeft >= halfWidth * 1.5) {
      track.scrollLeft -= halfWidth;
    } else if (track.scrollLeft <= halfWidth * 0.1) {
      track.scrollLeft += halfWidth;
    }
  });
});
