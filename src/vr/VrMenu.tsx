import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useXRStore } from "@react-three/xr";
import { Container, Image, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import { Group } from "three";
import { useComponentStore } from "@/stores/ZustandStores";

export default function VrExit({scale,position}: {scale: [number, number, number], position: [number, number, number]}) {
  const { camera } = useThree();
  const openSettingsModal = useComponentStore(state => state.openSettingsModal);
  const openCart = useComponentStore(state => state.openCart);
  const openWishlist = useComponentStore(state => state.openWishlist);
  const closeModal = useComponentStore(state => state.closeModal);
  const closeCart = useComponentStore(state => state.closeCart);
  const closeWishlist = useComponentStore(state => state.closeWishlist);
  const closeSettingsModal = useComponentStore(state => state.closeSettingsModal);
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
              width={70}
              alignItems="center"
              justifyContent="center"
              borderRadius={32}
              padding={16}
              margin={5}
              backgroundColor="#000000"
              onClick={() => {
                store.getState().session?.end();
              }}
            >
              <Image src="/svg/exit.png" width={25} height={25} />
            </Card>
            <Card
              width={70}
              alignItems="center"
              justifyContent="center"
              borderRadius={32}
              padding={16}
              margin={5}
              backgroundColor="#000000"
              onClick={() => {
                closeModal();
                closeCart();
                closeWishlist();
                openSettingsModal();
              }}
            >
              <Image src="/svg/settings.png" width={25} height={25} />
            </Card>
            <Card
              width={70}
              alignItems="center"
              justifyContent="center"
              borderRadius={32}
              padding={16}
              margin={5}
              backgroundColor="#000000"
              onClick={() => {
                closeSettingsModal();
                closeWishlist();
                closeModal();
                openCart();
              }}
            >
              <Image src="/svg/shopping-cart.png" width={25} height={25} />
            </Card>
            <Card
              width={70}
              alignItems="center"
              justifyContent="center"
              borderRadius={32}
              padding={16}
              margin={5}
              backgroundColor="#000000"
              onClick={() => {
                closeSettingsModal();
                closeCart();
                closeModal();
                openWishlist();
              }}
            >
              <Image src="/svg/heart.png" width={25} height={25} />
            </Card>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}


