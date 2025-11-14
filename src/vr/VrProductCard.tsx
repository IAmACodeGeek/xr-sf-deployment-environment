import { useEffect, useRef, useReducer, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Root, Svg, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { Group } from "three";
import { useBrandStore, useComponentStore } from "@/stores/ZustandStores";
import VrProductPanel from "./VrProductPanel";
import VrCartPanel from "./VrCartPanel";
import VrWishlistPanel from "./VrWishlistPanel";
import { ShoppingCart } from "lucide-react";
import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import { DynamicImage } from "./DynamicImage";
import * as THREE from "three";

type Tab = "product" | "cart" | "wishlist";

export default function VrCard({scale,position}: {scale: [number, number, number], position: [number, number, number]}) {
  const { camera } = useThree();
  const uiRef = useRef<THREE.Group | null>(null);
  const isModalOpen = useComponentStore((state) => state.isModalOpen);
  const closeModal = useComponentStore((state) => state.closeModal);
  const closeCart = useComponentStore((state) => state.closeCart);
  const closeWishlist = useComponentStore((state) => state.closeWishlist);
  const openCart = useComponentStore((state) => state.openCart);
  const openWishlist = useComponentStore((state) => state.openWishlist);
  const {brandData} = useBrandStore();
  // Use useRef to store active tab
  const activeRef = useRef<Tab>("product");
  
  scale = scale || [1, 1, 1];
  position = position || [0, 0, -9];

  // Use useReducer to trigger re-renders (minimal state trigger)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  // Helper to force re-render
  const updateState = () => {
    forceUpdate();
  };

  // Helper to update active tab and trigger re-render
  const setActive = (tab: Tab) => {
    activeRef.current = tab;
    if (tab === "cart") {
      openCart();
    } else if (tab === "wishlist") {
      openWishlist();
    }
    updateState();
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

  const TabButton = (props: { tab: Tab; label: string }) => {
    const getIconPath = () => {
      switch (props.tab) {
        case "cart":
          return "/svg/shopping-cart.png";
        case "product":
          return "/svg/info.png";
        case "wishlist":
          return "/svg/heart.png";
        default:
          return "/svg/package-search.svg";
      }
    };

    return (
      <Card
        width={68}
        height={56}
        borderRadius={24}
        alignItems="center"
        justifyContent={"center"}
        backgroundColor={
          activeRef.current === props.tab ? "rgba(255, 255, 255)" : "#424147"
        }
        onClick={() => setActive(props.tab)}
      >
        <DynamicImage imageUrl={getIconPath()} width={55} height={55} />
      </Card>
    );
  };

  const shopifyConfig = useMemo(() => {
    if(!brandData) return null;
    
    // Determine country and language based on market from brand data
    let countryCode: "US" | "GB" | "FR" | "IN" | "DE" | "AE" | "AU" = "IN"; // Default to India
    let languageCode: "EN" | "FR" | "HI" | "AR" = "EN"; // Default to English
    
    // Use market field from brand data response
    if (brandData.market) {
      switch (brandData.market) {
        case "USD":
          countryCode = "US";
          languageCode = "EN";
          break;
        case "GBP":
          countryCode = "GB";
          languageCode = "EN";
          break;
        case "EUR":
          countryCode = "FR";
          languageCode = "FR";
          break;
        case "GER":
          countryCode = "DE";
          languageCode = "EN";
          break;
        case "INR":
          countryCode = "IN";
          languageCode = "HI";
          break;
        case "UAE":
          countryCode = "AE";
          languageCode = "EN";
          break;
        case "AUS":
          countryCode = "AU";
          languageCode = "EN";
          break;
        default:
          // Fallback to India if market is not recognized
          countryCode = "IN";
          languageCode = "EN";
      }
    }
    
    console.log('Shopify Config:', {
      storeDomain: brandData.shopify_store_name,
      countryCode,
      languageCode,
      market: brandData.market
    });
    
    return {
      storeDomain: brandData.shopify_store_name,
      storefrontToken: brandData.shopify_storefront_access_token,
      storefrontApiVersion: "2024-10",
      countryIsoCode: countryCode,
      languageIsoCode: languageCode
    };
  }, [brandData]);

  return (
    <group ref={uiRef}>
      <Defaults  renderOrder={1}>
        <Root>
          {shopifyConfig?.storefrontToken && shopifyConfig.storefrontToken !== "dummy-storefront-token" && brandData ? (<Container
            display={isModalOpen ? "flex" : "none"}
            flexDirection="column"
            alignItems="flex-start"
            gap={20}
          >
            <Container
              flexDirection="row"
              alignItems="flex-start"
              width={"100%"}
              gap={12}
            >
              <TabButton tab="product" label="product" />
              <TabButton tab="cart" label="cart" />
              <TabButton tab="wishlist" label="wishlist" />
              <Card
                width={56}
                height={56}
                alignItems="center"
                justifyContent={"center"}
                marginLeft={"auto"}
                borderRadius={24}
                backgroundColor="#111318"
                onClick={() => {
                  closeCart();
                  closeWishlist();
                  setActive("product");
                  closeModal();
                }}
              >
                <DynamicImage
                  imageUrl={"/svg/close.png"}
                  width={55}
                  height={55}
                />
              </Card>
            </Container>
            <Container flexDirection="row" alignItems="center" gap={16}>
              <Card
                width={600}
                height={400}
                borderRadius={32}
                padding={32}
                backgroundColor="#111318"
              >
                <ShopifyProvider
                  storeDomain={shopifyConfig.storeDomain}
                  storefrontToken={shopifyConfig.storefrontToken}
                  storefrontApiVersion={shopifyConfig.storefrontApiVersion}
                  countryIsoCode={shopifyConfig.countryIsoCode}
                  languageIsoCode={shopifyConfig.languageIsoCode}
                >
                  <CartProvider>
                    {activeRef.current === "product" && <VrProductPanel />}
                    {activeRef.current === "cart" && <VrCartPanel />}
                    {activeRef.current === "wishlist" && <VrWishlistPanel />}
                  </CartProvider>
                </ShopifyProvider>
              </Card>
            </Container>
          </Container>) : null}
        </Root>
      </Defaults>
    </group>
  );
}
