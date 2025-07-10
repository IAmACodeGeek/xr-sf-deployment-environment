const BASE_URL = 'https://get-brand-details-via-customurl-201137466588.asia-south1.run.app';

const BrandService = {
  fetchBrandData: async function(brandName: string){
    try{
      // Determine domain extension based on current window URL
      const domainExtension = window.location.hostname.includes('shackit.in') ? 'com' : 'in';
      
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