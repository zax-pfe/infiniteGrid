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
  const timeLineRef = useRef();

  const [activeIndex, setActiveIndex] = useState(0);

  function onClickImage(index) {
    console.log("click", index);
  }

  useGSAP(() => {
    const tl = gsap.timeline({ paused: false });
    timeLineRef.current = tl;

    elementContainerRef.current.forEach((el, index) => {
      tl.to(
        el,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power2.out",
        },
        index * 0.5,
      );
    });
  }, []);

  return (
    <div className={styles.container}>
      {[...Array(4)].map((_, index) => (
        <div key={index} className={styles.imageContainer} />
      ))}

      <div className={styles.images}>
        {imageList.map((image, index) => (
          <ImageEmlement
            key={index}
            elementContainerRef={elementContainerRef}
            elementImagesRef={elementImagesRef}
            onClickImage={onClickImage}
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
  onClickImage,
  src,
  index,
  alt,
}) {
  return (
    <div
      className={styles.imageContainer}
      ref={(el) => (elementContainerRef.current[index] = el)}
      onClick={() => onClickImage(index)}
      // style={{ zIndex: activeIndex === index ? 2 : 1 }}
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
