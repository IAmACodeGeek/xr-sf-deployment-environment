import * as TWEEN from "@tweenjs/tween.js";
import { PointerLockControls } from "@react-three/drei";
import { Ground } from "./world/Ground.jsx";
import { Physics } from "@react-three/rapier";
import { Player } from "./world/Player.jsx";
import { useFrame } from "@react-three/fiber";
import Television from "./world/Television";
import BrandPoster from "./world/BrandPoster";
import Products from "./world/Products";
import { Suspense, useState, useEffect } from "react";
import Skybox from "./world/Skybox";
import {
  useComponentStore,
  usePointerLockStore,
  useDriverStore,
  useBrandStore,
  useEnvironmentStore
} from "./stores/ZustandStores";
import { useTouchStore } from "./stores/ZustandStores";
import environmentData from "./data/environment/EnvironmentData.js";

const shadowOffset = 50;

export const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const {
    crosshairVisible,
    isModalOpen,
    isWishlistOpen,
    isCartOpen,
    isInfoModalOpen,
    isDiscountModalOpen,
    isSettingsModalOpen,
    isTermsModalOpen,
    isContactModalOpen,
    isProductSearcherOpen,
  } = useComponentStore();
  const { brandData } = useBrandStore();
  const { lockPointer, unlockPointer } = usePointerLockStore();
  const { driverActive } = useDriverStore();
  const { isTouchEnabled } = useTouchStore();
  const {environmentType} = useEnvironmentStore();

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useFrame(() => {
    TWEEN.update();
  });

  const pointerLockControlsLockHandler = () => {
    if (
      isTouchEnabled &&
      crosshairVisible &&
      !driverActive &&
      !isModalOpen &&
      !isCartOpen &&
      !isWishlistOpen &&
      !isInfoModalOpen &&
      !isDiscountModalOpen &&
      !isSettingsModalOpen &&
      !isTermsModalOpen &&
      !isContactModalOpen &&
      !isProductSearcherOpen
    ) {
      lockPointer();
    } else {
      document.exitPointerLock?.();
    }
  };

  const pointerLockControlsUnlockHandler = () => {
    unlockPointer();
  };

  // ✅ Prevent Rendering until brandData is Loaded
  if (!brandData) {
    return null; // or a loading state
  }

  return (
    <>
      {!isMobile && (
        <PointerLockControls
          onLock={pointerLockControlsLockHandler}
          onUnlock={pointerLockControlsUnlockHandler}
        />
      )}
      <Skybox />
      <ambientLight intensity={3.5} />
      <directionalLight
        castShadow
        intensity={1.5}
        shadow-mapSize={4096}
        shadow-camera-top={shadowOffset}
        shadow-camera-bottom={-shadowOffset}
        shadow-camera-left={shadowOffset}
        shadow-camera-right={-shadowOffset}
        position={[100, 100, 0]}
      />

      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Suspense fallback={null}>
          <Player />
        </Suspense>
        <Products />
        {brandData && (
          <>
            {environmentData[environmentType].televisions && 
              environmentData[environmentType].televisions.map((television, index) => {
                return (
                  <Television
                    videoPath={brandData.brand_video_url}
                    scale={television.scale}
                    position={television.position}
                    rotation={television.rotation}
                    key={index}
                  />
                );
              })
            }
            {
              environmentData[environmentType].brandPosters &&
                environmentData[environmentType].brandPosters.map((brandPoster, index) => {
                  return (
                    <BrandPoster
                      imageUrl={brandData.brand_poster_url}
                      position={brandPoster.position}
                      rotation={brandPoster.rotation}
                      scale={brandPoster.scale}
                      key={index}
                    />
                  );
                })
            }
          </>
        )}
        {/* <Television
          videoPath={brandData.brand_video_url}
          scale={[0.9, 0.9, 0.9]}
          position={[-4.5, 11, -91]}
          rotation={[0, -82.79, 0]}
        /> */}

        {/*May crash if external website*/}
        {/* <WebPlane
          scale={[0.2, 0.2, 0.1]}
          position={[-5, 0, 5.1]}
          rotation={[0, 162.5, 0]}
        /> */}
        {/* <BrandPoster
          imageUrl={brandData.brand_poster_url}
          width={192 * 4}
          height={108 * 4}
          position={[-2.2, 3.2, -55.35]}
          rotation={[0, 90, 1]}
        /> */}
        {/* <ImageShowcase
          url="https://cdn.shopify.com/s/files/1/0901/2222/3909/files/image_7.png?v=1736493908"
          width={108 * 1.5}
          height={192 * 1.5}
          position={[-14, -2.5, -70.35]}
          transparent
        /> */}
        {/* <MirrorPoster
          width={192}
          height={108}
          position={[-2.2, -2.2, -55.35]}
          rotation={[0, 90, 1]}
          isMobile={isMobile}
          constraints={{
            video: {
              facingMode: "user", // front camera
              width: 1280,
              height: 720,
            },
          }}
        /> */}
      </Physics>
    </>
  );
};

export default App;
