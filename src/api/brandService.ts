import { CLOUD_RUN_ENDPOINTS } from './cloudUtil';

const BASE_URL = CLOUD_RUN_ENDPOINTS.BRAND_FORM.GET_BRAND_DETAILS;

const BrandService = {
  fetchBrandData: async function(brandName: string){
    try{
      // Determine domain extension based on current window URL
      const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
      
      const response = await fetch(`${BASE_URL}?customurl=${brandName}.shackit.${domainExtension}`, {
        method: 'GET'
      });

      if(response.ok){
        return response.json();
      }
      else {
        return response;
      }
    }
    catch(error){
      console.error(error); 
    }
  }
};

export default BrandService;