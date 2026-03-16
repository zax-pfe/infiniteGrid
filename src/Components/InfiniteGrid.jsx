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
};

export default function InfiniteGrid() {
  const [imageClicked, setImageClicked] = useState(null);

  // use to calculate the drag
  const isDragging = useRef(false);

  const hasDragged = useRef(false);

  const currentPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const imageClickedRef = useRef(null);

  const delta = useRef({ x: 0, y: 0 });

  // used to do the request animation frame.
  const requestRef = useRef();

  // ref of the images
  const elementRef = useRef([]);

  // store initial positions
  const positions = useRef([
    { x: 100, y: 10 },
    { x: 500, y: 1300 },
    { x: 900, y: 500 },
    { x: 1300, y: 2000 },
  ]);

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
  }, []); // [] assure que l'effet ne s'exécute qu'une fois au montage

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      hasDragged.current = false;
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

      // console.log("deltaY:", delta.current.y);
      // console.log("deltaX:", delta.current.x);
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
      // let newY = pos.y + velocity * 0.3;
      // pos.y =
      //   mod(
      //     newY + (window.innerHeight + CONFIG.OFFSET) / 2,
      //     window.innerHeight + CONFIG.OFFSET,
      //   ) -
      //   (window.innerHeight + CONFIG.OFFSET) / 2;
      pos.targetY = (pos.targetY ?? pos.y) + velocity * 0.6;
    }
  }, []);

  useEffect(() => {
    console.log(`Image ${imageClicked} clicked`);
  }, [imageClicked]);

  return (
    <div className={styles.infiniteGrid}>
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
          console.log(`hasDragged: ${hasDragged.current}`);
          imageClickedRef.current = index;
          console.log(`Image ${imageClickedRef.current} clicked`);
        }}
      />
    </div>
  );
}
