import Variant from '@/Types/Variant';
import Product from '../Types/Product';
import { CLOUD_RUN_ENDPOINTS } from './cloudUtil';

const PRIMARY_URL = CLOUD_RUN_ENDPOINTS.PRODUCT_FETCH.SHOPIFY_PRODUCTS;
const FALLBACK_URL = CLOUD_RUN_ENDPOINTS.PRODUCT_FETCH.SHOPIFY_PRODUCTS_FALLBACK;
const OWN_STORE_PRODUCT_URL = CLOUD_RUN_ENDPOINTS.OWN_STORE.FETCH_PRODUCTS + '?vendor=';

interface ProductResponse {
  data: {
    products: {
      edges: {
        node: {
          id: string,
          title: string,
          status: string,
          media: {
            edges: {
              node: {
                mediaContentType: string,
                image?: {
                  url: string,
                  altText: string
                },
                id?: string,
                sources?: {
                  url: string,
                  format: string,
                  mimeType: string
                }[]
              }
            }[]
          }
          options: {
            id: string,
            name: string,
            position: number,
            values: string[]
          }[],
          variants: {
            edges: {
              node: {
                id: string,
                title: string,
                price?: string,
                compareAtPrice?: string,
                availableForSale: boolean,
                inventoryQuantity: number,
                selectedOptions: {
                  name: string,
                  value: string
                }[],
                contextualPricing?: {
                  price?: {
                    amount: string;
                    currencyCode: string;
                  };
                  compareAtPrice?: {
                    amount: string;
                    currencyCode: string;
                  };
                };
              }
            }[]
          },
          tags:string[],
          metafields:{
            edges:{
              node:{
                namespace: string,
                key: string,
                value: string,
                type: string,
                description: string,
              }
            }[]
          }
          descriptionHtml: string
        }
      }[]
    }
  }
}

