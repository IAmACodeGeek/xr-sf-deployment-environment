import { create } from "zustand";

// ✅ Define the interface for Brand Data
interface BrandData {
  id: string;
  brand_name: string;
  brand_logo_url: string;
  brand_poster_url: string;
  brand_video_url: string;
  environment_name: string;
  product_ids: string[];
  shopify_admin_api_pass: string;
  shopify_api_key: string;
  shopify_api_secret: string;
  shopify_store_name: string;
  shopify_storefront_access_token: string;
}

// ✅ Define Zustand Store Interface
interface BrandStore {
  brandData: BrandData | null;
  setBrandData: (data: BrandData) => void;
}

// ✅ Create Zustand Store
const useBrandStore = create<BrandStore>((set) => ({
  brandData: null,
  setBrandData: (data) => set({ brandData: data }),
}));

export { useBrandStore };
