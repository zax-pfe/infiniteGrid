import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const setActiveItem = useStore((state) => state.setActiveItem);
  const activeItem = useStore((state) => state.activeItem);

  useEffect(() => {
    console.log("activeItem changed:", activeItem);
  }, [activeItem]);

  return (
    <AnimatePresence>
      {activeItem !== null && (
        <motion.div
          variants={artwork_variants}
          initial="inactive"
          animate="active"
          exit="inactive"
          className={styles.artwork}
        >
          <div className={styles.left}>
            <div className={styles.imageContainer}>
              <Image
                src={data_artwork[activeItem].images[activeIndex].src}
                alt={data_artwork[activeItem].images[activeIndex].alt}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.top}>
              <div
                className={styles.closeButton}
                onClick={() => setActiveItem(null)}
              ></div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.textContainer}>
                <div className={styles.name}>
                  {data_artwork[activeItem].title}
                </div>
                <div className={styles.year}>
                  {data_artwork[activeItem].year}
                </div>
              </div>
              <div className={styles.thumbnailContainer}>
                {data_artwork[activeItem].images.map((image, index) => (
                  <Thumbnail
                    key={index}
                    index={index}
                    setActiveIndex={setActiveIndex}
                    activeIndex={activeIndex}
                    src={image.src}
                    alt={image.alt}
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

function Thumbnail({ index, setActiveIndex, activeIndex, src, alt }) {
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
    >
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </motion.div>
  );
}
