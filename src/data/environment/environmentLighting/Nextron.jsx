import { Environment } from "@react-three/drei";

const NextronLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={1} />
      <Environment files={["/hdr/nextron.hdr"]} background={true} environmentIntensity={1} />
    </>
  );
};

export default NextronLighting;
