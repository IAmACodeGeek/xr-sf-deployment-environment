import { Environment } from "@react-three/drei";

const CrystalPalaceLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={2} />
    </>
  );
};

export default CrystalPalaceLighting;