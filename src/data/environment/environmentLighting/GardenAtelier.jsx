import { Environment } from "@react-three/drei";

const GardenAtelierLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={2} />
    </>
  );
};

export default GardenAtelierLighting;