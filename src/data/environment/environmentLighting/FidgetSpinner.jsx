import { Environment } from "@react-three/drei";

const FidgetSpinnerLighting = () => {
  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment files={["/hdr/table_mountain_1_2k.hdr"]} background environmentIntensity={0} />
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={1} />
    </>
  );
};

export default FidgetSpinnerLighting;