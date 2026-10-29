import { useRef, useEffect } from "react";

export function useCardDeckSwipe(cardsRef, totalCards) {
  const progressRef = useRef(0);

  useEffect(() => {
    let ticking = false;
    let snapRAF = null;
    let snapTimeout = null;

    // Drag state
    let isDragging = false;
    let dragStartY = 0;
    let dragStartProgress = 0;

    // Optimization state
    const hiddenState = new Array(totalCards).fill(true);

    // Velocity tracking
    let lastEventY = 0;
    let lastEventTime = 0;
    let velocity = 0;

    const N = totalCards;

    const updateCards = () => {
      const p = progressRef.current;
      const VISIBLE_CARDS = 8;

      cardsRef.current.forEach((el, idx) => {
        if (!el) return;

        const v = idx - p;

        let zIndex = 0;
        let scale = 1;
        let opacity;
        let transformY = 0;
        let rotate = 0;

        if (v < 0) {
          const peel = -v;
          zIndex = 1000 + idx;
          scale = 1 + peel * 0.5;
          transformY = -(peel * 600);
          const angleDir = idx % 2 === 0 ? -1 : 1;
          rotate = peel * 12 * angleDir;
          opacity = Math.max(0, 1 - peel);
        } else if (v <= VISIBLE_CARDS) {
          zIndex = 40 - idx;
          scale = 1 - v * 0.05;
          transformY = -(v * 30);
          rotate = 0;

          if (v > VISIBLE_CARDS - 1) {
            opacity = Math.max(0, VISIBLE_CARDS - v);
          } else {
            opacity = 1;
          }
        } else {
          opacity = 0;
        }

        // Buffer: 2 cards behind (peeled), 4 cards ahead (stack)
        const isWarm = v >= -2 && v <= VISIBLE_CARDS + 4;

        if (!isWarm) {
          if (!hiddenState[idx]) {
            el.style.visibility = "hidden";
            el.style.willChange = "auto";
            el.style.pointerEvents = "none";
            hiddenState[idx] = true;
          }
          return;
        }

        if (hiddenState[idx]) {
          el.style.visibility = "visible";
          el.style.willChange = "transform, opacity";
          hiddenState[idx] = false;
        }

        el.style.transform = `translate3d(0, ${transformY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
        el.style.opacity = opacity.toString();
        el.style.zIndex = zIndex.toString();
        el.style.pointerEvents = opacity <= 0.01 ? "none" : "auto";
      });

      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateCards);
        ticking = true;
      }
    };

    // Smooth snap to nearest integer progress
    const snapTo = (target) => {
      if (snapRAF) cancelAnimationFrame(snapRAF);
      const start = progressRef.current;
      const distance = target - start;
      const startTime = performance.now();
      const duration = 250;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let p = start + distance * easeOut(progress);
        p = Math.max(0, Math.min(N - 1, p));
        progressRef.current = p;
        requestUpdate();
        if (progress < 1) {
          snapRAF = window.requestAnimationFrame(animate);
        } else {
          progressRef.current = target;
          snapRAF = null;
          requestUpdate();
        }
      };

      snapRAF = window.requestAnimationFrame(animate);
    };

    const doSnap = () => {
      let target =
        velocity > 0
          ? Math.ceil(progressRef.current)
          : Math.floor(progressRef.current);

      target = Math.max(0, Math.min(N - 1, target));

      if (Math.abs(progressRef.current - target) > 0.01) {
        snapTo(target);
      }
      velocity = 0;
    };

    const scheduleSnap = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(doSnap, 150);
    };

    // Pointer events (mouse + touch via pointer API)
    const onPointerDown = (e) => {
      if (snapRAF) {
        cancelAnimationFrame(snapRAF);
        snapRAF = null;
      }
      isDragging = true;
      dragStartY = e.clientY;
      dragStartProgress = progressRef.current;
      lastEventY = e.clientY;
      lastEventTime = performance.now();
      velocity = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dy = e.clientY - dragStartY;
      // 250px drag = 1 card step; negative = scroll forward (next card)
      let p = dragStartProgress - dy / 250;
      p = Math.max(0, Math.min(N - 1, p));
      progressRef.current = p;
      requestUpdate();

      const now = performance.now();
      const dt = now - lastEventTime;
      if (dt > 0) {
        velocity = (lastEventY - e.clientY) / dt; // px/ms, positive = drag up = next card
      }
      lastEventY = e.clientY;
      lastEventTime = now;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      if (snapTimeout) clearTimeout(snapTimeout);
      doSnap();
    };

    // Wheel (desktop scroll)
    const onWheel = (e) => {
      e.preventDefault();
      if (snapRAF) {
        cancelAnimationFrame(snapRAF);
        snapRAF = null;
      }
      let p = progressRef.current + e.deltaY / 600;
      p = Math.max(0, Math.min(N - 1, p));
      progressRef.current = p;
      velocity = e.deltaY > 0 ? 1 : -1;
      requestUpdate();
      scheduleSnap();
    };

    // Keyboard (arrows)
    const onKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const target = Math.max(
          0,
          Math.min(N - 1, Math.round(progressRef.current) - 1)
        );
        snapTo(target);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const target = Math.max(
          0,
          Math.min(N - 1, Math.round(progressRef.current) + 1)
        );
        snapTo(target);
      }
    };

    const container = document.getElementById("kaicards-container");
    if (container) {
      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove, {
        passive: false,
      });
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("wheel", onWheel, { passive: false });
    }
    window.addEventListener("keydown", onKeyDown);

    // Initial paint
    updateCards();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (container) {
        container.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerup", onPointerUp);
        container.removeEventListener("pointercancel", onPointerUp);
        container.removeEventListener("wheel", onWheel);
      }
      if (snapTimeout) clearTimeout(snapTimeout);
      if (snapRAF) cancelAnimationFrame(snapRAF);
    };
  }, [cardsRef, totalCards]);

  return { progressRef };
}
