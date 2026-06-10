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
  GAP: 300,
  EXTRA_GAP: 150,
  MAX_SCALE: 1.8,
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
  const targetPositions = useRef([]);
  const elementID = useRef([]);
  const scaleRef = useRef([]);
  const currentShift = useRef(0);

  const gap = useRef(0);

  const canvasDimmensions = useRef(0);

  // ______________________ POSITION GENERATION ______________________//
  useLayoutEffect(() => {
    const updateLayout = () => {
      pageWidth.current = window.innerWidth;
      pageCenter.current = pageWidth.current / 2;

      gap.current = CONFIG.GAP;

      canvasDimmensions.current = gap.current * exhibitionExtended.length + CONFIG.EXTRA_GAP * 2;
      console.log("canvasDimmensions", canvasDimmensions.current);

      // positions.current = Array.from({ length: exhibitionExtended.length }, (_, i) => ({
      //   x:
      //     i === 3
      //       ? i * gap.current + gap.current + gap.current / 2
      //       : i > 3
      //         ? i * gap.current + 2 * gap.current + gap.current / 2
      //         : i * gap.current + gap.current / 2,
      // }));
      positions.current = [
        { x: -1050, id: 0 },
        { x: -750, id: 1 },
        { x: -450, id: 2 },
        { x: 0, id: 3 },
        { x: 450, id: 4 },
        { x: 750, id: 5 },
        { x: 1050, id: 6 },
      ];

      targetPositions.current = positions.current.map((pos) => ({ ...pos, x: pos.x }));
      console.log("initial positions", positions.current);
      console.log("initial positions with targetX", targetPositions.current);

      scaleRef.current = Array.from({ length: exhibitionExtended.length }, () => ({ value: 1 }));

      console.log("positions", positions.current);
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
        const scale = scaleRef.current[index];

        if (!el || !pos) continue;

        pos.x = lerp(pos.x, pos.targetX ?? pos.x, CONFIG.LERP);
        // pos.y = lerp(pos.y, pos.targetY ?? pos.y, CONFIG.LERP);

        const moduloX =
          mod(pos.x + canvasDimmensions.current / 2, canvasDimmensions.current) -
          canvasDimmensions.current / 2;

        if (moduloX > -200 && moduloX < 200) {
          // console.log("visible", index);
          scale.value = lerp(scale.value, CONFIG.MAX_SCALE, CONFIG.LERP);
        } else {
          scale.value = lerp(scale.value, 1, CONFIG.LERP);
        }

        gsap.set(el, {
          x: moduloX + pageCenter.current,
          y: 400,
          xPercent: -50,
          scale: scale.value,
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  function shortestWrappedTarget(current, target, width) {
    // Calculate the shortest distance between current and target, considering wrapping
    // This ensures that the animation takes the shortest path, even if it means wrapping around the edges
    // For example, if current is near the right edge and target is near the left edge, it will wrap around instead of going all the way across
    let delta = target - current;

    if (delta > width / 2) {
      target -= width;
    } else if (delta < -width / 2) {
      target += width;
    }

    return target;
  }

  const handleClick = (index) => {
    const pos = positions.current[index];
    let isRightClick = false;

    if (pos.id === 3) return;

    if (pos.id > 3) {
      currentShift.current = currentShift.current - 1;
      isRightClick = true;
    }

    if (pos.id < 3) {
      currentShift.current = currentShift.current + 1;
      isRightClick = false;
    }

    const visualX =
      mod(pos.x + canvasDimmensions.current / 2, canvasDimmensions.current) -
      canvasDimmensions.current / 2;

    console.log("clicked element id", index);

    for (let i = 0; i < positions.current.length; i++) {
      const temp = positions.current[i];

      temp.id = mod(temp.id + (isRightClick ? -1 : 1), exhibitionExtended.length);

      let targetIndex = mod(i + currentShift.current, exhibitionExtended.length);

      let targetPosition = targetPositions.current[targetIndex];

      temp.targetX = shortestWrappedTarget(temp.x, targetPosition.x, canvasDimmensions.current);

      console.log("target index", targetIndex);
      console.log("target position", targetPosition);
    }

    console.log("positions after click", positions.current);
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
