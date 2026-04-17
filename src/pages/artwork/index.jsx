import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";

const imageList = [
  { src: "/images/1.jpg", alt: "Image 1" },
  { src: "/images/2.jpg", alt: "Image 2" },
  { src: "/images/3.jpg", alt: "Image 3" },
  { src: "/images/4.jpg", alt: "Image 4" },
];

export default function index() {
  return (
    <div className={styles.artwork}>
      <div className={styles.left}>
        <div className={styles.mainImageContainer}>
          <Image
            src={imageList[0]}
            alt="main_image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.top}></div>
        <div className={styles.bottom}></div>
      </div>
    </div>
  );
}
