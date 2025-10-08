import { useGLTF } from "@react-three/drei";

export function SpaceParkModel() {
    const { scene : room ,materials} = useGLTF("/models/Apple Space.glb");
    materials["Glass basic"].opacity = 0.5
  
    return (
      <>
          <primitive object={room} scale={45} position={[0, 0, 0]} />
      </>
    );
}