export const ProductService = {
  async getAllProducts(brandName: string, brandData?: any): Promise<Product[]> {
    // Determine region and country based on brand market
    let region = "india"; // default to india region
    let country = ""; // no country for india region
    
    if (brandData?.market) {
      switch (brandData.market) {
        case "USD":
        case "GBP":
        case "EUR":
        case "GER":
        case "INR":
        case "UAE":
        case "AUS":
          region = "global";
          switch (brandData.market) {
            case "USD":
              country = "US";
              break;
            case "GBP":
              country = "GB";
              break;
            case "EUR":
              country = "FR";
              break;
            case "GER":
              country = "DE";
              break;
            case "INR":
              country = "IN";
              break;
            case "UAE":
              country = "AE";
              break;
            case "AUS":
              country = "AU";
              break;
          }
          break;
        default:
          region = "india";
          country = "";
      }
    }

    // Try primary endpoint first
    const primaryUrl = new URL(PRIMARY_URL + '?brandname=' + brandName);
    primaryUrl.searchParams.set('region', region);
    if (country) {
      primaryUrl.searchParams.set('country', country);
    }

    const primaryResponse = await fetch(primaryUrl.toString());
    
    // Check if primary endpoint failed with 404 "Brand not found"
    if (primaryResponse.status === 404) {
      try {
        const errorData = await primaryResponse.json();
        if (errorData.error === "Brand not found") {
          console.log('Primary endpoint returned "Brand not found", trying fallback endpoint...');
          
          // Try fallback endpoint
          const fallbackUrl = new URL(FALLBACK_URL + '?brandname=' + brandName);
          fallbackUrl.searchParams.set('region', region);
          if (country) {
            fallbackUrl.searchParams.set('country', country);
          }
          
          const fallbackResponse = await fetch(fallbackUrl.toString());
          
          if (fallbackResponse.ok) {
            console.log('Fallback endpoint succeeded');
            const resultJSON: ProductResponse = await fallbackResponse.json();
            return this.processProducts(resultJSON, brandData);
          } else {
            console.log('Fallback endpoint also failed');
            throw new Error('Both primary and fallback endpoints failed');
          }
        }
      } catch (jsonError) {
        console.error('Error parsing primary response JSON:', jsonError);
      }
    }

    // Use primary response (either success or non-404 error)
    const resultJSON: ProductResponse = await primaryResponse.json();
    return this.processProducts(resultJSON, brandData);
  },

  processProducts(resultJSON: ProductResponse, brandData?: any): Product[] {
    const products: Product[] = resultJSON.data.products.edges
      .filter((product) => product.node.status === "ACTIVE") // Only include ACTIVE products
      .map((product) => {
      const productImages: { src: string }[] = product.node.media.edges.filter((edge) =>
        edge.node.mediaContentType.toUpperCase() === "IMAGE" 
        && edge.node.image 
      ).map((edge) => {
        return { src: edge.node.image?.url || "" };
      });


      const models: {
        id: string|undefined,
        sources: {
          url: string,
          format: string,
          mimeType: string
        }[] | undefined
      }[] = product.node.media.edges.filter((edge) => 
        edge.node.mediaContentType.toUpperCase() === "MODEL_3D"
        && edge.node.sources
      ).map((edge) => {
        return { 
          id: edge.node.id,
          sources: edge.node.sources
        };
      });

      
      const productVariants: Variant[] = product.node.variants.edges.map((variant) => {
        const v = variant.node;

        // Debug logging
        console.log('Variant pricing data:', {
          variantId: v.id,
          scalarPrice: v.price,
          scalarComparePrice: v.compareAtPrice,
          contextualPricing: v.contextualPricing,
          brandMarket: brandData?.market
        });

        // prefer contextualPricing if it exists, else fall back to scalar
        const priceAmount =
          v.contextualPricing?.price?.amount ?? v.price ?? "0.00";
        const compareAmount =
          v.contextualPricing?.compareAtPrice?.amount ?? v.compareAtPrice ?? undefined;
        const currency =
          v.contextualPricing?.price?.currencyCode ?? brandData?.market ?? "INR";  // use brand market as fallback

        console.log('Processed pricing:', {
          variantId: v.id,
          finalPrice: priceAmount,
          finalComparePrice: compareAmount,
          finalCurrency: currency
        });

        return {
          id: Number(v.id.split("/").pop()),
          price: priceAmount,
          compareAtPrice: compareAmount,
          currencyCode: currency,
          productId: Number(product.node.id.split("/").pop()),
          selectedOptions: v.selectedOptions,
          availableForSale: v.availableForSale,
          inventoryQuantity: v.inventoryQuantity
        };
      });

    
      const arLensLink = product.node.metafields.edges.find((metafield) => 
        metafield.node.namespace === "custom" && metafield.node.key === "snapchat_lens_link"
      )?.node.value;

      const parsedProduct: Product = {
        id: Number(product.node.id.split("/").pop()),
        title: product.node.title,
        description: product.node.descriptionHtml,
        images: productImages,
        options: product.node.options,
        variants: productVariants,
        models: models,
        arLensLink: arLensLink,
        tags: product.node.tags.join(" "),
        status: product.node.status,
      };

      return parsedProduct;
    });

    return products;
  },
  async getAllProductsFromVendor(brandName: string, brandData?: any): Promise<Product[]> {
    // Determine region and country based on brand market
    let region = "global"; // default to global region
    let countryCode = "US"; // default to US
    
    if (brandData?.market) {
      if (brandData.market === "INR") {
        region = "india";
        countryCode = "IN";
      } else {
        region = "global";
        switch (brandData.market) {
          case "USD":
            countryCode = "US";
            break;
          case "GBP":
            countryCode = "GB";
            break;
          case "EUR":
            countryCode = "FR";
            break;
          case "GER":
            countryCode = "DE";
            break;
          case "UAE":
            countryCode = "AE";
              break;
          case "AUS":
            countryCode = "AU";
              break;
          default:
            countryCode = "US";
        }
      }
    }

    const response = await fetch(OWN_STORE_PRODUCT_URL + brandName, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vendor: brandName,
        region: region,
        country: countryCode
      })
    });
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = resultJSON.data.products.edges
      .filter((product) => product.node.status === "ACTIVE") // Only include ACTIVE products
      .map((product) => {
        const productImages: { src: string }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "IMAGE" &&
              edge.node.image
          )
          .map((edge) => {
            return { src: edge.node.image?.url || "" };
          });

        const models: {
          id: string | undefined;
          sources:
            | {
                url: string;
                format: string;
                mimeType: string;
              }[]
            | undefined;
        }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "MODEL_3D" &&
              edge.node.sources
          )
          .map((edge) => {
            return {
              id: edge.node.id,
              sources: edge.node.sources,
            };
          });

        const productVariants: Variant[] = product.node.variants.edges.map(
          (variant) => {
            const v = variant.node;

            // Debug logging
            console.log('Variant pricing data:', {
              variantId: v.id,
              scalarPrice: v.price,
              scalarComparePrice: v.compareAtPrice,
              contextualPricing: v.contextualPricing,
              brandMarket: brandData?.market
            });

            // prefer contextualPricing if it exists, else fall back to scalar
            const priceAmount =
              v.contextualPricing?.price?.amount ?? v.price ?? "0.00";
            const compareAmount =
              v.contextualPricing?.compareAtPrice?.amount ?? v.compareAtPrice ?? undefined;
            const currency =
              v.contextualPricing?.price?.currencyCode ?? brandData?.market ?? "INR";  // use brand market as fallback
              console.log('brandData?.market: ', brandData?.market);
              console.log('v.contextualPricing?.price?.currencyCode: ', v);

            console.log('Processed pricing:', {
              variantId: v.id,
              finalPrice: priceAmount,
              finalComparePrice: compareAmount,
              finalCurrency: currency
            });

            return {
              id: Number(v.id.split("/").pop()),
              price: priceAmount,
              compareAtPrice: compareAmount,
              currencyCode: currency,
              productId: Number(product.node.id.split("/").pop()),
              selectedOptions: v.selectedOptions,
              availableForSale: v.availableForSale,
              inventoryQuantity: v.inventoryQuantity
            };
          }
        );

        const arLensLink = product.node.metafields.edges.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: productImages,
          options: product.node.options,
          variants: productVariants,
          models: models,
          arLensLink: arLensLink,
          tags: product.node.tags.join(" "),
          status: product.node.status,
        };

        return parsedProduct;
      }
    );

    return products;
  }
};

