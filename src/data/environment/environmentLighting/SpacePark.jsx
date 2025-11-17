import { Environment } from "@react-three/drei";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { useLoader } from "@react-three/fiber";
import { BackSide, Color, EquirectangularReflectionMapping } from "three";
import Skybox from "@/world/Skybox";
const SpaceParkLighting = () => {
    const hdr = useLoader(EXRLoader, "/hdr/night-sky_4K.exr")
    hdr.mapping = EquirectangularReflectionMapping
  return (
        <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <mesh scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        map={hdr}
        side={BackSide}
        toneMapped={false} // bypass tone mapping for background
        color={new Color(5, 5, 5)}
      />
    </mesh>
      <Environment files={['/hdr/city.hdr']} environmentIntensity={1} background={false} />
    </>
  );
};

export default SpaceParkLighting;