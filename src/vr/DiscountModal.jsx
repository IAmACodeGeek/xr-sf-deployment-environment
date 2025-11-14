import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import { useComponentStore } from "@/stores/ZustandStores";
import { DynamicImage } from "./DynamicImage";

export default function VrDiscountModal({ discountCode,scale,position }) {
  const { camera } = useThree();
  scale = scale || [1, 1, 1];
  position = position || [0, 0, -9];
  const uiRef = useRef(null);
  const isDiscountModalOpen = useComponentStore((state) => state.isDiscountModalOpen);
  const closeDiscountModal = useComponentStore((state) => state.closeDiscountModal);
  useEffect(() => {
    const uiMesh = uiRef.current;
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
            display={isDiscountModalOpen ? "flex" : "none"}
            flexDirection="column"
            alignItems="flex-start"
            gap={20}
          >
            <Container flexDirection="column" alignItems="center" gap={16}>
              <Card
                width={300}
                height={200}
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
                    Discount
                  </Text>
                  <Container
                    positionType={"absolute"}
                    paddingRight={20}
                    width={"100%"}
                    height={30}
                    justifyContent="flex-end"
                    onClick={() => {
                      closeDiscountModal();
                    }}
                  >
                    <DynamicImage
                      imageUrl="/svg/close.png"
                      width={5}
                      height={5}
                    />
                  </Container>
                </Container>
                <Container
                height={200}
                maxHeight={300}
                marginTop={50}
                overflow={"scroll"}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent='center'
                  gap={16}
                >
                    <Text>Hurray! You have unlocked the Coupon Code! Click to copy the code and add it in the Checkout!</Text>
                   <Card width={200} height={50} flexDirection="row" alignItems="center" gap={2} justifyContent="center" onClick={() => {
                    navigator.clipboard.writeText(discountCode);
                   }} >
                    <Text fontSize={20} color="#fff">{discountCode}</Text>
                        <DynamicImage
                          imageUrl="/svg/clipboard.png"
                          width={15}
                          height={15}
                        />
                   </Card>
                </Container>
              </Card>
            </Container>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}
