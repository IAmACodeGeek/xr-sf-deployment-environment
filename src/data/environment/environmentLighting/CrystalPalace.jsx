import { Environment } from "@react-three/drei";

const CrystalPalaceLighting = () => {
  return (
    <>
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={2} />
    </>
  );
};

export default CrystalPalaceLighting;