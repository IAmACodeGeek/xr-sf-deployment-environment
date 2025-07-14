// Centralized Cloud Function Endpoints Configuration
// All functions run in asia-south1 under a single base URL.

// Base URL for every Cloud Function revision
const CLOUD_FUNCTION_BASE_URL = 'https://asia-south1-nodal-vigil-460311-q8.cloudfunctions.net';
/** Helper to build the full URL for a Cloud Function by name */
const fn = (name: string): string => `${CLOUD_FUNCTION_BASE_URL}/${name}`;

export const CLOUD_RUN_ENDPOINTS = {
  // Product Fetch API
  PRODUCT_FETCH: {
    SHOPIFY_PRODUCTS: fn('function-14'),
  },

  // Own Store API
  OWN_STORE: {
    FETCH_PRODUCTS: fn('fetch-products-by-vendor'),
  },

  // Environment Store API
  ENV_STORE: {
    GET_ENV_DATA: fn('get-env-data'),
  },

  // Brand Form API
  BRAND_FORM: {
    GET_BRAND_DETAILS: fn('get-brand-details-via-customurl'),
  },
};

// Usage Example:
// import { CLOUD_RUN_ENDPOINTS } from './cloudUtil';
// fetch(`${CLOUD_RUN_ENDPOINTS.PRODUCT_FETCH.SHOPIFY_PRODUCTS}?brandname=...`) 