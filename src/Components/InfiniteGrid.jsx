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
  const positions = useRef([
    { x: 100, y: 100 },
    { x: 500, y: 300 },
    { x: 900, y: 500 },
    { x: 1300, y: 200 },
  ]);
  const elementRef = useRef([]);

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

  // useEffect(() => {
  //   const animate = () => {
  //     animationFrameId = requestAnimationFrame(animate);
  //   };

  //   animationFrameId = requestAnimationFrame(animate);

  //   return () => cancelAnimationFrame(animationFrameId);
  // }, []);

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
