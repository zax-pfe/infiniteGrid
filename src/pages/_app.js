import "@/styles/globals.css";
import { ReactLenis } from "lenis/react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps, router }) {
  // const page_router = useRouter();
  // const isHomePage = page_router.pathname === "/";

  const enableLenis =
    !router?.route?.startsWith("/exhibition") && !router?.route?.startsWith("/about");

  return (
    <>
      {enableLenis ? (
        <ReactLenis
          root
          options={{
            infinite: true,
            syncTouch: true,
          }}
        >
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </ReactLenis>
      ) : (
        <ReactLenis
          root
          options={{
            infinite: false,
            syncTouch: true,
          }}
        >
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </ReactLenis>
      )}
    </>
  );
}
