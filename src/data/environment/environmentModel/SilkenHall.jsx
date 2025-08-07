import { useGLTF } from "@react-three/drei";

export function SilkenHallModel() {
  const { scene: Room } = useGLTF("/models/Silken hall.glb");
  return <primitive scale={25} object={Room} />;
}
