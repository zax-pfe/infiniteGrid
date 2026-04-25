import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const imageList = [
  // { src: "/images/1.jpg", alt: "Image 1" },
  {
    src: "/artworks/ChienPirouette/chien_pirouette1.jpg",
    alt: "Chien Pirouette 1",
  },
  {
    src: "/artworks/ChienPirouette/chien_pirouette2.jpg",
    alt: "Chien Pirouette 2",
  },
  {
    src: "/artworks/ChienPirouette/chien_pirouette3.jpg",
    alt: "Chien Pirouette 3",
  },
  // { src: "/images/2.jpg", alt: "Image 2" },
  // { src: "/images/3.jpg", alt: "Image 3" },
  // { src: "/images/4.jpg", alt: "Image 4" },
];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const elementContainerRef = useRef([]);
  const elementImagesRef = useRef([]);
  const isAnimatingRef = useRef(false);
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
    <div className={styles.artwork}>
      <div className={styles.left}>
        <div className={styles.images}>
          {/* <div className={styles.imageContainer}> */}
          {/* <Image
              src={imageList[activeIndex].src}
              alt={imageList[activeIndex].alt}
              layout="fill"
              objectFit="cover"
            /> */}
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
          {/* </div> */}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.top}>
          <div className={styles.closeButton}></div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.textContainer}>
            <div className={styles.name}>Chien Pirouette</div>
            <div className={styles.year}>2023</div>
          </div>
          <div className={styles.thumbnailContainer}>
            {imageList.map((image, index) => (
              <Thumbnail
                key={index}
                isAnimatingRef={isAnimatingRef}
                index={index}
                activeIndexRef={activeIndexRef}
                elementContainerRef={elementContainerRef}
                setActiveIndex={setActiveIndex}
                activeIndex={activeIndex}
                src={image.src}
                alt={image.alt}
              />
            ))}
          </div>
        </div>
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

const variants = {
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.5,
  },
};

function Thumbnail({
  isAnimatingRef,
  index,
  activeIndexRef,
  elementContainerRef,
  setActiveIndex,
  activeIndex,
  src,
  alt,
}) {
  function OnClick() {
    if (isAnimatingRef.current) return;
    setActiveIndex(index);

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
        duration: 0.7,
        ease: "power1.inOut",
      })
      .from(
        elementContainerRef.current[next],
        {
          scale: 1.1,
          duration: 0.7,
          ease: "power1.inOut",
        },
        "-=0.7",
      );
  }

  return (
    <motion.div
      className={styles.thumbnail}
      onClick={() => OnClick()}
      animate={index === activeIndex ? "active" : "inactive"}
      variants={variants}
      whileHover="active"
    >
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </motion.div>
  );
}
