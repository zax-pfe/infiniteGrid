import React, { act, useEffect } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { imageList } from "@/data/data";
import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ReactLenis, useLenis } from "lenis/react";
import { useStore } from "../store/store.js";

import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

// InfiniteGrid.jsx
function mod(n, m) {
  return ((n % m) + m) % m;
}

const CONFIG = {
  LERP: 0.08,
  OFFSET: 1200,
  SCROLL_MULTIPLIER: 0.6,
  COLS: 8,
  ROWS: 3,
  GAP_X: 450,
  GAP_Y: 650,
  IMAGE_HEIGHT: 500,
  IMAGE_WIDTH: 300,
};

export default function InfiniteGrid() {
  const [imageClicked, setImageClicked] = useState(null);

  const canvasDimmensions = useRef({
    width: CONFIG.COLS * CONFIG.GAP_X,
    height: CONFIG.ROWS * CONFIG.GAP_Y,
  });

  const windowSize = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : null,
    height: typeof window !== "undefined" ? window.innerHeight : null,
  });

  // use to calculate the drag
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // used to know which image is active
  const activeIndexRef = useRef(null);
  const activeModalRef = useRef(false);

  // used to do the request animation frame.
  const requestRef = useRef();

  // used to do the animation on click
  const timelineRef = useRef();
  const previousposition = useRef({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  // ref of the images
  const elementRef = useRef([]);
  const gridRef = useRef(null);

  // ______________________ PREVENT DEFAULT DRAGGING ______________________//

  useEffect(() => {
    const preventDrag = (e) => e.preventDefault();

    window.addEventListener("dragstart", preventDrag);

    return () => {
      window.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  const positions = useRef(
    Array.from({ length: CONFIG.COLS * CONFIG.ROWS }, (_, i) => {
      const col = i % CONFIG.COLS;
      const row = Math.floor(i / CONFIG.COLS);

      return {
        x: col * CONFIG.GAP_X + Math.random() * 100 - 50 + 150 * row,
        y: row * CONFIG.GAP_Y + Math.random() * 100 - 50,
        // x: col * CONFIG.GAP_X + Math.random(),
        // y: row * CONFIG.GAP_Y + Math.random(),
      };
    }),
  );

  // function centerGrid() {
  //   const gridWidth = canvasDimmensions.current.width;
  //   const gridHeight = canvasDimmensions.current.height;
  //   const windowWidth = window.innerWidth;
  //   const windowHeight = window.innerHeight;
  //   const centerX = (windowWidth - gridWidth) / 2;
  //   const centerY = (windowHeight - gridHeight) / 2;
  //   gsap.set(gridRef.current, { x: centerX, y: centerY });
  // }
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const onResize = () => centerGrid();
  //   centerGrid();
  //   window.addEventListener("resize", onResize);
  //   return () => window.removeEventListener("resize", onResize);
  // }, []);

  const lerp = (start, end, t) => start + (end - start) * t;

  // ______________________ RAF LOOP ______________________//

  useEffect(() => {
    const animate = () => {
      if (activeIndexRef.current === null && !activeModalRef.current) {
        for (const [index, el] of elementRef.current.entries()) {
          const pos = positions.current[index];

          if (!el || !pos) continue;

          pos.x = lerp(pos.x, pos.targetX ?? pos.x, CONFIG.LERP);
          pos.y = lerp(pos.y, pos.targetY ?? pos.y, CONFIG.LERP);

          const moduloX =
            mod(
              pos.x + canvasDimmensions.current.width / 2,
              canvasDimmensions.current.width,
            ) -
            canvasDimmensions.current.width / 2;

          const moduloY =
            mod(
              pos.y + canvasDimmensions.current.height / 2,
              canvasDimmensions.current.height,
            ) -
            canvasDimmensions.current.height / 2;

          gsap.set(el, {
            x: moduloX,
            y: moduloY,
          });
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    console.log(`Image ${imageClicked} clicked`);
  }, [imageClicked]);

  // ______________________ DRAGGING  ______________________//

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      gridRef.current?.classList.add(styles.dragging);
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      hasDragged.current = false;

      // Ya trois log de image clicked -> prevent
      // if (activeIndexRef.current !== null) {
      //   if (imageClicked !== activeIndexRef.current) {
      //     setImageClicked(activeIndexRef.current);
      //     activeIndexRef.current = null;
      //   } else {
      //     setImageClicked(null);
      //     activeIndexRef.current = null;
      //   }
      // }
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      var dx = e.clientX - lastMousePosition.current.x;
      var dy = e.clientY - lastMousePosition.current.y;

      if (activeIndexRef.current !== null) {
        dx = 0;
        dy = 0;
      }

      hasDragged.current = true;

      lastMousePosition.current = { x: e.clientX, y: e.clientY };

      for (const pos of positions.current) {
        pos.targetX = (pos.targetX ?? pos.x) + dx;
        pos.targetY = (pos.targetY ?? pos.y) + dy;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      gridRef.current?.classList.remove(styles.dragging);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // ______________________ SCROLLING ______________________//

  useLenis(({ velocity }) => {
    if (activeIndexRef.current === null) {
      for (const pos of positions.current) {
        pos.targetY =
          (pos.targetY ?? pos.y) + velocity * CONFIG.SCROLL_MULTIPLIER;
      }
    }
  }, []);

  // ______________________ CLICK ANIMATION ______________________//
  const clickImage = (index) => {
    activeModalRef.current = true;
    const el = elementRef.current[index];
    const { x, y } = el.getBoundingClientRect();
    console.log(`Element ${index} position: x=${x}, y=${y}`);
    previousposition.current = { x, y };

    timelineRef.current = gsap.timeline();

    timelineRef.current.to(el, {
      x: windowSize.current.width / 2 - CONFIG.IMAGE_WIDTH / 2,
      y: windowSize.current.height / 2 - CONFIG.IMAGE_HEIGHT / 2,
      scale: 1.8,
      duration: 0.6,
      ease: "power3.inOut",
      zIndex: 1000,
    });

    timelineRef.current.play();
  };

  const unclickImage = (index) => {
    const el = elementRef.current[index];
    timelineRef.current = gsap.timeline();

    timelineRef.current.to(el, {
      x: previousposition.current.x,
      y: previousposition.current.y,
      scale: 1,
      duration: 0.6,
      ease: "power3.inOut",
    });

    timelineRef.current.play();
    timelineRef.current.eventCallback("onComplete", () => {
      activeIndexRef.current = null;
      elementRef.current[index].style.zIndex = "";
      activeModalRef.current = false;
      activeIndexRef.current = null;
    });
    previousposition.current = { x: 0, y: 0 };
  };

  return (
    <div className={styles.container}>
      <div className={styles.close}>X</div>
      {/* <div className={styles.overlay}>
        <div className={styles.overlayImage}></div>
      </div> */}
      <div className={styles.infiniteGrid} ref={gridRef}>
        {imageList.map((image, index) => {
          return (
            <InfiniteGridElement
              src={imageList[index].src}
              alt={imageList[index].alt}
              index={index}
              elementRef={elementRef}
              activeIndexRef={activeIndexRef}
              activeModalRef={activeModalRef}
              click={clickImage}
              closeModal={unclickImage}
              hasDragged={hasDragged}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

function InfiniteGridElement({
  src,
  alt,
  index,
  elementRef,
  activeIndexRef,
  activeModalRef,
  click,
  closeModal,
  hasDragged,
}) {
  function toggleAciveModal() {
    activeModalRef.current = !activeModalRef.current;
  }

  const setActiveItem = useStore((state) => state.setActiveItem);

  return (
    <div
      className={styles.imageContainer}
      ref={(el) => (elementRef.current[index] = el)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="300px"
        priority
        style={{ objectFit: "cover", userSelect: "none" }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onClick={() => {
          if (hasDragged.current) return;
          activeIndexRef.current = index;
          // activeModalRef.current = true;
          console.log(`Image ${activeIndexRef.current} clicked`);
          if (activeModalRef.current) {
            closeModal(index);
            setActiveItem(null);
            return;
          }
          click(index);
          // toggleAciveModal();
          setActiveItem(index);

          // if (activeModalRef.current) {
          //   closeModal();
          // }
        }}
      />
    </div>
  );
}

// Clean tout le code du click qui a été fait.
// Quand un utilisateur clique sur une image
// Faire apparaitre le fondu blanc et changer le z index de l'image au max
// Positionner cette image au centre de l'ecran
// deactiver le scroll et le drag
// afficher une croix pour fermer le modal
// Quand l'utilisateur clique sur la croix
// remettre l'image à sa position initiale
// reactiver le scroll et le drag

// quand une image est cliquée, on blouqe le drag et le scroll
// mais on stocke la position des targets qaund meme et on la met a jour.
// quand l'utilisatuer clique pour fermer le modal,
// la grille se deplace suivant ce qui a été scrollé ou drag pendant que le modal était ouvert,
