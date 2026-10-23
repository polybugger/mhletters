// One gesture = one beat. A trackpad flick fires wheel events for a second or
// more of inertia; counting each event would race through the story, which is
// the skipping problem the scroll-scrubbed version had. So a gesture is armed
// only after the wheel has been quiet for a moment, fires once, then waits for
// quiet again. Touch swipes, keys and taps map to the same two calls.
export function bindInput({ next, prev, isBusy }) {
  const QUIET = 240;        // ms of wheel silence that ends a gesture
  const THRESHOLD = 30;     // wheel delta needed to count as intent
  let armed = true, acc = 0, last = 0;

  addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = performance.now();
    if (now - last > QUIET) { armed = true; acc = 0; }
    last = now;
    if (!armed || isBusy()) return;
    acc += e.deltaY;
    if (Math.abs(acc) >= THRESHOLD) {
      armed = false;
      acc > 0 ? next() : prev();
    }
  }, { passive: false });

  let y0 = null, x0 = null, t0 = 0, lastTouch = 0;
  addEventListener('touchstart', (e) => {
    if (e.target.closest('button, a, .menu')) return;
    y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; t0 = performance.now();
  }, { passive: true });
  addEventListener('touchmove', (e) => { if (y0 !== null) e.preventDefault(); }, { passive: false });
  addEventListener('touchend', (e) => {
    if (y0 === null) return;
    lastTouch = performance.now();
    const t = e.changedTouches[0];
    const dy = y0 - t.clientY, dx = x0 - t.clientX;
    const quick = performance.now() - t0 < 600;
    y0 = null;
    if (isBusy()) return;
    if (Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(dx)) dy > 0 ? next() : prev();
    else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && quick) next();     // tap
  });

  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault(); if (!isBusy()) next();
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault(); if (!isBusy()) prev();
    }
  });

  addEventListener('click', (e) => {
    if (e.target.closest('button, a, .menu')) return;
    // a tap also fires a click; touchend already handled it
    if (e.pointerType === 'touch' || performance.now() - lastTouch < 800) return;
    if (!isBusy()) next();
  });
}
