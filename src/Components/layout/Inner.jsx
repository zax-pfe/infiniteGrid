import React from "react";
import styles from "./style.module.scss";
import { motion, AnimatePresence } from "framer-motion";

export default function Inner({ children }) {
  const anim = (variants) => {
    return {
      initial: "inital",
      animate: "enter",
      exit: "exit",
      variants: variants,
    };
  };

  const opacity = {
    inital: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const whiteScreen = {
    initial: { opacity: 0 },
    enter: { opacity: 0 },
    exit: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
  };

  // const slide = {
  //   initial: { top: "100vh" },
  //   enter: { top: "100vh" },
  //   exit: { top: "0" },
  // };

  const slide = {
    initial: { opacity: 0 },
    enter: { opacity: 0 },
    exit: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <div className={styles.inner}>
      {/* <motion.div {...anim(whiteScreen)} className={styles.screen} /> */}
      {/* <motion.div {...anim(slide)} className={styles.slide} /> */}
      <motion.div {...anim(opacity)} className={styles.page}>
        {children}
      </motion.div>
    </div>
  );
}
