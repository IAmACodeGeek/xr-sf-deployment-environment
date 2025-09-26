import { useGLTF } from "@react-three/drei";

export function GrandGalleriaModel() {
  const { scene: Room } = useGLTF("/models/Grand galleria.glb");
  return <primitive object={Room} scale={150} />;
}
