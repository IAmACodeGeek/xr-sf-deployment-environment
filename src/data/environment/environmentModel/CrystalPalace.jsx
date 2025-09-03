import { useGLTF } from "@react-three/drei";

export function CrystalPalaceModel() {
  const { scene: Room } = useGLTF("/models/Crystal palace.glb");
  return <primitive object={Room} scale={[4,3.5,4]} />;
}