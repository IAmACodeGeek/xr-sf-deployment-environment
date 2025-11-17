import { Environment } from "@react-three/drei";

const BarbieClutchLighting = () => {
  return (
    <>
    <ambientLight intensity={1} color={"#ffffff"} />
    <Environment
      background
      preset={"city"}
      environmentIntensity={2}
      ground={{ height: 15, radius: 1000, scale: 300 }}
    />
    </>
  );
};

export default BarbieClutchLighting;
