import Image from "next/image";
import InfiniteGrid from "@/Components/InfiniteGrid/InfiniteGrid";
import styles from "./page.module.scss";
import Logo from "@/Components/Logo/Logo";
import Artwork from "@/Components/Artwork/Artwork";
import NavBar from "@/Components/NavBar/NavBar";
import Inner from "@/Components/layout/Inner";

export default function Home() {
  return (
    <Inner>
      <NavBar />
      <Artwork />
      <InfiniteGrid />
    </Inner>
  );
}
