import { Environment } from "@react-three/drei";

const GrandGalleriaLighting = () => {
    return (
      <>
      <Environment files={['/hdr/golden_bay_2k.hdr']} background environmentIntensity={0} ground={{
        radius : 400,
        scale : 400,
        height: 20
      }} />
      <Environment files={['/hdr/city.hdr']} environmentIntensity={1} />
      </>
    );
  };
  
  export default GrandGalleriaLighting;