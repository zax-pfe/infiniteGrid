import Image from "next/image";
import InfiniteGrid from "@/Components/InfiniteGrid/InfiniteGrid";
import styles from "./page.module.scss";
import Logo from "@/Components/Logo/Logo";
import Artwork from "@/Components/Artwork/Artwork";

export default function Home() {
  return (
    <div>
      {/* <Logo /> */}
      <Artwork />
      <InfiniteGrid />
    </div>
  );
}
