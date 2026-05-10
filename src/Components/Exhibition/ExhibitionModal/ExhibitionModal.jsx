import React, { useLayoutEffect } from "react";
import styles from "./style.module.scss";
import { useRef, useEffect } from "react";
import gsap from "gsap";

function mod(n, m) {
  return ((n % m) + m) % m;
}

const CONFIG = {
  LERP: 0.08,
  OFFSET: 1200,
  SCROLL_MULTIPLIER: 0.6,
  COLS: 12,
  ROWS: 5,
  GAP_X: 400,
  IMAGE_HEIGHT: 350,
  IMAGE_WIDTH: 250,
  DISPLAYED_ELEMENTS: 5,
  ADDED_ELEMENTS: 2,
};

export default function ExhibitionModal({ exhibition }) {
  // used to do the request animation frame.
  const requestRef = useRef();

  const exhibitionExtended = Array.from(
    { length: CONFIG.ADDED_ELEMENTS + exhibition.images.length },
    (_, i) => exhibition.images[i % exhibition.images.length],
  );

  // ref of the images
  const elementRef = useRef([]);
  const pageWidth = useRef(0);
  const positions = useRef([]);
  const gap = useRef(0);

  const canvasDimmensions = useRef(0);

  // ______________________ POSITION GENERATION ______________________//
  useLayoutEffect(() => {
    const updateLayout = () => {
      pageWidth.current = window.innerWidth;
      gap.current = pageWidth.current / CONFIG.DISPLAYED_ELEMENTS;
      canvasDimmensions.current = gap.current * exhibitionExtended.length;
      positions.current = Array.from({ length: exhibitionExtended.length }, (_, i) => ({
        x: i * gap.current,
      }));
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [exhibitionExtended.length]);

  // useLayoutEffect(() => {}, [exhibitionExtended.length]);

  // ______________________ RAF LOOP ______________________//

  useEffect(() => {
    const animate = () => {
      if (canvasDimmensions.current === 0) return;
      for (const [index, el] of elementRef.current.entries()) {
        const pos = positions.current[index];
        if (!el || !pos) continue;

        const moduloX = mod(pos.x, canvasDimmensions.current);

        gsap.set(el, {
          x: moduloX,
          y: 400,
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className={styles.exhibitionModal}>
      {exhibitionExtended.map((_, index) => (
        <ExhibitionModalElement key={index} index={index} elementRef={elementRef} />
      ))}
    </div>
  );
}

function ExhibitionModalElement({ index, elementRef }) {
  return (
    <div className={styles.exhibitionModalElement} ref={(el) => (elementRef.current[index] = el)}>
      aaaa
    </div>
  );
}
