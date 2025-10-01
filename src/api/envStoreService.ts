import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";
import { CLOUD_RUN_ENDPOINTS } from './cloudUtil';

const PRIMARY_URL = CLOUD_RUN_ENDPOINTS.ENV_STORE.GET_ENV_DATA;
const FALLBACK_URL = CLOUD_RUN_ENDPOINTS.ENV_STORE.GET_ENV_DATA_FALLBACK;

const EnvStoreService = {
  getEnvData: async function (brandName: string) : Promise<{envProducts: {[id: number]: EnvProduct}, envAssets: {[id: string]: EnvAsset}}> {
    try{
      // Determine domain extension based on current window URL
      const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
      
      // Try primary endpoint first
      const primaryResponse = await fetch(`${PRIMARY_URL}?brandname=${brandName}.shackit.${domainExtension}`, {
        method: 'GET'
      });

      if(primaryResponse.ok){
        return primaryResponse.json();
      }
      
      // Check if it's a 404 with "Brand not found" error
      if(primaryResponse.status === 404) {
        try {
          const errorData = await primaryResponse.json();
          if(errorData.error === "Brand not found") {
            console.log('Primary endpoint returned "Brand not found", trying fallback endpoint...');
            
            // Try fallback endpoint
            const fallbackResponse = await fetch(`${FALLBACK_URL}?brandname=${brandName}.shackit.${domainExtension}`, {
              method: 'GET'
            });
            
            if(fallbackResponse.ok){
              console.log('Fallback endpoint succeeded');
              return fallbackResponse.json();
            } else {
              console.log('Fallback endpoint also failed');
              // Return empty data structure if fallback also fails
              return {
                envProducts: {},
                envAssets: {}
              };
            }
          }
        } catch (jsonError) {
          console.error('Error parsing primary response JSON:', jsonError);
        }
      }
      
      // Return empty data structure for other error cases
      return {
        envProducts: {},
        envAssets: {}
      };
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