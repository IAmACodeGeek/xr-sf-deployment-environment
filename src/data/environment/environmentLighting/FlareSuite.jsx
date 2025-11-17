import { Environment } from "@react-three/drei";

const FlareSuiteLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment preset={"city"} environmentIntensity={1} background={true} />
    </>
  );
};

export default FlareSuiteLighting;