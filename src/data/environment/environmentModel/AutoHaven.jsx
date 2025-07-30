import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function AutoHavenModel() {
  const { scene: Room } = useGLTFWithKTX2("/models/Auto haven.glb");
  return <primitive object={Room} scale={[4.5,4.5,4.5]} />;
}
