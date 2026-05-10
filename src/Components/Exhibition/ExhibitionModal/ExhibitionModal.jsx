import React, { use, useLayoutEffect } from "react";
import styles from "./style.module.scss";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { data_exhibition } from "@/data/data_exhibition";
import { canvas } from "framer-motion/client";

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
  DISPLAYED_ELEMENTS: 6,
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
    pageWidth.current = window.innerWidth;
    gap.current = pageWidth.current / CONFIG.DISPLAYED_ELEMENTS;
    console.log("pageWidth", pageWidth.current);
    canvasDimmensions.current = gap.current * exhibitionExtended.length;
    positions.current = Array.from({ length: exhibitionExtended.length }, (_, i) => ({
      x: i * gap.current,
    }));
  }, [exhibitionExtended.length]);

  // useLayoutEffect(() => {}, [exhibitionExtended.length]);

  // ______________________ RAF LOOP ______________________//

  useEffect(() => {
    const animate = () => {
      if (canvasDimmensions.current === 0) return;
      for (const [index, el] of elementRef.current.entries()) {
        const pos = positions.current[index];
        if (!el || !pos) continue;

        const moduloX =
          mod(pos.x + canvasDimmensions.current / 2, canvasDimmensions.current) -
          canvasDimmensions.current / 2;

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
