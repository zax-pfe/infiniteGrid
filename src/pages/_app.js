import "@/styles/globals.css";
import { ReactLenis } from "lenis/react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const isHomePage = router.pathname === "/";

  if (isHomePage) {
    return (
      <ReactLenis
        root
        options={{
          infinite: true,
          syncTouch: true,
        }}
      >
        <Component {...pageProps} />
      </ReactLenis>
    );
  }

  return <Component {...pageProps} />;
}
