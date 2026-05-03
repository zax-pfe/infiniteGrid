import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

export default function Logo() {
  const logoPath = "/Logo/chloe_Logo.png";
  return (
    <div className={styles.logoContainer}>
      <Image src={logoPath} alt="Logo" fill sizes="300px" priority />
    </div>
  );
}
