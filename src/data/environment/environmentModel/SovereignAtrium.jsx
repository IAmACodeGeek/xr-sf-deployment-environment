import { useGLTF } from "@react-three/drei";

export function SovereignAtriumModel() {
  const { scene: Room } = useGLTF("/models/Sovereign atrium.glb");
  return <primitive scale={[14, 11, 14]} object={Room} />;
}
