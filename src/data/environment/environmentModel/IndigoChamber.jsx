import { useGLTF } from "@react-three/drei";

export function IndigoChamberModel() {
  const { scene } = useGLTF("/models/Indigo chamber.glb");
  return (
    <primitive object={scene} scale={[35,37,35]} />
  );
}