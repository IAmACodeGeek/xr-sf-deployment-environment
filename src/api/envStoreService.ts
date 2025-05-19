import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";

const BASE_URL = "https://get-env-data-201137466588.asia-south1.run.app?brandname=";

const EnvStoreService = {
  getEnvData: async function (brandName: string) : Promise<{envProducts: {[id: number]: EnvProduct}, envAssets: {[id: string]: EnvAsset}}> {
    try{
      const response = await fetch(BASE_URL + brandName, {
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