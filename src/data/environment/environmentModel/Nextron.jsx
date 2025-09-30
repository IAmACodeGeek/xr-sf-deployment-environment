import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function NextronModel() {
  const { scene: Room } = useGLTFWithKTX2("/models/nextron/Nextron.glb");
  const { scene: assets } = useGLTFWithKTX2("/models/nextron/Nextron assets.glb");
  return (
  <>
  <primitive object={Room} scale={20} position={[0, 0, 0]} />
  <primitive object={assets} scale={20} position={[0, 0, 0]} />
  </>
  )
}
