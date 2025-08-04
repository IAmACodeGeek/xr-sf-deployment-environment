import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function BarbieClutchModel() {
  const { scene: Room } = useGLTFWithKTX2("/models/Barbie clutch.glb");
  return <primitive object={Room} scale={[35, 33, 53]} />;
}
