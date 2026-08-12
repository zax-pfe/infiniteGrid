import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useStore } from "../../store/store.js";
import { data_artwork } from "@/data/data_artwork.js";

const artwork_variants = {
  active: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  inactive: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function Index() {
  const setActiveItem = useStore((state) => state.setActiveItem);
  const activeItem = useStore((state) => state.activeItem);
  const activeIndex = useStore((state) => state.activeIndex);
  const setActiveIndex = useStore((state) => state.setActiveIndex);
  const imageRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const activeArtwork = data_artwork[activeItem];
  const displayedIndex = activeArtwork?.images[activeIndex] ? activeIndex : 0;
  const displayedImage = activeArtwork?.images[displayedIndex];

  const registerThumbnail = useCallback((index, el) => {
    thumbnailRefs.current[index] = el;
  }, []);

  useEffect(() => {
    if (activeItem === null || !imageRef.current) return;

    // gsap.fromTo(
    //   imageRef.current,
    //   {
    //     clipPath: "polygon(0% 50%, 100% 50%, 100% 60%, 0% 60%)",
    //   },
    //   {
    //     clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",

    //     duration: 1.6,
    //     ease: "power4.inOut",
    //   },
    // );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        // ease: "power3.inOut",
      },
    );

    // if (thumbnailRefs.current.length === 0) return;

    // gsap.fromTo(
    //   thumbnailRefs.current,
    //   {
    //     clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
    //   },
    //   {
    //     clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    //     duration: 0.8,
    //     ease: "power3.inOut",
    //     delay: 0.2,
    //     stagger: 0.1,
    //   },
    // );
  }, [activeItem]);

  return (
    <AnimatePresence>
      {activeItem !== null && activeArtwork && displayedImage && (
        <motion.div
          variants={artwork_variants}
          initial="inactive"
          animate="active"
          exit="inactive"
          className={styles.artwork}
        >
          <div className={styles.left}>
            <div className={styles.imageContainer} ref={imageRef}>
              <Image
                src={displayedImage.src}
                alt={displayedImage.alt}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.top}>
              <div className={styles.closeButton} onClick={() => setActiveItem(null)}></div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.textContainer}>
                <div className={styles.name}>{activeArtwork.title}</div>
                <div className={styles.year}>{activeArtwork.year}</div>
              </div>
              <div className={styles.thumbnailContainer}>
                {activeArtwork.images.map((image, index) => (
                  <Thumbnail
                    key={index}
                    index={index}
                    setActiveIndex={setActiveIndex}
                    activeIndex={displayedIndex}
                    src={image.src}
                    alt={image.alt}
                    registerThumbnail={registerThumbnail}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const thumbnail_variants = {
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.5,
  },
};

function Thumbnail({ index, setActiveIndex, activeIndex, src, alt, registerThumbnail }) {
  function OnClick() {
    setActiveIndex(index);
  }

  return (
    <motion.div
      className={styles.thumbnail}
      onClick={() => OnClick()}
      animate={index === activeIndex ? "active" : "inactive"}
      variants={thumbnail_variants}
      whileHover="active"
      ref={(el) => registerThumbnail(index, el)}
    >
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </motion.div>
  );
}
