import { Environment } from "@react-three/drei";
import hdr from "/hdr/Arcade Zone.hdr?url";

const ArcadeZoneLighting = () => {
    return (
      <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <Environment files={[hdr]}  environmentIntensity={1} background={true} />
      </>
    );
  };
  
  export default ArcadeZoneLighting;