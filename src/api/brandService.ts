import { CLOUD_RUN_ENDPOINTS } from './cloudUtil';

const PRIMARY_URL = CLOUD_RUN_ENDPOINTS.BRAND_FORM.GET_BRAND_DETAILS;
const FALLBACK_URL = CLOUD_RUN_ENDPOINTS.BRAND_FORM.GET_BRAND_DETAILS_FALLBACK;

const BrandService = {
  fetchBrandData: async function(brandName: string){
    try{
      // Determine domain extension based on current window URL
      const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
      
      // Try primary endpoint first
      const primaryResponse = await fetch(`${PRIMARY_URL}?customurl=${brandName}.shackit.${domainExtension}`, {
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
            const fallbackResponse = await fetch(`${FALLBACK_URL}?customurl=${brandName}.shackit.${domainExtension}`, {
              method: 'GET'
            });
            
            if(fallbackResponse.ok){
              console.log('Fallback endpoint succeeded');
              return fallbackResponse.json();
            } else {
              console.log('Fallback endpoint also failed');
              return fallbackResponse;
            }
          }
        } catch (jsonError) {
          console.error('Error parsing primary response JSON:', jsonError);
        }
      }
      
      // Return the original response if it's not a 404 with "Brand not found"
      return primaryResponse;
    }
    catch(error){
      console.error(error); 
    }
  }
};

export default BrandService;