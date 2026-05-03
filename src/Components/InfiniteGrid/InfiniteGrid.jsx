import React, { act, useEffect } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { imageList } from "@/data/data";
import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ReactLenis, useLenis } from "lenis/react";
import { useStore } from "../../store/store.js";
import Logo from "../Logo/Logo.jsx";
import { motion, AnimatePresence } from "framer-motion";

import { useGSAP } from "@gsap/react";

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
  GAP_Y: 500,
  IMAGE_HEIGHT: 350,
  IMAGE_WIDTH: 250,
};

const totalSlots = CONFIG.COLS * CONFIG.ROWS;

const extendedImageList = Array.from(
  { length: totalSlots },
  (_, i) => imageList[i % imageList.length],
);

export default function InfiniteGrid() {
  const canvasDimmensions = useRef({
    width: CONFIG.COLS * CONFIG.GAP_X,
    height: CONFIG.ROWS * CONFIG.GAP_Y,
  });

  const windowSize = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : null,
    height: typeof window !== "undefined" ? window.innerHeight : null,
  });

  // use to calculate the drag
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // used to do the request animation frame.
  const requestRef = useRef();

  // used to do the animation on click
  const timelineRef = useRef();
  const previousposition = useRef({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  // ref of the images
  const elementRef = useRef([]);
  const gridRef = useRef(null);

  const activeItem = useStore((state) => state.activeItem);

  // ______________________ PREVENT DEFAULT DRAGGING ______________________//

  useEffect(() => {
    const preventDrag = (e) => e.preventDefault();

    window.addEventListener("dragstart", preventDrag);

    return () => {
      window.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  // ______________________ POSITION GENERATION ______________________//

  const positions = useRef(
    Array.from({ length: CONFIG.COLS * CONFIG.ROWS }, (_, i) => {
      const col = i % CONFIG.COLS;
      const row = Math.floor(i / CONFIG.COLS);

      return {
        x: col * CONFIG.GAP_X + Math.random() * 100 - 50 + 150 * row,
        y: row * CONFIG.GAP_Y + Math.random() * 100 - 50,
        // x: col * CONFIG.GAP_X + Math.random(),
        // y: row * CONFIG.GAP_Y + Math.random(),
      };
    }),
  );

  const lerp = (start, end, t) => start + (end - start) * t;

  // ______________________ RAF LOOP ______________________//

  useEffect(() => {
    const animate = () => {
      if (activeItem === null) {
        for (const [index, el] of elementRef.current.entries()) {
          const pos = positions.current[index];

          if (!el || !pos) continue;

          pos.x = lerp(pos.x, pos.targetX ?? pos.x, CONFIG.LERP);
          pos.y = lerp(pos.y, pos.targetY ?? pos.y, CONFIG.LERP);

          const moduloX =
            mod(
              pos.x + canvasDimmensions.current.width / 2,
              canvasDimmensions.current.width,
            ) -
            canvasDimmensions.current.width / 2;

          const moduloY =
            mod(
              pos.y + canvasDimmensions.current.height / 2,
              canvasDimmensions.current.height,
            ) -
            canvasDimmensions.current.height / 2;

          gsap.set(el, {
            x: moduloX,
            y: moduloY,
          });
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // ______________________ DRAGGING  ______________________//

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      gridRef.current?.classList.add(styles.dragging);
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      hasDragged.current = false;
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      var dx = e.clientX - lastMousePosition.current.x;
      var dy = e.clientY - lastMousePosition.current.y;

      if (activeItem !== null) {
        dx = 0;
        dy = 0;
      }

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

  // ______________________ SCROLLING ______________________//

  useLenis(({ velocity }) => {
    if (activeItem === null) {
      for (const pos of positions.current) {
        pos.targetY =
          (pos.targetY ?? pos.y) + velocity * CONFIG.SCROLL_MULTIPLIER;
      }
    }
  }, []);

  // ______________________ CLICK ANIMATION ______________________//

  return (
    <div className={styles.container}>
      <div className={styles.infiniteGrid} ref={gridRef}>
        <Logo />
        {extendedImageList.map((image, index) => {
          return (
            <InfiniteGridElement
              src={extendedImageList[index].src}
              alt={extendedImageList[index].alt}
              index={index}
              id={extendedImageList[index].id}
              elementRef={elementRef}
              activeItem={activeItem}
              z={extendedImageList[index].z}
              hasDragged={hasDragged}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

function InfiniteGridElement({
  src,
  alt,
  index,
  id,
  elementRef,
  z,
  hasDragged,
}) {
  const setActiveItem = useStore((state) => state.setActiveItem);

  return (
    <div
      className={styles.imageContainer}
      ref={(el) => (elementRef.current[index] = el)}
      style={{
        width: CONFIG.IMAGE_WIDTH,
        height: CONFIG.IMAGE_HEIGHT,
        zIndex: z,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="300px"
        priority
        style={{ objectFit: "cover", userSelect: "none" }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onClick={() => {
          if (hasDragged.current) return;

          setActiveItem(id);
        }}
      />
    </div>
  );
}
