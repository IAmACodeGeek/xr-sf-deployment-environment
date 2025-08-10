import { Environment } from "@react-three/drei";

const SovereignAtriumLighting = () => {
  return (
    <>
      <Environment
        background
        files={["/hdr/night.hdr"]}
        environmentIntensity={4}
        ground={{ height: 25, radius: 500, scale: 300 }}
      />
    </>
  );
};

export default SovereignAtriumLighting;
