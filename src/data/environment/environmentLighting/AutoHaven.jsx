import { Environment } from "@react-three/drei";

const AutoHavenLighting = () => {
  return (
    <>
    <ambientLight intensity={1} color={"#ffffff"} />
    <Environment
      background
      preset={"city"}
      environmentIntensity={1}
      ground={{
        height: 45,
        radius: 500,
        scale: 500
      }}
    />
    </>
  );
};

export default AutoHavenLighting;
