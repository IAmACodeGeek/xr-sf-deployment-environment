import * as TWEEN from "@tweenjs/tween.js";
import { PointerLockControls } from "@react-three/drei";
import { Ground } from "./Ground.jsx";
import { Physics } from "@react-three/rapier";
import { Player } from "./Player.jsx";
import { useFrame } from "@react-three/fiber";
import Television from "./Television.jsx";
import BrandPoster from "./BrandPoster.jsx";
import Products from "./Products.jsx";
import Lights from "./Lights.jsx";
import { Suspense, useState, useEffect } from "react";
import Skybox from "./Skybox.jsx";
import {
  useComponentStore,
  usePointerLockStore,
  useDriverStore,
  useBrandStore,
  useEnvironmentStore,
  useTouchStore
} from "../stores/ZustandStores.ts";
import environmentData from "../data/environment/EnvironmentData.ts";

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

  // ✅ Prevent Rendering until brandData is Loaded and environmentType is valid
  if (!brandData || !environmentType || !environmentData[environmentType]) {
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
      <Lights />
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
      </Physics>
    </>
  );
};

export default App;
