import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";
import { CLOUD_RUN_ENDPOINTS } from './cloudUtil';

const BASE_URL = CLOUD_RUN_ENDPOINTS.ENV_STORE.GET_ENV_DATA;

const EnvStoreService = {
  getEnvData: async function (brandName: string) : Promise<{envProducts: {[id: number]: EnvProduct}, envAssets: {[id: string]: EnvAsset}}> {
    try{
      // Determine domain extension based on current window URL
      const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
      
      const response = await fetch(`${BASE_URL}?brandname=${brandName}.shackit.${domainExtension}`, {
        method: 'GET'
      });
      return await response.json();
    }
    catch(error){
      console.error(error);
      return {
        envProducts: {},
        envAssets: {}
      };
    }
  }
};

export default EnvStoreService;