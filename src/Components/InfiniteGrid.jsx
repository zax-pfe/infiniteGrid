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
export default function InfiniteGrid() {
  const offset = 1200;

  // use to calculate the drag
  const isDragging = useRef(false);
  const lastY = useRef(0);
  // const lastCoord = useRef({x: 0, y:0});

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

  const animate = (time) => {
    // console.log("Animation en cours...", time);
    // console.log(isDragging.current);
    console.log(lastY.current);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []); // [] assure que l'effet ne s'exécute qu'une fois au montage

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastY.current = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const deltaY = e.clientY - lastY.current;
      lastY.current = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
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
    // console.log(positions.current[2].y);

    for (const pos of positions.current) {
      let newY = pos.y + velocity * 0.3;
      pos.y =
        mod(
          newY + (window.innerHeight + offset) / 2,
          window.innerHeight + offset,
        ) -
        (window.innerHeight + offset) / 2;
    }

    for (const [index, el] of elementRef.current.entries()) {
      gsap.set(el, {
        x: positions.current[index].x,
        y: positions.current[index].y,
      });
    }
  }, []);

  return (
    <div className={styles.infiniteGrid}>
      {imageList.map((image, index) => {
        return (
          <InfiniteGridElement
            key={index}
            src={imageList[index].src}
            alt={imageList[index].alt}
            index={index}
            elementRef={elementRef}
          />
        );
      })}
    </div>
  );
}

function InfiniteGridElement({ src, alt, index, elementRef }) {
  return (
    <div
      className={styles.imageContainer}
      ref={(el) => (elementRef.current[index] = el)}
    >
      <Image src={src} alt={alt} fill priority style={{ objectFit: "cover" }} />
    </div>
  );
}
