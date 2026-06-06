import React, { useLayoutEffect } from "react";
import styles from "./style.module.scss";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

function mod(n, m) {
  return ((n % m) + m) % m;
}

const CONFIG = {
  DISPLAYED_ELEMENTS: 3,
  ADDED_ELEMENTS: 2,
  LERP: 0.08,
};

export default function ExhibitionModal({ exhibition }) {
  // used to do the request animation frame.
  const requestRef = useRef();

  const exhibitionExtended = Array.from(
    { length: CONFIG.ADDED_ELEMENTS + exhibition.images.length },
    (_, i) => exhibition.images[i % exhibition.images.length],
  );

  console.log("exhibitionExtended", exhibitionExtended);

  // ref of the images
  const elementRef = useRef([]);
  const pageWidth = useRef(0);
  const pageCenter = useRef(0);
  const positions = useRef([]);
  const gap = useRef(0);

  const canvasDimmensions = useRef(0);

  // ______________________ POSITION GENERATION ______________________//
  useLayoutEffect(() => {
    const updateLayout = () => {
      pageWidth.current = window.innerWidth;
      pageCenter.current = pageWidth.current / 2;
      gap.current = pageWidth.current / CONFIG.DISPLAYED_ELEMENTS;
      canvasDimmensions.current = gap.current * exhibitionExtended.length;
      positions.current = Array.from({ length: exhibitionExtended.length }, (_, i) => ({
        x: i * gap.current,
        // x: i * gap.current + pageCenter.current - canvasDimmensions.current / 2,
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
  const lerp = (start, end, t) => start + (end - start) * t;

  useEffect(() => {
    const animate = () => {
      if (canvasDimmensions.current === 0) return;
      for (const [index, el] of elementRef.current.entries()) {
        const pos = positions.current[index];
        if (!el || !pos) continue;

        pos.x = lerp(pos.x, pos.targetX ?? pos.x, CONFIG.LERP);
        pos.y = lerp(pos.y, pos.targetY ?? pos.y, CONFIG.LERP);

        const moduloX =
          mod(pos.x + canvasDimmensions.current / 2, canvasDimmensions.current) -
          canvasDimmensions.current / 2;

        gsap.set(el, { x: moduloX + pageCenter.current, y: 400 });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handleClick = (index) => {
    const pos = positions.current[index];

    // Position visuelle de l'élément (même calcul que dans le RAF)
    const visualX =
      mod(pos.x + canvasDimmensions.current / 2, canvasDimmensions.current) -
      canvasDimmensions.current / 2;

    // On veut que visualX + pageCenter soit égal à pageCenter (le centre de l'écran)
    // Donc diff = -visualX
    const diff = -visualX;

    for (let i = 0; i < positions.current.length; i++) {
      const temp = positions.current[i];
      temp.targetX = (temp.targetX ?? temp.x) + diff;
    }
  };

  return (
    <div className={styles.exhibitionModal}>
      {exhibitionExtended.map((image, index) => (
        <ExhibitionModalElement
          key={index}
          index={index}
          src={image.src}
          elementRef={elementRef}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
}

function ExhibitionModalElement({ index, src, elementRef, handleClick }) {
  useEffect(() => {
    // console.log(" position", elementRef.current.positions);
  }, []);

  return (
    <div
      onClick={() => handleClick(index)}
      className={styles.exhibitionModalElement}
      ref={(el) => (elementRef.current[index] = el)}
    >
      <Image src={src} alt={`Exhibition image ${index}`} layout="fill" objectFit="cover" />
    </div>
  );
}
