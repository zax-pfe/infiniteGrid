import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { data_exhibition } from "@/data/data_exhibition";
import { div } from "framer-motion/client";
import ExhibitionModal from "./ExhibitionModal/ExhibitionModal";

export default function Exhibition() {
  return (
    <>
      {/* <ExhibitionModal exhibition={data_exhibition[Object.keys(data_exhibition)[0]]} /> */}
      <div className={styles.exhibition}>
        {Object.keys(data_exhibition).map((key) => (
          <ExhibitionElement key={key} data={data_exhibition[key]} />
        ))}
      </div>
    </>
  );
}

function ExhibitionElement({ data }) {
  return (
    <div className={styles.exhibitionElement}>
      <div className={styles.exhibitionName}>{data.title}</div>
      <div className={styles.exhibitionImages}>
        {data.images.map((image, index) => (
          <ExhibitionImage key={index} image={image} />
        ))}
      </div>
    </div>
  );
}

function ExhibitionImage({ image }) {
  return (
    <div className={styles.exhibitionImage}>
      <Image src={image.src} alt={image.alt} width={1200} height={800} />
    </div>
  );
}
