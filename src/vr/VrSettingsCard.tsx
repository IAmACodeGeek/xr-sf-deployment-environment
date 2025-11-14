import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Checkbox, Defaults } from "@react-three/uikit-apfel";
import { useBrandStore, useComponentStore } from "@/stores/ZustandStores";
import * as THREE from "three";
import { DynamicImage } from "./DynamicImage";
import { useXRStore } from "@react-three/xr";
export default function VrSettingsCard({music,scale,position}: {music: string, scale: [number, number, number], position: [number, number, number]}) {
  const { camera } = useThree();
  const uiRef = useRef<THREE.Group>(null);
  const soundRef = useRef<THREE.Audio | null>(null);
  const { brandData } = useBrandStore();
  const store = useXRStore();
  const audioControlRef = useRef<{
    start: () => void;
    stop: () => void;
  } | null>(null);
  const { isSettingsModalOpen, closeSettingsModal, setPlayerSpeedMultiplier, playerSpeedMultiplier, openTermsModal, openContactModal, openInfoModal } = useComponentStore();
  scale = scale || [1, 1, 1];
  position = position || [1.75, 0, -9];
  // Function to create audio control with start and stop callbacks
  const createAudioControl = (
    sound: THREE.Audio,
    onStart?: () => void,
    onStop?: () => void
  ) => {
    return {
      start: () => {
        if (sound && sound.buffer) {
          sound.play();
          onStart?.();
        }
      },
      stop: () => {
        if (sound && sound.isPlaying) {
          sound.pause();
          onStop?.();
        }
      },
    };
  };

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


  useEffect(() => {
    if(camera){
      const listener = new THREE.AudioListener();
      camera.add(listener);

      const sound = new THREE.Audio(listener);
      soundRef.current = sound;
      const audioLoader = new THREE.AudioLoader();
      
      audioLoader.load(music, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);

        // Create audio control functions with callbacks
        audioControlRef.current = createAudioControl(
          sound,
          () => console.log("Audio started"),
          () => console.log("Audio stopped")
        );
      });
    }
  }, []);
  return (
    <group ref={uiRef}>
      <Defaults  renderOrder={1000}>
        <Root>
          <Container
            display={isSettingsModalOpen ? "flex" : "none"}
            flexDirection="column"
            alignItems="center"
            gap={20}
          >
            <Container flexDirection="column" gap={16}>
              <Card
                width={300}
                height={400}
                maxHeight={400}
                overflow={"scroll"}
                scrollbarWidth={5}
                borderRadius={32}
                padding={22}
                flexDirection="column"
                backgroundColor="#111318"
              >
                <Container
                  width={"100%"}
                  height={30}
                  padding={10}
                  paddingBottom={20}
                  borderRadius={32}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontSize={12} color="#fff">
                    Settings
                  </Text>
                  <Container
                    width={20}
                    onClick={() => {
                      closeSettingsModal();
                    }}
                  >
                    <DynamicImage
                      imageUrl="/svg/close.png"
                    />
                  </Container>
                </Container>
                <Card
                 width={"100%"}
                  height={50}
                  borderRadius={32}
                  marginTop={10}
                  padding={22}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => {
                    const contactNumber = Number(brandData?.contact_number.replace(/[^a-zA-Z0-9]/g, ''));
                    store.getState().session?.end();
                    window.open(`https://wa.me/${contactNumber}`, '_blank');
                  }}
                >
                  <Text fontSize={12} color="#fff">
                    Contact Us
                  </Text>
                  <DynamicImage imageUrl="/svg/whatsapp.png" width={15} height={20} />
                </Card>
                <Card
                  width={"100%"}
                  height={50}
                  borderRadius={32}
                  marginTop={10}
                  padding={22}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontSize={12} color="#fff">
                    Music
                  </Text>
                  <Checkbox
                    onSelectedChange={(selected) => {
                      if (audioControlRef.current) {
                        if (selected) {
                          audioControlRef.current.start();
                        } else {
                          audioControlRef.current.stop();
                        }
                      }
                    }}
                  />
                </Card>
                <Card
                  width={"100%"}
                  height={30}
                  borderRadius={32}
                  marginTop={10}
                  padding={22}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => {
                    closeSettingsModal();
                    openContactModal();
                  }}
                >
                  <Text fontSize={12} color="#fff">
                    About Us
                  </Text>
                </Card>
                <Card
                  width={"100%"}
                  height={100}
                  borderRadius={32}
                  marginTop={10}
                  paddingLeft={22}
                  paddingTop={12}
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="space-evenly"
                >
                  <Text fontSize={12} color="#fff">
                    Player Speed
                  </Text>
                  <Container height={50} flexDirection="row" gap={10}>
                    <Card  padding={10} marginTop={10} onClick={() => {
                      setPlayerSpeedMultiplier(0.5);
                    }} backgroundColor={playerSpeedMultiplier === 0.5 ? "#333333" : "rgb(146, 145, 145)"}>
                      <Text fontSize={12} color="#fff">
                        Low
                      </Text>
                    </Card>
                    <Card padding={10} marginTop={10} onClick={() => {
                      setPlayerSpeedMultiplier(1.0);
                    }} backgroundColor={playerSpeedMultiplier === 1.0 ? "#333333" : "rgb(146, 145, 145)"}>
                      <Text fontSize={12} color="#fff">
                        Medium
                      </Text>
                    </Card>
                    <Card padding={10} marginTop={10} onClick={() => {
                      setPlayerSpeedMultiplier(1.5);
                    }} backgroundColor={playerSpeedMultiplier === 1.5 ? "#333333" : "rgb(146, 145, 145)"}>
                      <Text fontSize={12} color="#fff">
                        High
                      </Text>
                    </Card>
                  </Container>
                </Card>
                <Card
                  width={"100%"}
                  height={30}
                  borderRadius={32}
                  marginTop={10}
                  padding={22}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => {
                    closeSettingsModal();
                    openTermsModal();
                  }}
                >
                  <Text fontSize={12} color="#fff">
                    Terms and Conditions
                  </Text>
                </Card>
              </Card>
            </Container>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}
