import { Environment } from "@react-three/drei";

const IndigoChamberLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment preset={"warehouse"} environmentIntensity={1} />
    </>
  );
};

export default IndigoChamberLighting;