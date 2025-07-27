import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/UI/UI.module.scss";
import ChatbotModal from "./Components/Chatbot";
import {
  useBrandStore,
  useComponentStore,
  useDriverStore,
  useTourStore,
} from "../stores/ZustandStores";
import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import Modal from "@/UI/Components/NewModal";
import Cart from "@/UI/Components/Cart";
import Wishlist from "@/UI/Components/Wishlist";
import InfoModal from "@/UI/Components/InfoModal";
import DiscountModal from "@/UI/Components/DiscountModal";
import SettingsModal from "@/UI/Components/SettingsModal";
import TermsConditionsModal from "@/UI/Components/TermsModal";
import ContactUsModal from "@/UI/Components/ContactUsModal";

import ModalWrapper from "@/UI/Components/ModalWrapper";
import ProductSearcher from "@/UI/Components/ProductSearcher";
import CartCount from "@/UI/Components/CartCount";
import { showPremiumPopup } from "./Components/PremiumRequired";
import { MoveLeft } from "lucide-react";



// Custom Tour Popover Component
const TourPopover = ({ 
  isVisible, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onClose,
  isMobile
}: {
  isVisible: boolean;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  isMobile: boolean;
}) => {
  const steps = [
    {
      title: "How to Navigate",
      description: isMobile 
        ? "Use the virtual joystick to move around and touch to interact with products"
        : "Use the WASD keys to navigate. W (Forward), A (Left), S (Backward), D (Right). Use your mouse or trackpad to look around. Press Esc to regain control of your mouse.",
      leftImage: isMobile ? "/Mobile-Controls.png" : "/PC-Controls.png",
      rightImage: isMobile ? "/Mobile-Controls-.png" : "/PC-Controls-.png",
      leftLabel: "Look Around",
      rightLabel: "Move"
    },
    {
      title: "How to Interact",
      description: "Point and click on products to view them in 3D/2D, read more details, and add them to your cart or wishlist. There's a lot more you can do!",
      leftImage: "/Product-Click.png",
      rightImage: "/Product-Click.png",
      leftLabel: "Product Interaction",
      rightLabel: ""
    },
    {
      title: "Search Products",
      description: "Search for products and go there with a single click",
      leftLabel: "Search",
      rightLabel: "Navigate"
    },
    {
      title: "Shopping Cart",
      description: "View and manage items in your shopping cart",
      leftLabel: "Cart",
      rightLabel: "Checkout"
    },
    {
      title: "Wishlist",
      description: "Save items for later in your wishlist",
      leftLabel: "Save",
      rightLabel: "List"
    },
    {
      title: "Settings",
      description: "Manage your preferences, explore app features, and customize your experience",
      leftLabel: "Settings",
      rightLabel: "Audio"
    },
    {
      title: "Chat Assistant",
      description: "Need more help? Chat with us on WhatsApp.",
      leftLabel: "Chat",
      rightLabel: "WhatsApp"
    }
  ];

  if (!isVisible) return null;

  const currentStepData = steps[currentStep - 1];

  const handleClose = () => {
    console.log('Closing tour');
    onClose();
  };

  const handleNext = () => {
    console.log('Next step');
    onNext();
  };

  const handlePrevious = () => {
    console.log('Previous step');
    onPrevious();
  };

  // Calculate positioning based on current step
  const getPopoverPosition = () => {
    if (currentStep <= 2) {
      // Steps 1-2: Center the popover
      return {
        container: {
          position: "fixed" as const,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
          zIndex: 9999,
          pointerEvents: "auto" as const,
        },
        popover: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "600px",
          width: "90%",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          pointerEvents: "auto" as const,
        }
      };
    } else {
      // Steps 3-7: Position near the buttons
      const isTopPosition = currentStep <= 6; // Steps 3-6 at top, step 7 at bottom
      
      if (isMobile) {
        // Mobile: Same positioning as desktop but with mobile sizing
        return {
          container: {
            position: "fixed" as const,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex" as const,
            justifyContent: "flex-start" as const,
            alignItems: isTopPosition ? "flex-start" as const : "flex-end" as const,
            paddingTop: isTopPosition ? "20px" : "0",
            paddingBottom: isTopPosition ? "0" : "20px",
            paddingRight: "80px",
            zIndex: 9999,
            pointerEvents: "auto" as const,
          },
          popover: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            padding: "20px",
            maxWidth: "280px",
            width: "280px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            pointerEvents: "auto" as const,
            marginTop: isTopPosition ? "60px" : "0",
            marginBottom: isTopPosition ? "0" : "60px",
          }
        };
      } else {
        // Desktop: Position to the right side with up/down movement
        return {
          container: {
            position: "fixed" as const,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex" as const,
            justifyContent: "center" as const,
            alignItems: isTopPosition ? "flex-start" as const : "flex-end" as const,
            paddingTop: isTopPosition ? "20px" : "0",
            paddingBottom: isTopPosition ? "0" : "20px",
            zIndex: 9999,
            pointerEvents: "auto" as const,
          },
          popover: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            padding: "20px",
            maxWidth: "280px",
            width: "280px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            pointerEvents: "auto" as const,
            marginTop: isTopPosition ? "60px" : "0",
            marginBottom: isTopPosition ? "0" : "60px",
            marginLeft: "auto",
            marginRight: "100px",
          }
        };
      }
    }
  };

  const position = getPopoverPosition();

  return (
    <div
      style={position.container}
      onClick={handleClose}
    >
      <div
        style={position.popover}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "20px",
          pointerEvents: "auto"
        }}>
          <h2 style={{ 
            color: "white", 
            margin: 0, 
            fontSize: isMobile ? "14px" : "24px", 
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600"
          }}>
            {currentStepData.title}
          </h2>
          <div
            onClick={handleClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              userSelect: "none",
            }}
          >
            ✕
          </div>
        </div>

        {/* Content */}
        {currentStep !== 2 && (
          <div style={{ 
            color: "white", 
            marginBottom: "30px",
            fontSize: isMobile ? "10px" : "16px",
            lineHeight: "1.5",
            fontFamily: "'Poppins', sans-serif"
          }}>
            {currentStepData.description}
          </div>
        )}

        {/* Icons Section */}
        <div style={{ 
          display: "flex", 
          flexDirection: (currentStep === 1 || currentStep === 2) ? (isMobile ? "column" : "row") : "row",
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "30px",
          gap: (currentStep === 1 || currentStep === 2) ? (isMobile ? "20px" : "40px") : "0"
        }}>
          {currentStep === 1 ? (
            <>
              <div style={{ 
                textAlign: "center", 
                width: isMobile ? "100%" : "50%",
                flex: isMobile ? "none" : "1"
              }}>
                <img 
                  src={currentStepData.leftImage} 
                  alt="Left Control"
                  style={{ 
                    width: "auto", 
                    height: isMobile ? "120px" : "100px", 
                    marginBottom: "15px",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                    objectFit: "contain"
                  }}
                />
                <div style={{ 
                  color: "white", 
                  fontSize: isMobile ? "10px" : "16px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600"
                }}>
                  {currentStepData.leftLabel}
                </div>
              </div>
              
              {isMobile && (
                <div style={{ 
                  width: "100%", 
                  height: "2px", 
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  margin: "10px 0"
                }} />
              )}
              
              <div style={{ 
                textAlign: "center", 
                width: isMobile ? "100%" : "50%",
                flex: isMobile ? "none" : "1"
              }}>
                <img 
                  src={currentStepData.rightImage} 
                  alt="Right Control"
                  style={{ 
                    width: "auto", 
                    height: isMobile ? "120px" : "100px", 
                    marginBottom: "15px",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                    objectFit: "contain"
                  }}
                />
                <div style={{ 
                  color: "white", 
                  fontSize: isMobile ? "10px" : "16px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600"
                }}>
                  {currentStepData.rightLabel}
                </div>
              </div>
            </>
          ) : currentStep === 2 ? (
            <>
              <div style={{ 
                textAlign: "center", 
                width: isMobile ? "100%" : "60%",
                flex: isMobile ? "none" : "1"
              }}>
                <img 
                  src={currentStepData.leftImage} 
                  alt="Product Interaction"
                  style={{ 
                    width: "auto", 
                    height: isMobile ? "200px" : "250px", 
                    marginBottom: "15px",
                    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
                    objectFit: "contain"
                  }}
                />
                <div style={{ 
                  color: "white", 
                  fontSize: isMobile ? "11px" : "18px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600"
                }}>
                  {currentStepData.leftLabel}
                </div>
              </div>
              
              <div style={{ 
                textAlign: "left", 
                width: isMobile ? "100%" : "40%",
                flex: isMobile ? "none" : "1",
                paddingLeft: isMobile ? "0" : "20px"
              }}>
                <div style={{ 
                  color: "white", 
                  fontSize: isMobile ? "10px" : "16px",
                  lineHeight: "1.6",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "400"
                }}>
                  {currentStepData.description}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          pointerEvents: "auto"
        }}>
          <div style={{ 
            color: "white", 
            fontSize: isMobile ? "9px" : "14px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "500"
          }}>
            {currentStep} of {totalSteps}
          </div>
          
          <div style={{ display: "flex", gap: "10px", pointerEvents: "auto" }}>
            <div
              onClick={currentStep === 1 ? undefined : handlePrevious}
              style={{
                padding: "10px 20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: currentStep === 1 ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "8px",
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
                fontSize: isMobile ? "9px" : "14px",
                fontFamily: "'Poppins', sans-serif",
                pointerEvents: "auto",
                userSelect: "none",
                transition: "all 0.2s ease",
                opacity: currentStep === 1 ? 0.5 : 1,
              }}
            >
              ← Previous
            </div>
            
            <div
              onClick={handleNext}
              style={{
                padding: "10px 20px",
                border: "none",
                backgroundColor: "#FF7F32",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "9px" : "14px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
                pointerEvents: "auto",
                userSelect: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(255, 127, 50, 0.3)",
              }}
            >
              {currentStep === totalSteps ? "Finish" : "Next →"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UI = () => {
  const {brandData} = useBrandStore();

  const shopifyConfig = useMemo(() => {
    if(!brandData) return null;
    
    // Determine country and language based on market from brand data
    let countryCode: "US" | "GB" | "FR" | "IN" | "DE" = "IN"; // Default to India
    let languageCode: "EN" | "FR" | "HI" = "EN"; // Default to English
    
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

  const {
    crosshairVisible,
    hideCrosshair,
    isModalOpen,
    closeModal,
    isCartOpen,
    openCart,
    closeCart,
    isWishlistOpen,
    openWishlist,
    closeWishlist,
    isInfoModalOpen,
    openInfoModal,
    closeInfoModal,
    discountCode,
    isDiscountModalOpen,
    closeDiscountModal,
    isSettingsModalOpen,
    openSettingsModal,
    closeSettingsModal,
    isAudioPlaying,
    setSearchResult,
    startSearchGSAP,
    isTermsModalOpen,
    isContactModalOpen,
    isProductSearcherOpen,
    openProductSearcher,
    closeProductSearcher,
  } = useComponentStore();
  const { activateDriver, deactivateDriver } = useDriverStore();
  const { setTourComplete } = useTourStore();

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const shouldMoveCamera = useRef(false);

  const [ChatbotOpen, setChatbotOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );

  // Custom tour state
  const [tourVisible, setTourVisible] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(1);
  const totalTourSteps = 7;

  const openChatbotModal = () => {
    setChatbotOpen(true);
  };

  const closeChatbotModal = () => {
    setChatbotOpen(false);
  };

  useEffect(() => {
    if (audioPlayerRef.current) {
      if (isAudioPlaying) {
        audioPlayerRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
    } else {
        audioPlayerRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  // Update audio source when brand data changes
  useEffect(() => {
    if (audioPlayerRef.current && brandData?.brand_music_url) {
      audioPlayerRef.current.load(); // Reload audio with new source
    }
  }, [brandData?.brand_music_url]);

  const startTour = () => {
    if (isModalOpen) closeModal();
    if (isCartOpen) closeCart();
    if (isWishlistOpen) closeWishlist();
    if (isInfoModalOpen) closeInfoModal();
    if (ChatbotOpen) closeChatbotModal();
    if (isDiscountModalOpen) closeDiscountModal();
    if (isSettingsModalOpen) closeSettingsModal();
    if (isProductSearcherOpen) closeProductSearcher();

    setTourVisible(true);
    setCurrentTourStep(1);
      activateDriver();
  };

  const nextTourStep = () => {
    if (currentTourStep < totalTourSteps) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      endTour();
    }
  };

  const previousTourStep = () => {
    if (currentTourStep > 1) {
      setCurrentTourStep(currentTourStep - 1);
    }
  };

  const endTour = () => {
    setTourVisible(false);
    setCurrentTourStep(1);
    deactivateDriver();
    // Removed setTourComplete(true) to prevent camera animation
  };



  return (
    <>
      {shopifyConfig && brandData ? (
        <ShopifyProvider
          storeDomain={shopifyConfig.storeDomain}
          storefrontToken={shopifyConfig.storefrontToken}
          storefrontApiVersion={shopifyConfig.storefrontApiVersion}
          countryIsoCode={shopifyConfig.countryIsoCode}
          languageIsoCode={shopifyConfig.languageIsoCode}
        >
          <CartProvider>
            <div className="ui-root">
              {crosshairVisible && !isMobile && <div className={styles.aim} />}

              <div className={styles.iconsContainer}>
                <img
                  src="/icons/Search.svg"
                  alt="Search"
                  className={styles.icon}
                  onClick={openProductSearcher}
                  style={{
                    zIndex: tourVisible && currentTourStep === 3 ? 10000 : 1,
                    filter: tourVisible && currentTourStep === 3 ? "invert(1)" : "none"
                  }}
                />
                <div style={{ position: "relative" }}>
                  <img
                    src="/icons/Cart.svg"
                    alt="Cart"
                    className={styles.icon}
                    onClick={openCart}
                    style={{
                      zIndex: tourVisible && currentTourStep === 4 ? 10000 : 1,
                      filter: tourVisible && currentTourStep === 4 ? "invert(1)" : "none"
                    }}
                  />
                  <CartCount />
                </div>
                <img
                  src="/icons/Wishlist.svg"
                  alt="Wishlist"
                  className={styles.icon}
                  onClick={openWishlist}
                  style={{
                    zIndex: tourVisible && currentTourStep === 5 ? 10000 : 1,
                    filter: tourVisible && currentTourStep === 5 ? "invert(1)" : "none"
                  }}
                />
                <img
                  src="/icons/Settings.svg"
                  alt="Settings"
                  className={styles.icon}
                  onClick={openSettingsModal}
                  style={{
                    zIndex: tourVisible && currentTourStep === 6 ? 10000 : 1,
                    filter: tourVisible && currentTourStep === 6 ? "invert(1)" : "none"
                  }}
                />
                <img
                  src="/icons/Help.svg"
                  alt="Help"
                  className={styles.icon}
                  onClick={startTour}
                />
              </div>

              <div className={styles.brandLogoContainer}>
                <img src="/shackit.png" alt="Brand Logo" className={styles.brandLogo} />
              </div>

              <div 
                className={styles.chatLogoContainer}
                style={{
                  zIndex: tourVisible && currentTourStep === 7 ? 10000 : 1,
                  filter: tourVisible && currentTourStep === 7 ? "invert(1)" : "none"
                }}
              >
                <img
                  src="/icons/Whatsapp.png"
                  alt="WhatsApp"
                  className={styles.chatLogo}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    const contactNumber = Number(brandData?.contact_number.replace(/[^a-zA-Z0-9]/g, ''));
                    window.open(`https://wa.me/${contactNumber}`, '_blank');
                  }}
                />
              </div>

              {isModalOpen && <Modal />}
              {isCartOpen && <Cart></Cart>}
              {isWishlistOpen && <Wishlist></Wishlist>}
              {isInfoModalOpen && <InfoModal></InfoModal>}
              {isTermsModalOpen && <TermsConditionsModal />}
              {isContactModalOpen && <ContactUsModal />}
              <DiscountModal
                isOpen={isDiscountModalOpen}
                onClose={closeDiscountModal}
                discountCode={discountCode}
              />
              {isSettingsModalOpen && (
                <ModalWrapper>
                  <SettingsModal />
                </ModalWrapper>
              )}
              {isProductSearcherOpen && <ProductSearcher></ProductSearcher>}
              <div>
                <ChatbotModal
                  isChatbotModalOpen={ChatbotOpen}
                  onChatbotModalClose={() => {
                    closeChatbotModal();
                  }}
                />
              </div>
              <audio
                ref={audioPlayerRef}
                src={brandData?.brand_music_url || "/media/Soundtrack.mp3"}
                autoPlay={false}
                loop
                preload="metadata"
                onError={(e) => {
                  console.error('Audio loading error:', e);
                }}
              />

              {/* Custom Tour Popover */}
              <TourPopover
                isVisible={tourVisible}
                currentStep={currentTourStep}
                totalSteps={totalTourSteps}
                onNext={nextTourStep}
                onPrevious={previousTourStep}
                onClose={endTour}
                isMobile={isMobile}
              />
            </div>
          </CartProvider>
        </ShopifyProvider>
      ) : (
        <div className="ui-root">
          {crosshairVisible && !isMobile && <div className={styles.aim} />}
          <div className={styles.iconsContainer}>
            <img
              src="/icons/Search.svg"
              alt="Search"
              className={styles.icon}
              onClick={openProductSearcher}
              style={{
                zIndex: tourVisible && currentTourStep === 3 ? 10000 : 1,
                filter: tourVisible && currentTourStep === 3 ? "invert(1)" : "none"
              }}
            />
            <div style={{ position: "relative" }}>
              <img
                src="/icons/Cart.svg"
                alt="Cart"
                className={styles.icon}
                onClick={openCart}
                style={{
                  zIndex: tourVisible && currentTourStep === 4 ? 10000 : 1,
                  filter: tourVisible && currentTourStep === 4 ? "invert(1)" : "none"
                }}
              />
            </div>
            <img
              src="/icons/Wishlist.svg"
              alt="Wishlist"
              className={styles.icon}
              onClick={openWishlist}
              style={{
                zIndex: tourVisible && currentTourStep === 5 ? 10000 : 1,
                filter: tourVisible && currentTourStep === 5 ? "invert(1)" : "none"
              }}
            />
            <img
              src="/icons/Settings.svg"
              alt="Settings"
              className={styles.icon}
              onClick={openSettingsModal}
              style={{
                zIndex: tourVisible && currentTourStep === 6 ? 10000 : 1,
                filter: tourVisible && currentTourStep === 6 ? "invert(1)" : "none"
              }}
            />
            <img
              src="/icons/Help.svg"
              alt="Help"
              className={styles.icon}
              onClick={startTour}
            />
          </div>

          <div className={styles.brandLogoContainer}>
            <img src="/shackit.png" alt="Brand Logo" className={styles.brandLogo} />
          </div>

          <div 
            className={styles.chatLogoContainer}
            style={{
              zIndex: tourVisible && currentTourStep === 7 ? 10000 : 1,
              filter: tourVisible && currentTourStep === 7 ? "invert(1)" : "none"
            }}
          >
            <img
              src="/icons/Whatsapp.png"
              alt="WhatsApp"
              className={styles.chatLogo}
              onPointerDown={(e) => {
                e.preventDefault();
                const contactNumber = Number(brandData?.contact_number.replace(/[^a-zA-Z0-9]/g, ''));
                window.open(`https://wa.me/${contactNumber}`, '_blank');
              }}
            />
          </div>

          {isWishlistOpen && <Wishlist></Wishlist>}
          {isInfoModalOpen && <InfoModal></InfoModal>}
          {isTermsModalOpen && <TermsConditionsModal />}
          {isContactModalOpen && <ContactUsModal />}
          <DiscountModal
            isOpen={isDiscountModalOpen}
            onClose={closeDiscountModal}
            discountCode={discountCode}
          />
          {isSettingsModalOpen && (
            <ModalWrapper>
              <SettingsModal />
            </ModalWrapper>
          )}
          {isProductSearcherOpen && <ProductSearcher></ProductSearcher>}
          <div>
            <ChatbotModal
              isChatbotModalOpen={ChatbotOpen}
              onChatbotModalClose={() => {
                closeChatbotModal();
              }}
            />
          </div>
          <audio
            ref={audioPlayerRef}
            src={brandData?.brand_music_url || "/media/Soundtrack.mp3"}
            autoPlay={false}
            loop
            preload="metadata"
            onError={(e) => {
              console.error('Audio loading error:', e);
            }}
          />

          {/* Custom Tour Popover */}
          <TourPopover
            isVisible={tourVisible}
            currentStep={currentTourStep}
            totalSteps={totalTourSteps}
            onNext={nextTourStep}
            onPrevious={previousTourStep}
            onClose={endTour}
            isMobile={isMobile}
          />
        </div>
      )}
    </>
  );
};

export default UI;
