import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./page.module.scss";
import Image from "next/image";

const imageList = [
  { src: "/images/1.jpg", alt: "Image 1" },
  { src: "/images/2.jpg", alt: "Image 2" },
  { src: "/images/3.jpg", alt: "Image 3" },
  { src: "/images/4.jpg", alt: "Image 4" },
];

export default function Index() {
  const elementContainerRef = useRef([]);
  const elementImagesRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useGSAP(() => {
    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
    tl.set(elementContainerRef.current[0], { zIndex: 3 }).set(
      elementContainerRef.current[0],
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      },
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        {[...Array(4)].map((_, index) => (
          <TestButtons
            key={index}
            isAnimatingRef={isAnimatingRef}
            index={index}
            activeIndexRef={activeIndexRef}
            elementContainerRef={elementContainerRef}
          />
        ))}
      </div>

      <div className={styles.images}>
        {imageList.map((image, index) => (
          <ImageEmlement
            key={index}
            elementContainerRef={elementContainerRef}
            elementImagesRef={elementImagesRef}
            activeIndex={activeIndex}
            src={image.src}
            index={index}
            alt={image.alt}
          />
        ))}
      </div>
    </div>
  );
}

function ImageEmlement({
  elementContainerRef,
  elementImagesRef,
  src,
  index,
  alt,
}) {
  return (
    <div
      className={styles.imageContainer}
      ref={(el) => (elementContainerRef.current[index] = el)}
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        ref={(el) => (elementImagesRef.current[index] = el)}
      />
    </div>
  );
}

function TestButtons({
  isAnimatingRef,
  index,
  activeIndexRef,
  elementContainerRef,
}) {
  function OnClick() {
    if (isAnimatingRef.current) return;

    const previous = activeIndexRef.current;
    const next = index;

    if (previous === next) return;

    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(elementContainerRef.current[previous], {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        isAnimatingRef.current = false;
        activeIndexRef.current = next;
      },
    });

    tl.set(elementContainerRef.current[next], { zIndex: 3 })
      .set(elementContainerRef.current[previous], { zIndex: 1 })
      .to(elementContainerRef.current[next], {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power2.inOut",
      })
      .from(
        elementContainerRef.current[next],
        {
          scale: 1.2,
          duration: 0.8,
          ease: "power1.inOut",
        },
        "-=0.8",
      );
  }

  return (
    <div className={styles.button} onClick={OnClick}>
      button {index + 1}
    </div>
  );
}
