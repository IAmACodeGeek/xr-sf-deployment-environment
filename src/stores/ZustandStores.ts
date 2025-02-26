import Product from "@/Types/Product";
import { create } from "zustand";

interface ResourceFetchStore {
  // Products loading
  productsLoading: boolean;
  productsLoaded: boolean;
  setProductsLoading: (value: boolean) => void;
  setProductsLoaded: (value: boolean) => void;

  envItemsLoaded: boolean;
  setEnvItemsLoaded: (value: boolean) => void;
  envItemsLoading: boolean;
  setEnvItemsLoading: (value: boolean) => void;
}

const useResourceFetchStore = create<ResourceFetchStore>((set) => ({
  // Products
  productsLoading: false,
  setProductsLoading: (value: boolean) => set({productsLoading: value}),
  productsLoaded: false,
  setProductsLoaded: (value: boolean) => set({productsLoaded: value}),

  // EnvAssets and EnvProducts
  envItemsLoaded: false,
  setEnvItemsLoaded: (value: boolean) => set({envItemsLoaded: value}),
  envItemsLoading: false,
  setEnvItemsLoading: (value: boolean) => set({envItemsLoading: value}),
}));

interface ComponentStore {
  // Crosshair handling
  crosshairVisible: boolean;
  showCrosshair: () => void;
  hideCrosshair: () => void;

  // Product handling
  products: Product[];
  selectedProduct: Product | undefined;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (productId: number) => void;

  // Search Handling 
  searchResult: { x: number; y: number; z: number } | null; 
  initiateSearchGSAP: boolean; 
  setSearchResult: (position: { x: number; y: number; z: number }) => void;
  startSearchGSAP: () => void;
  resetSearchGSAP: () => void;

  // Modal Handling
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Cart Handling
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Wishlist Handling
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;

  // Info Handling
  isInfoModalOpen: boolean;
  openInfoModal: () => void;
  closeInfoModal: () => void;

  // Terms Handling
  isTermsModalOpen: boolean;
  openTermsModal: () => void;
  closeTermsModal: () => void;

  // Contact Handling
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;

  // Settings Handling
  isSettingsModalOpen: boolean;
  isAudioPlaying: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  setAudioPlaying: (play: boolean) => void;

  // Discount Handling
  discountCode: string;
  isDiscountModalOpen: boolean;
  openDiscountModal: () => void;
  closeDiscountModal: () => void;
  setDiscountCode: (code: string) => void;

  // Product Searcher
  isProductSearcherOpen: boolean;
  openProductSearcher: () => void;
  closeProductSearcher: () => void;
}

const useComponentStore = create<ComponentStore>((set) => ({
  // Crosshair
  crosshairVisible: true,
  showCrosshair: () => set({ crosshairVisible: true }),
  hideCrosshair: () => set({ crosshairVisible: false }),

  // Product Handling
  products: [],
  selectedProduct: undefined,
  setProducts: (products: Product[]) => set({ products }),
  setSelectedProduct: (productId: number) =>
    set((state: { products: Product[] }) => {
      const finalProduct = state.products.find(
        (product: Product) => product.id === productId
      );
      return { ...state, selectedProduct: finalProduct };
    }),
  
  // Search Handling 
  searchResult: null,
  initiateSearchGSAP: false,
  setSearchResult: (position: { x: number; y: number; z: number }) =>
    set({ searchResult: position }),
  startSearchGSAP: () => set({ initiateSearchGSAP: true }),
  resetSearchGSAP: () =>
    set({
      searchResult: null,
      initiateSearchGSAP: false,
    }),

  // Modal Handling
  isModalOpen: false,
  openModal: () => {
    set({ crosshairVisible: false });
    set({ isModalOpen: true });
  },
  closeModal: () => {
    set({ crosshairVisible: true });
    set({ isModalOpen: false });
  },

  // Cart Handling
  isCartOpen: false,
  openCart: () => {
    set({ crosshairVisible: false });
    set({ isCartOpen: true });
  },
  closeCart: () => {
    set({ crosshairVisible: true });
    set({ isCartOpen: false });
  },

  // Wishlist Handling
  isWishlistOpen: false,
  openWishlist: () => {
    set({ crosshairVisible: false });
    set({ isWishlistOpen: true });
  },
  closeWishlist: () => {
    set({ crosshairVisible: true });
    set({ isWishlistOpen: false });
  },

  // Info Handling
  isInfoModalOpen: false,
  openInfoModal: () => {
    set({ crosshairVisible: false });
    set({ isInfoModalOpen: true });
  },
  closeInfoModal: () => {
    set({ crosshairVisible: false });
    set({ isInfoModalOpen: false });
  },

  // Terms Handling
  isTermsModalOpen: false,
  openTermsModal: () => {
    set({ crosshairVisible: false });
    set({ isTermsModalOpen: true });
  },
  closeTermsModal: () => {
    set({ crosshairVisible: false });
    set({ isTermsModalOpen: false });
  },

  // Contact Handling
  isContactModalOpen: false,
  openContactModal: () => {
    set({ crosshairVisible: false });
    set({ isContactModalOpen: true });
  },
  closeContactModal: () => {
    set({ crosshairVisible: false });
    set({ isContactModalOpen: false });
  },

  // Settings Handling
  isSettingsModalOpen: false,
  isAudioPlaying: false,
  openSettingsModal: () => {
    set({ crosshairVisible: false });
    set({ isSettingsModalOpen: true });
  },
  closeSettingsModal: () => {
    set({ crosshairVisible: true });
    set({ isSettingsModalOpen: false });
  },
  setAudioPlaying: (play: boolean) => set({ isAudioPlaying: play }),

  // Discount Handling
  discountCode: "",
  isDiscountModalOpen: false,
  openDiscountModal: () => {
    set({ crosshairVisible: false });
    set({ isDiscountModalOpen: true });
  },
  closeDiscountModal: () => {
    set({ crosshairVisible: true });
    set({ isDiscountModalOpen: false });
  },
  setDiscountCode: (code: string) => set({ discountCode: code }),

  // Product Searcher
  isProductSearcherOpen: false,
  openProductSearcher: () => set({ isProductSearcherOpen: true }),
  closeProductSearcher: () => set({ isProductSearcherOpen: false }),
}));

