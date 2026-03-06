import "@/styles/globals.css";
import { ReactLenis } from "lenis/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ReactLenis
        root
        options={{
          infinite: true,
          syncTouch: true,
        }}
      >
        <Component {...pageProps} />
      </ReactLenis>
    </>
  );
}
