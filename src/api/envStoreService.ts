import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";

const BASE_URL = "https://get-env-data-201137466588.asia-south1.run.app";

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