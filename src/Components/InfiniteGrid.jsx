import React, { useEffect } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { imageList } from "@/data/data";
import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ReactLenis, useLenis } from "lenis/react";
// InfiniteGrid.jsx
function mod(n, m) {
  return ((n % m) + m) % m;
}

const CONFIG = {
  LERP: 0.08,
  OFFSET: 1200,
  SCROLL_MULTIPLIER: 0.6,
  COLS: 5,
  ROWS: 3,
  GAP_X: 500,
  GAP_Y: 700,
};

export default function InfiniteGrid() {
  const [imageClicked, setImageClicked] = useState(null);

  // use to calculate the drag
  const isDragging = useRef(false);

  const hasDragged = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const imageClickedRef = useRef(null);

  // used to do the request animation frame.
  const requestRef = useRef();

  // ref of the images
  const elementRef = useRef([]);
  const gridRef = useRef(null);

  const positions = useRef(
    Array.from({ length: CONFIG.COLS * CONFIG.ROWS }, (_, i) => {
      const col = i % CONFIG.COLS;
      const row = Math.floor(i / CONFIG.COLS);

      return {
        x: col * CONFIG.GAP_X + Math.random() * 100 - 50 + 150 * row, 
        y: row * CONFIG.GAP_Y + Math.random() * 100 - 50, 
    }),
  );

  const lerp = (start, end, t) => start + (end - start) * t;

  const animate = (time) => {
    for (const [index, el] of elementRef.current.entries()) {
      const pos = positions.current[index];

      pos.x = lerp(pos.x, pos.targetX ?? pos.x, CONFIG.LERP);
      pos.y = lerp(pos.y, pos.targetY ?? pos.y, CONFIG.LERP);

      let moduloX =
        mod(
          pos.x + (window.innerWidth + CONFIG.OFFSET) / 2,
          window.innerWidth + CONFIG.OFFSET,
        ) -
        (window.innerWidth + CONFIG.OFFSET) / 2;

      let moduloY =
        mod(
          pos.y + (window.innerHeight + CONFIG.OFFSET) / 2,
          window.innerHeight + CONFIG.OFFSET,
        ) -
        (window.innerHeight + CONFIG.OFFSET) / 2;

      gsap.set(el, {
        x: moduloX,
        y: moduloY,
      });
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    console.log(`Image ${imageClicked} clicked`);
  }, [imageClicked]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      gridRef.current?.classList.add(styles.dragging);
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      hasDragged.current = false;

      // Ya trois log de image clicked -> prevent
      // if (imageClickedRef.current !== null) {
      //   if (imageClicked !== imageClickedRef.current) {
      //     setImageClicked(imageClickedRef.current);
      //     imageClickedRef.current = null;
      //   } else {
      //     setImageClicked(null);
      //     imageClickedRef.current = null;
      //   }
      // }
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;

      hasDragged.current = true;

      lastMousePosition.current = { x: e.clientX, y: e.clientY };

      for (const pos of positions.current) {
        pos.targetX = (pos.targetX ?? pos.x) + dx;
        pos.targetY = (pos.targetY ?? pos.y) + dy;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      gridRef.current?.classList.remove(styles.dragging);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useLenis(({ velocity }) => {
    for (const pos of positions.current) {
      pos.targetY =
        (pos.targetY ?? pos.y) + velocity * CONFIG.SCROLL_MULTIPLIER;
    }
  }, []);

  return (
    <div className={styles.infiniteGrid} ref={gridRef}>
      {imageList.map((image, index) => {
        return (
          <InfiniteGridElement
            src={imageList[index].src}
            alt={imageList[index].alt}
            index={index}
            elementRef={elementRef}
            imageClickedRef={imageClickedRef}
            hasDragged={hasDragged}
            key={index}
          />
        );
      })}
    </div>
  );
}

function InfiniteGridElement({
  src,
  alt,
  index,
  elementRef,
  imageClickedRef,
  hasDragged,
}) {
  return (
    <div
      className={styles.imageContainer}
      ref={(el) => (elementRef.current[index] = el)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        style={{ objectFit: "cover", userSelect: "none" }}
        draggable={false}
        onClick={() => {
          if (hasDragged.current) return;
          imageClickedRef.current = index;
          console.log(`Image ${imageClickedRef.current} clicked`);
        }}
      />
    </div>
  );
}
