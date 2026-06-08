import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { data_about } from "@/data/data_about.js";

export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.textPanel}>
        <div className={styles.logo}></div>
        <div className={styles.text}>
          <p>{data_about.text}</p>
        </div>
      </div>
      <div className={styles.imagePanel}>
        <div className={styles.imageContainer}>
          <Image
            src={data_about.images[1].src}
            alt={data_about.images[1].alt}
            className={styles.image}
            fill
          />
        </div>
      </div>
    </div>
  );
}
