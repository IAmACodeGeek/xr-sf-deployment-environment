import { Environment } from "@react-three/drei";

const IndigoChamberLighting = () => {
  return (
    <>
      <Environment preset={"warehouse"} environmentIntensity={1} />
    </>
  );
};

export default IndigoChamberLighting;