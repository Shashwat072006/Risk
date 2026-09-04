"use client";
import dynamic from "next/dynamic";

// Wrap the Three.js RiskOrb in a client component so dynamic ssr:false is allowed
const RiskOrbClient = dynamic(() => import("./RiskOrb"), { ssr: false });

export default function RiskOrbWrapper() {
  return <RiskOrbClient />;
}
