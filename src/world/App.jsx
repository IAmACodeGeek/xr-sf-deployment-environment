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
import ThreeJSErrorBoundary from "../UI/Components/ThreeJSErrorBoundary";
import {
  useComponentStore,
  usePointerLockStore,
  useDriverStore,
  useBrandStore,
  useEnvironmentStore,
  useTouchStore
} from "../stores/ZustandStores.ts";
import environmentData from "../data/environment/EnvironmentData.ts";
import VrExit from "@/vr/VrMenu.tsx";
import VrCard from "@/vr/VrProductCard.tsx";
import VrSettingsCard from "@/vr/VrSettingsCard.tsx";
import VrAboutUs from "@/vr/VrAboutUs.tsx";
import VrTerms from "@/vr/VrTerms.tsx";
import { RapierVRProxy } from "@/vr/VRControls.jsx";

const UiPercentagereduced = 0.1;
const distanceFromCamera = -9 * UiPercentagereduced;
const scale = UiPercentagereduced;

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
  const [isXRSupported, setIsXRSupported] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useFrame(() => {
    TWEEN.update();
  });

  useEffect(() => {
    if (navigator.xr) {
      Promise.all([navigator.xr.isSessionSupported("immersive-vr")]).then(
        ([vrSupported]) => {
          if(brandData?.shopify_storefront_access_token && brandData?.shopify_storefront_access_token !== "dummy-storefront-token"){
            setIsXRSupported(vrSupported);
          }
        }
      );
    }
  }, []);

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
    <ThreeJSErrorBoundary>
      <>
        {!isMobile && !isXRSupported && (
          <PointerLockControls
            onLock={pointerLockControlsLockHandler}
            onUnlock={pointerLockControlsUnlockHandler}
          />
        )}
        {/* <Skybox /> */}
        <Lights />
        <Physics gravity={[0, -20, 0]}>
          <Ground />
          <Suspense fallback={null}>
          {isXRSupported ? <RapierVRProxy /> : <Player />}
          </Suspense>
          <Products />
          {isXRSupported && (
          <>
          <VrExit scale={[scale,scale,scale]} position={[4 * UiPercentagereduced, 1 * UiPercentagereduced, distanceFromCamera]} />
          <VrCard scale={[scale,scale,scale]} position={[0, 0, distanceFromCamera]} />
          <VrSettingsCard music={brandData?.brand_music_url || "/media/Soundtrack.mp3"} scale={[scale,scale,scale]} position={[1.75 * UiPercentagereduced, 0, distanceFromCamera]} />
          <VrAboutUs scale={[scale,scale,scale]} position={[0.75 * UiPercentagereduced, 0, distanceFromCamera]} />
          <VrTerms environmentName={brandData?.brand_name} scale={[scale,scale,scale]} position={[0.75 * UiPercentagereduced, 0, distanceFromCamera]} /> 
          </>)}
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
    </ThreeJSErrorBoundary>
  );
};

export default App;
