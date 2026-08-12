import { useRef } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";

export default function StickerPage() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className={styles.stickerContainer}>
      <StickerElement containerRef={containerRef} />
    </div>
  );
}

function StickerElement({ containerRef }) {
  return (
    <motion.div
      className={styles.sticker}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
      dragMomentum
      dragTransition={{
        power: 0.1,
        timeConstant: 250,
        bounceStiffness: 100,
        bounceDamping: 25,
      }}
    >
      <div className={styles.imageContainer}>
        <Image
          src="/artworks/Bols/bols1.jpg"
          alt="test-sticker"
          fill
          draggable={false}
          style={{ objectFit: "cover" }}
        />
      </div>
    </motion.div>
  );
}
