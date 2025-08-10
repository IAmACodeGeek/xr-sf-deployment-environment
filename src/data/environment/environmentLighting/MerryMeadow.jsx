import { Environment } from "@react-three/drei";

const MerryMeadowLighting = () => {
  return (
    <>
      <Environment
        background
        files={['/hdr/city.hdr']}
        environmentIntensity={1}
        ground={{ height: 25, radius: 500, scale: 3000 }}
      />
    </>
  );
};

export default MerryMeadowLighting;
