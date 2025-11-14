import { useRef, useReducer, useEffect, Suspense, useMemo, memo } from "react";
import { Container, Text, Image, SuspendingImage, Svg } from "@react-three/uikit";
import { Button, Card } from "@react-three/uikit-apfel";
import Variant from "@/Types/Variant";
import useWishlist from "../UI/Components/WishlistHook.tsx";
import { useBrandStore, useComponentStore } from "@/stores/ZustandStores";
import { useCart } from "@shopify/hydrogen-react";
import { DynamicImage } from "./DynamicImage";
import { useXRStore } from "@react-three/xr";

function VrProductPanel() {

  const{ selectedProduct}  = useComponentStore();
  
  // Get wishlist functions from hook
  const { wishlist, addItemsToWishlist, removeItemsFromWishlist } = useWishlist();
  const  { linesAdd }  = useCart();
  const { brandData } = useBrandStore();
  const  store  = useXRStore();

  const client = useMemo(() => {
    if(!brandData) return null;
    
    return{
      domain: brandData.shopify_store_name,
      storefrontAccessToken: brandData.shopify_storefront_access_token,
      apiVersion: "2024-10",
    };
  }, [brandData]);

  // Use useRef to store state object
  const stateRef = useRef({
    selectedVariant: undefined as Variant | undefined,
    quantity: 1,
    mediaType: "Photos" as "Photos" | "3D Model",
    currentPhoto: 0,
    scale: 1,
    photosScale: 1,
    model3DScale: 0,
    isInWishlist: false,
    showAdded: false,
  });

  // Use useRef for update counter
  const updateCounterRef = useRef(0);
  
  // Use useReducer to trigger re-renders (minimal state trigger)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  // Helper to force re-render using ref-based counter
  const updateState = () => {
    updateCounterRef.current += 1;
    forceUpdate();
  };


  const handleBuyNow = async () => {
    try {

      // Step 1: Create Cart
      const createCartResponse = await fetch(
        `https://${client.domain}/api/${client.apiVersion}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": client.storefrontAccessToken,
          },
          body: JSON.stringify({
            query: `
              mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                  cart {
                    id
                    checkoutUrl
                  }
                  userErrors {
                    message
                  }
                }
              }
            `,
            variables: {
              input: {
                lines: [
                  {
                    merchandiseId: `gid://shopify/ProductVariant/${stateRef.current.selectedVariant?.id}`,
                    quantity: stateRef.current.quantity,
                  },
                ],
              },
            },
          }),
        }
      );

      const createCartData = await createCartResponse.json();

      if (createCartData.errors) {
        throw new Error(createCartData.errors[0].message);
      }

      const checkoutUrl = createCartData.data.cartCreate.cart.checkoutUrl;
      const checkoutLink = document.createElement("a");
      checkoutLink.href = checkoutUrl;
      checkoutLink.target = "_blank";
      checkoutLink.rel = "noopener noreferrer";
      checkoutLink.style.display = "none";
      document.body.appendChild(checkoutLink);


          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          store.getState().session?.end();
          checkoutLink.dispatchEvent(clickEvent);

          setTimeout(() => {
            document.body.removeChild(checkoutLink);
          }, 100);

    } catch (e) {
      console.error("Checkout error:", e);
    }
  };

  const handleAddToCart = useMemo(() => async () => {
    if (!stateRef.current.selectedVariant) {
      return;
    }

    try {
      linesAdd([
        {
          merchandiseId: `gid://shopify/ProductVariant/${stateRef.current.selectedVariant.id}`,
          quantity: stateRef.current.quantity,
        },
      ]);

      console.log("Product added to cart!");
      // Temporarily show "Added to Cart" then revert back
      stateRef.current.showAdded = true;
      updateState();
      setTimeout(() => {
        stateRef.current.showAdded = false;
        updateState();
      }, 2000);
    } catch (error) {
      console.error(error);
      return;
    }
  }, [linesAdd, updateState]);



  // Initialize state when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      const initialState = selectedProduct.variants?.find((v: Variant) => v.availableForSale);
      stateRef.current.selectedVariant = initialState;
      stateRef.current.quantity = 1;
      stateRef.current.currentPhoto = 0; // Reset to first photo when product changes
      stateRef.current.mediaType = "Photos";
      stateRef.current.scale = 1;
      stateRef.current.photosScale = 1;
      stateRef.current.model3DScale = 0;
      // Update wishlist status based on current wishlist
      stateRef.current.isInWishlist = wishlist.find((productId: number) => productId === selectedProduct.id) !== undefined;
      updateState(); // Trigger re-render after initializing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  // Update wishlist status when wishlist changes (without resetting other state)
  useEffect(() => {
    if (selectedProduct) {
      stateRef.current.isInWishlist = wishlist.find((productId: number) => productId === selectedProduct.id) !== undefined;
      updateState(); // Trigger re-render to update wishlist icon
    }
  }, [wishlist, selectedProduct]);

  // Update functions
  const updateSelectedVariant = (variant: Variant | undefined) => {
    stateRef.current.selectedVariant = variant;
    updateState();
  };

  const updateQuantity = (qty: number) => {
    stateRef.current.quantity = qty;
    updateState();
  };

  const updateMediaType = (type: "Photos" | "3D Model") => {
    stateRef.current.mediaType = type;
    stateRef.current.photosScale = type === "Photos" ? 1 : 0;
    stateRef.current.model3DScale = type === "3D Model" ? 1 : 0;
    updateState();
  };

  const updateCurrentPhoto = (index: number) => {
    stateRef.current.currentPhoto = index;
    updateState();
  };

  const handleVariantSelection = (optionName: string, optionValue: string) => {
    if (!selectedProduct || !stateRef.current.selectedVariant) return;

    const optionIndex = selectedProduct.options
      .map((option) => option.name)
      .indexOf(optionName);

    // Try to find a variant that matches:
    // 1. All previous options (before the changed one) - must match current selection
    // 2. The changed option - must match new value
    // 3. All subsequent options - try to preserve current selection if possible
    let newVariant = selectedProduct.variants.find((variant) => {
      // Check all options match current selection (preserving unchanged options)
      for (let i = 0; i < selectedProduct.options.length; i++) {
        if (i === optionIndex) {
          // For the changed option, check if it matches the new value
          if (variant.selectedOptions[i].value !== optionValue) {
            return false;
          }
        } else {
          // For all other options, preserve the current selection
          if (
            variant.selectedOptions[i].value !==
            stateRef.current.selectedVariant!.selectedOptions[i].value
          ) {
            return false;
          }
        }
      }
      return variant.availableForSale;
    });

    // If no variant found with all other options preserved, 
    // try to find one that matches previous options and the new value
    if (!newVariant) {
      newVariant = selectedProduct.variants.find((variant) => {
        // Match all previous options (before the changed one)
        for (let i = 0; i < optionIndex; i++) {
          if (
            variant.selectedOptions[i].value !==
            stateRef.current.selectedVariant!.selectedOptions[i].value
          ) {
            return false;
          }
        }
        // Match the changed option value
        return (
          variant.selectedOptions[optionIndex].value === optionValue &&
          variant.availableForSale
        );
      });
    }

    if (newVariant) {
      updateSelectedVariant(newVariant);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!selectedProduct) return;
    
    if (stateRef.current.isInWishlist) {
      removeItemsFromWishlist([selectedProduct.id]);
      stateRef.current.isInWishlist = false;
    } else {
      addItemsToWishlist([selectedProduct.id]);
      stateRef.current.isInWishlist = true;
    }
    updateState();
  };

  const photosCount = selectedProduct?.images.length || 0;
  const state = stateRef.current;

  return (
    <Container width="100%" height="100%" flexDirection="row" alignItems="center" gap={16}>
      {/* LEFT: Media */}
      <Container width="50%" height="100%" flexDirection="column" alignItems="center" gap={16}>
        <Container backgroundOpacity={0} width="100%" height="100%" backgroundColor="#1A1A1A" borderRadius={16} alignItems="center" justifyContent="center">
            <Card  alignItems="center" justifyContent="center" backgroundOpacity={0} positionType={"absolute"}  width="100%" height="50%" >
              <DynamicImage imageUrl={selectedProduct?.images[state.currentPhoto]?.src || "/fox-logo.png"} width={100} height={100} borderRadius={8}  />
            </Card>
          <Container 
          width={"100%"}
            flexDirection="row" 
            alignItems="center" 
            justifyContent="space-between" 
            gap={16}
            zIndexOffset={1}
          >
            <Button 
              width={32} 
              height={32} 
              zIndexOffset={1}
              borderRadius={16} 
              onClick={() => updateCurrentPhoto(Math.max(0, state.currentPhoto - 1))} 
              disabled={state.currentPhoto === 0}
            >
              <Text fontSize={16} color="#fff">{"<"}</Text>
            </Button>
            <Button 
              width={32} 
              height={32} 
              borderRadius={16} 
              zIndexOffset={1}
              onClick={() => updateCurrentPhoto(Math.min(photosCount - 1, state.currentPhoto + 1))} 
              disabled={state.currentPhoto === photosCount - 1}
            >
              <Text fontSize={16} color="#fff">{">"}</Text>
            </Button>
          </Container>
        </Container>
      </Container>

      {/* RIGHT: Details */}
      <Card backgroundOpacity={0} width="50%" height="110%" maxHeight={"110%"} overflow={"scroll"} scrollbarWidth={10} flexDirection="column" alignItems="flex-start" gap={16}>
      <Card backgroundOpacity={0} height="90%" maxHeight={"90%"} overflow={"scroll"} scrollbarWidth={10} flexDirection="column" alignItems="flex-start" gap={12}>
        <Text fontSize={20} height={"auto"} color="#fff">{selectedProduct?.title}</Text>
        <Card backgroundOpacity={0} width="100%" height={15} flexDirection="row" alignItems="center" gap={8}>
          <Text fontSize={18} color="#c2c2c2">{`Rs. ${state.selectedVariant?.price || selectedProduct?.variants[0].price}`}</Text>
          <Text fontSize={14} color="#ff0000">{`Rs. ${state.selectedVariant?.compareAtPrice || ""}`}</Text>
        </Card>
          
          

         {selectedProduct && selectedProduct?.options.map(option => (
          <Card backgroundOpacity={0} height={"auto"} key={option.name} width="100%" flexDirection="column" alignItems="flex-start" gap={6}>
            <Text fontSize={14} color="#fff">{option.name}</Text>
            <Card backgroundOpacity={0} width="100%" flexDirection="row" flexWrap="wrap" gap={8}>
              {option.values.map((value ,i) => {
                const isSelected = state.selectedVariant?.selectedOptions.find(op => op.name === option.name)?.value === value;
                const variantExists = selectedProduct.variants.find((variant) => {
                  const optionIndex = selectedProduct.options.map((opt) => opt.name).indexOf(option.name);
                  for (let i = 0; i < optionIndex; i++) {
                    if (
                      variant.selectedOptions[i].value !==
                      state.selectedVariant?.selectedOptions[i].value
                    )
                      return false;
                  }
                  return (
                    variant.selectedOptions[optionIndex].value === value &&
                    variant.availableForSale
                  );
                });
                
                return (
                  <Card 
                    key={i} 
                    height={30} 
                    padding={8} 
                    hover={{backgroundColor : "rgb(146, 145, 145)"}}
                    borderRadius={16}
                    backgroundColor={isSelected ? "rgb(255, 255, 255)" : "#424147"}
                    onClick={() => {
                      if (variantExists) {
                        handleVariantSelection(option.name, value);
                      }
                    }}
                  >
                    <Text fontSize={12} color={variantExists ? "#d7d7d7" : "#666666"}>{value}</Text>
                  </Card>
                );
              })}
            </Card>
          </Card>
        ))}

        <Card backgroundOpacity={0} height={50} width="100%" flexDirection="row" alignItems="center" justifyContent="flex-start">
          <Text fontSize={16} color="#fff">Quantity:</Text>
          <Container flexDirection="row" marginLeft={12} alignItems="center" gap={12}>
            <Card 
              width={32} 
              height={32} 
              borderRadius={16} 
              alignItems="center" 
              justifyContent="center" 
              backgroundColor={state.quantity > 1 ? "#3A3A3A" : "#2A2A2A"}
              onClick={() => updateQuantity(Math.max(1, state.quantity - 1))}
            >
              <Text fontSize={16} color={state.quantity > 1 ? "#fff" : "#666666"}>-</Text>
            </Card>
            <Text fontSize={16} color="#c2c2c2">{state.quantity}</Text>
            <Card 
              width={32} 
              height={32} 
              borderRadius={16} 
              alignItems="center" 
              justifyContent="center" 
              backgroundColor={state.quantity < 5 ? "#3A3A3A" : "#2A2A2A"}
              onClick={() => updateQuantity(Math.min(10, state.quantity + 1))}
            >
              <Text fontSize={16} color={state.quantity < 10 ? "#fff" : "#666666"}>+</Text>
            </Card>
          </Container>
        </Card>

        <Card backgroundOpacity={0} height={"auto"} width={"100%"} flexDirection="column" alignItems="flex-start" gap={16}>
          <Text fontSize={16} color="#fff">Description</Text>
          <Text fontSize={14} color="#c2c2c2">{selectedProduct?.description?.replace(/<[^>]+>/g, '') || "No description available"}</Text>
        </Card>
        </Card>
        <Card backgroundOpacity={0} positionType={"absolute"}  width="100%" height="100%" flexDirection="row" alignItems="flex-end" gap={16}>
          <Card  hover={{backgroundColor : "rgb(146, 145, 145)"}} alignItems="center" onClick={handleAddToCart} justifyContent="center" width="40%" height={40} backgroundColor="#424147" borderRadius={32}>
          <Text fontSize={12} color="#fff">{state.showAdded ? "Added to Cart" : "Add to Cart"}</Text>
          </Card>
          <Card  hover={{backgroundColor : "rgb(146, 145, 145)"}} alignItems="center" justifyContent="center" onClick={handleBuyNow} width="30%" height={40} backgroundColor="#424147" borderRadius={32}>
          <Text fontSize={12} color="#fff">Buy Now</Text>
          </Card>
          <Card 
          hover={{backgroundColor : "rgb(146, 145, 145)"}}
          width={40} 
          height={40} 
          borderRadius={20} 
          backgroundColor="#424147" 
          alignItems="center"
          justifyContent="center"
          onClick={handleWishlistToggle}
          >
          {state.isInWishlist ? 
           <DynamicImage imageUrl={"/svg/heart-filled.png"}  width={60} height={60} borderRadius={12} /> 
           : 
           <DynamicImage imageUrl={"/svg/heart.png"}  width={60} height={60} borderRadius={12} />
           }
           </Card>
           </Card>
      </Card> 
    </Container>
  );
}

export default memo(VrProductPanel);




