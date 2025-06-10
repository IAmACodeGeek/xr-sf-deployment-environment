import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useTourStore, useEnvironmentStore } from "../stores/ZustandStores";
import { useEffect } from "react";
import environmentData from "../data/environment/EnvironmentData";

export const CameraController = ({ setAnimating, playerRef }) => {
  const { camera } = useThree();
  const { tourComplete } = useTourStore();
  const { environmentType } = useEnvironmentStore();

  useEffect(() => {
    if (tourComplete && playerRef.current) {
      setAnimating(true);

      const envConfig = environmentData[environmentType];
      if (!envConfig) {
        console.error(`No environment configuration found for ${environmentType}`);
        return;
      }

      const { position, rotation } = envConfig.initialGSAP.start;
      const targetPosition = {
        x: position[0],
        y: position[1],
        z: position[2]
      };

      const targetRotation = {
        x: rotation[0] * (Math.PI / 180), // Convert degrees to radians
        y: rotation[1] * (Math.PI / 180),
        z: rotation[2] * (Math.PI / 180)
      };
      
      const timeline = gsap.timeline({
        onComplete: () => {
          if (playerRef.current) {
            playerRef.current.setTranslation(targetPosition);
            playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
            playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
          }
          
          setAnimating(false);
          useTourStore.setState({ tourComplete: false });
        }
      });

      timeline.to(camera.rotation, {
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        duration: 2,
        ease: "power2.inOut"
      });

      timeline.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 4,
        ease: "power2.inOut"
      });

      return () => timeline.kill();
    }
  }, [tourComplete, camera, setAnimating, playerRef, environmentType]);

  return null;
};