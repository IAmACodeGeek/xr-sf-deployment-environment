import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useXRStore } from "@react-three/xr";
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import { Group } from "three";
import { useComponentStore } from "@/stores/ZustandStores";

export default function VrExit({scale,position}: {scale: [number, number, number], position: [number, number, number]}) {
  const { camera } = useThree();
  const openSettingsModal = useComponentStore(state => state.openSettingsModal);
  const closeModal = useComponentStore(state => state.closeModal);
  const uiRef = useRef<Group | null>(null);
  const store = useXRStore();
  scale = scale || [1, 1, 1];
  position = position || [4, 1, -9];
  useEffect(() => {
    const uiMesh = uiRef.current;
    if (uiMesh) {
      // Set the position slightly in front of the camera (e.g., 1 meter)
      // and center it on the screen
      uiMesh.position.set(position[0], position[1], position[2]);
      uiMesh.scale.set(scale[0], scale[1], scale[2]);

      // Ensure the UI group is a direct child of the camera
      camera.add(uiMesh);
    }

    // Cleanup: remove the group when the component unmounts
    return () => {
      if (uiMesh) {
        camera.remove(uiMesh);
      }
    };
  }, [camera]);

  return (
    <group ref={uiRef}>
      <Defaults>
        <Root 
         renderOrder={1}
        >
          <Container flexDirection={"column"} alignItems="center" justifyContent="center">
            <Card
              width={90}
              alignItems="center"
              justifyContent="center"
              borderRadius={32}
              padding={16}
              margin={10}
              backgroundColor="#000000"
              onClick={() => {
                store.getState().session?.end();
              }}
            >
              <Text fontSize={12} color="#fff">Exit VR</Text>
            </Card>
            <Card
              width={90}
              alignItems="center"
              justifyContent="center"
              borderRadius={32}
              padding={16}
              margin={10}
              backgroundColor="#000000"
              onClick={() => {
                openSettingsModal();
                closeModal();
              }}
            >
              <Text fontSize={12} color="#fff">Settings</Text>
            </Card>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}


