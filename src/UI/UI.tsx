import { useEffect, useMemo, useRef, useState } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
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
import ReactAudioPlayer from "react-audio-player";
import ModalWrapper from "@/UI/Components/ModalWrapper";
import ProductSearcher from "@/UI/Components/ProductSearcher";
import { showPremiumPopup } from "./Components/PremiumRequired";

const customDriverStyles = `
  .driver-popover {
    font-family: 'Poppins', sans-serif !important;
  }
  
  .driver-popover * {
    font-family: 'Poppins', sans-serif !important;
  }
  
  .driver-popover-title {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
    font-size: 18px !important;
  }
  
  .driver-popover-description {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400 !important;
    font-size: 14px !important;
  }
  
  .driver-popover-progress-text {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400 !important;
  }
  
  .driver-popover-footer button {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 500 !important;
  }
`;


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

  const driverRef = useRef<Driver>(undefined);
  const audioPlayerRef = useRef<any>(null);
  const shouldMoveCamera = useRef(false);

  const [ChatbotOpen, setChatbotOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );

  const openChatbotModal = () => {
    setChatbotOpen(true);
  };

  const closeChatbotModal = () => {
    setChatbotOpen(false);
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customDriverStyles;
    document.head.appendChild(styleSheet);

    driverRef.current = driver({
      showProgress: true,
      steps: [
        {
          element: ".iconsContainer",
          popover: {
            title: "Navigation & Controls",
            description: isMobile
              ? "Use the virtual joystick to move around and interact with products"
              : "Use WASD keys to navigate: W (up), A (left), S (down), D (right)",
            side: "left",
            align: "start",
          },
        },
        {
          popover: {
            title: "Find products across the experience",
            description:
              "Walk to these products to essentially buy or add them to cart, I'll drop you off for now!",
          },
          onHighlightStarted: () => {
            shouldMoveCamera.current = true;
            setTourComplete(true);
          },
        },
        {
          element: '[alt="Cart"]',
          popover: {
            title: "Shopping Cart",
            description: "View and manage items in your shopping cart",
            side: "bottom",
          },
        },
        {
          element: '[alt="Wishlist"]',
          popover: {
            title: "Wishlist",
            description: "Save items for later in your wishlist",
            side: "bottom",
          },
        },
        {
          element: '[alt="Settings"]',
          popover: {
            title: "Settings",
            description:
              "Manage your preferences, explore app features, and customize your experience.",
            side: "bottom",
          },
        },
        {
          element: '[alt="Chatbot"]',
          popover: {
            title: "Chat Assistant",
            description: "Need help? Chat with our virtual assistant",
            side: "left",
          },
        },
      ],
    });

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isAudioPlaying) {
      audioPlayerRef.current.audioEl.current.play();
    } else {
      audioPlayerRef.current.audioEl.current.pause();
    }
  }, [isAudioPlaying]);

  const startTour = () => {
    if (isModalOpen) closeModal();
    if (isCartOpen) closeCart();
    if (isWishlistOpen) closeWishlist();
    if (isInfoModalOpen) closeInfoModal();
    if (ChatbotOpen) closeChatbotModal();
    if (isDiscountModalOpen) closeDiscountModal();
    if (isSettingsModalOpen) closeSettingsModal();
    if (isProductSearcherOpen) closeProductSearcher();

    if (driverRef.current) {
      driverRef.current.drive();
      activateDriver();
    }
  };

  useEffect(() => {
    let lastState = driverRef.current?.isActive();
    const checkDriverState = () => {
      const currentState = driverRef.current?.isActive();
      if (currentState !== lastState) {
        lastState = currentState;
        if (currentState) {
          activateDriver();
        } else {
          deactivateDriver();
        }
      }
    };

    const interval = setInterval(checkDriverState, 100);

    return () => clearInterval(interval);
  }, [activateDriver, deactivateDriver]);

  return (
    <div className="ui-root">
      {crosshairVisible && !isMobile && <div className={styles.aim} />}

      <div className={styles.iconsContainer}>
        <img
          src="/icons/Search.svg"
          alt="Search"
          className={styles.icon}
          onClick={openProductSearcher}
        />
        <img
          src="/icons/Cart.svg"
          alt="Cart"
          className={styles.icon}
          onClick={openCart}
        />
        <img
          src="/icons/Wishlist.svg"
          alt="Wishlist"
          className={styles.icon}
          onClick={openWishlist}
        />
        <img
          src="/icons/Settings.svg"
          alt="Settings"
          className={styles.icon}
          onClick={openSettingsModal}
        />
        <img
          src="/icons/Help.svg"
          alt="Help"
          className={styles.icon}
          onClick={startTour}
        />
      </div>

      <div className={styles.brandLogoContainer}>
        <img src="/logo.avif" alt="Brand Logo" className={styles.brandLogo} />
      </div>

      <div className={styles.chatLogoContainer}>
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

      {shopifyConfig && brandData && (
        <ShopifyProvider
          storeDomain={shopifyConfig.storeDomain}
          storefrontToken={shopifyConfig.storefrontToken}
          storefrontApiVersion={shopifyConfig.storefrontApiVersion}
          countryIsoCode={shopifyConfig.countryIsoCode}
          languageIsoCode={shopifyConfig.languageIsoCode}
        >
          <CartProvider>
            {isModalOpen && <Modal />}
            {isCartOpen && <Cart></Cart>}
          </CartProvider>
        </ShopifyProvider>
      )}
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
      <ReactAudioPlayer
        ref={audioPlayerRef}
        src="/media/Soundtrack.mp3"
        autoPlay={false}
        loop
      />
    </div>
  );
};

export default UI;
