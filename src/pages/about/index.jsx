import React from "react";
import NavBar from "@/Components/NavBar/NavBar";
import Inner from "@/Components/layout/Inner";
import About from "@/Components/About/About";
export default function Index() {
  return (
    <Inner>
      <NavBar />
      <About />
    </Inner>
  );
}
