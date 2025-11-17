import { Environment } from "@react-three/drei";

const PetalPavilionLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment preset={"city"} environmentIntensity={1} background={false} />
    </>
  );
};

export default PetalPavilionLighting;