// Pointer lock handling
interface PointerLockStore {
  isPointerLocked: boolean;
  lockPointer: () => void;
  unlockPointer: () => void;
}

const usePointerLockStore = create<PointerLockStore>((set) => ({
  isPointerLocked: false,
  lockPointer: () => set({ isPointerLocked: true }),
  unlockPointer: () => set({ isPointerLocked: false }),
}));

// Touch handling
interface TouchStore {
  isTouchEnabled: boolean;
  enableTouch: () => void;
  disableTouch: () => void;
}

const useTouchStore = create<TouchStore>((set) => ({
  isTouchEnabled: false,
  enableTouch: () => set({ isTouchEnabled: true }),
  disableTouch: () => set({ isTouchEnabled: false }),
}));

// Driver handling
interface DriverStore {
  driverActive: boolean;
  activateDriver: () => void;
  deactivateDriver: () => void;
}

const useDriverStore = create<DriverStore>((set) => ({
  driverActive: false,
  activateDriver: () => set({ driverActive: true }),
  deactivateDriver: () => set({ driverActive: false }),
}));

// Tour handling
interface TourStore {
  tourComplete: boolean;
  setTourComplete: (value: boolean) => void;
}

const useTourStore = create<TourStore>((set) => ({
  tourComplete: false,
  setTourComplete: (value) => set({ tourComplete: value }),
}));

// Environment Product Handling
interface EnvProduct {
  id: number;
  type?: "MODEL_3D" | "PHOTO";
  imageIndex?: number | undefined;
  modelIndex?: number | undefined;
  placeHolderId?: number | undefined;
  position?: number[];
  rotation?: number[];
  scale?: number;
}

interface EnvProductStore {
  envProducts: {[id: number]: EnvProduct};
  setEnvProducts: (envProducts: {[id: number]: EnvProduct}) => void;
  modifyEnvProduct: (id: number, envProduct: EnvProduct) => void;
}

const useEnvProductStore = create<EnvProductStore>((set) => ({
  envProducts: {},
  setEnvProducts: (envProducts: {[id: number]: EnvProduct}) => set({envProducts: envProducts}),
  modifyEnvProduct: (id: number, envProduct: EnvProduct) => set((state: { envProducts: { [id: number]: EnvProduct } }) => ({
    envProducts: {
      ...state.envProducts,
      [id]: { ...state.envProducts[id], ...envProduct },
    },
  }))
}));

interface EnvAsset {
  id: string;
  type: "MODEL_3D" | "PHOTO";
  placeHolderId?: number | undefined;
  position?: number[];
  rotation?: number[];
  scale?: number;
  src: string;
  name: string;
}

interface EnvAssetStore {
  envAssets: {[id: string]: EnvAsset};
  setEnvAssets: (envAssets: {[id: string]: EnvAsset}) => void;
  modifyEnvAsset: (id: string, envAsset: EnvAsset) => void;
}

const useEnvAssetStore = create<EnvAssetStore>((set) => ({
  envAssets: {},
  setEnvAssets: (envAssets: {[id: string]: EnvAsset}) => set({envAssets: envAssets}),
  modifyEnvAsset: (id: string, envAsset: EnvAsset) => set((state: {envAssets: {[id: string]: EnvAsset}}) => ({
    envAssets: {
      ...state.envAssets,
      [id]: {...state.envAssets[id], ...envAsset}
    }
  }))
}));

// Dynamic Loading of Environment
interface EnvironmentStore {
  environmentType: string | undefined;
  setEnvironmentType: (value: string) => void;
}

const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environmentType: undefined,
  setEnvironmentType: (value: string) =>  set({environmentType: value})
}));

interface BrandData {
  id: string;
  brand_name: string;
  brand_logo_url: string;
  brand_poster_url: string;
  brand_video_url: string;
  environment_name: string;
  email: string;
}

interface BrandStore {
  brandData: BrandData | null;
  setBrandData: (data: BrandData) => void;
}

const useBrandStore = create<BrandStore>((set) => ({
  brandData: null,
  setBrandData: (data) => set({ brandData: data }),
}));

export {
  useResourceFetchStore,
  useComponentStore,
  usePointerLockStore,
  useTouchStore,
  useDriverStore,
  useTourStore,
  useEnvProductStore,
  useEnvAssetStore,
  useEnvironmentStore,
  useBrandStore
};
export type {EnvProduct, EnvAsset};
