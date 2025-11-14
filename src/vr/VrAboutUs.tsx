import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import { useBrandStore, useComponentStore } from "@/stores/ZustandStores";
import { DynamicImage } from "./DynamicImage";
import * as THREE from "three";

export default function VrAboutUs({scale,position}: {scale: [number, number, number], position: [number, number, number]}) {
  const { camera } = useThree();
  const uiRef = useRef(null);
  scale = scale || [1, 1, 1];
  position = position || [0.75, 0, -9];
  const contactUsOpen = useComponentStore((state) => state.isContactModalOpen);
  const closeContactModal = useComponentStore(
    (state) => state.closeContactModal
  );
  const { brandData } = useBrandStore();
  console.log('brandData: ', brandData);
  const openSettingsModal = useComponentStore((state) => state.openSettingsModal);
  useEffect(() => {
    const uiMesh = uiRef.current as unknown as THREE.Group;
    if (uiMesh) {
      // Set the position slightly in front of the camera (e.g., 1 meter)
      // and center it on the screen
      uiMesh.position.set(position[0], position[1], position[2]);
      uiMesh.scale.set(scale[0], scale[1], scale[2]);
      // // Ensure the UI group is a direct child of the camera
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
      <Defaults  renderOrder={1000}>
        <Root>
          <Container
            display={contactUsOpen ? "flex" : "none"}
            flexDirection="column"
            alignItems="flex-start"
            gap={20}
          >
            <Container flexDirection="column" alignItems="center" gap={16}>
              <Card
                width={500}
                height={300}
                borderRadius={32}
                padding={32}
                backgroundColor="#111318"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Container
                  padding={20}
                  width={"100%"}
                  positionType={"absolute"}
                  flexDirection="row"
                  height={"100%"}
                  justifyContent={"space-evenly"}
                  alignItems="flex-start"
                  gap={16}
                >
                  <Text fontSize={20} color="#fff">
                    About Us
                  </Text>
                  <Container
                    positionType={"absolute"}
                    paddingRight={20}
                    width={"100%"}
                    height={30}
                    justifyContent="flex-end"
                    onClick={() => {
                      closeContactModal();
                      openSettingsModal();
                    }}
                  >
                    <DynamicImage
                      imageUrl="/svg/close.png"
                      width={5}
                      height={5}
                    />
                  </Container>
                </Container>
                  <Container paddingTop={20} alignItems="flex-start" justifyContent="flex-start" width={"100%"} height={"100%"} maxHeight={300} overflow={"scroll"} flexDirection="row" gap={16}>
                    <Text fontSize={16} color="#fff">{brandData?.about_brand}</Text>
                  </Container>
              </Card>
            </Container>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}
