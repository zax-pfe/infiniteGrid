import React from "react";
import NavBar from "@/Components/NavBar/NavBar";
import Inner from "@/Components/layout/Inner";
import Exhibition from "@/Components/Exhibition/Exhibition";

export default function Index() {
  return (
    <Inner>
      <NavBar />
      <Exhibition />
    </Inner>
  );
}
