import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore, useEnvAssetStore, useEnvironmentStore, useBrandStore, useResourceFetchStore, useEnvProductStore, EnvProduct, EnvAsset } from "./stores/ZustandStores";
import BrandService from "./api/brandService";
import EnvStoreService from "./api/envStoreService";
import Load from "./UI/Components/Loader.js";

function CanvasWrapper() {
  // Load brand data
  const { brandData, setBrandData } = useBrandStore();
  const [brandStatus, setBrandStatus] = useState<'LOADING' | 'VALID' | 'INVALID' | null>(null);

  useEffect(() => {
    // const queryParams = new URLSearchParams(window.location.search);
    // const brandName = queryParams.get('brandName');
    const host = window.location.hostname;
    const parts = host.split(".");
    const brandName = parts[0];

    if(brandStatus !== null) return;

    async function fetchBrandDetails(){
      try{
        if (!brandName) {
          setBrandStatus('INVALID');
          return;
        }

        setBrandStatus('LOADING');
        BrandService.fetchBrandData(brandName).then((response) => {
          if (response.status && response.status === 404) {
            setBrandStatus('INVALID');
            return;
          }

          console.log(response);
          setBrandStatus('VALID');
          setBrandData(response);
        });
      }
      catch(error){
        console.error('Brand Error: ', error);
      }
    }

    fetchBrandDetails();

  }, [setBrandData]);

  // Set the environment type
  const { setEnvironmentType } = useEnvironmentStore();
  useEffect(() => {
    if(!brandData) return;
    setEnvironmentType(brandData.environment_name.toUpperCase());
  }, [brandData, setEnvironmentType]);

  // Load All resources
  const { envAssets, setEnvAssets } = useEnvAssetStore();
  const { products, setProducts } = useComponentStore();
  const { envProducts, setEnvProducts } = useEnvProductStore();
  const { productsLoaded, productsLoading, setProductsLoaded, setProductsLoading } = useResourceFetchStore();
  const { envItemsLoaded, setEnvItemsLoaded, envItemsLoading, setEnvItemsLoading } = useResourceFetchStore();

  const [myProgress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = (brandData.shopify_store_name !== 'h49c6z-yr.myshopify.com')? 
            await ProductService.getAllProducts(brandData.brand_name, brandData) : 
            await ProductService.getAllProductsFromVendor(brandData.brand_name, brandData);
          setProducts(response);

          const newEnvProducts: { [id: number]: EnvProduct } = {};
          for (const product of response) {
            newEnvProducts[product.id] = {
              id: product.id,
              type: "PHOTO",
              placeHolderId: undefined,
              imageIndex: undefined,
              modelIndex: undefined,
              position: undefined,
              rotation: undefined,
              scale: 1
            };
          }
          setEnvProducts(newEnvProducts);
          setProductsLoaded(true);
          console.log('All Products:', response);
        }
      } catch (err) {
        console.error('Products error:', err);
      }
    }

    async function fetchEnvData() {
      try {
        if (!envItemsLoaded && !envItemsLoading && brandData) {
          setEnvItemsLoading(true);
          await EnvStoreService.getEnvData(brandData.brand_name).then((response) => {

            const newEnvProducts: { [id: number]: EnvProduct } = {};
            for (const envProduct of Object.values(response.envProducts)) {
              newEnvProducts[envProduct.id] = { ...envProduct };
              if (envProduct.type === "MODEL_3D" && envProduct.modelIndex !== undefined) {
                useGLTF.preload(products.find((product) => product.id === envProduct.id)?.models[envProduct.modelIndex].sources?.[0].url || '');
              }
              if(newEnvProducts[envProduct.id].placeHolderId === -1){
                newEnvProducts[envProduct.id].placeHolderId = undefined;
              }
            }

            const newEnvAssets: { [id: string]: EnvAsset } = {};
            for (const envAsset of Object.values(response.envAssets)) {
              newEnvAssets[envAsset.id] = { ...envAsset };
            }

            console.log("Env Products: ", response.envProducts);
            console.log("Env Assets: ", response.envAssets);

            async function setResults() {
              setEnvProducts(newEnvProducts);
              setEnvAssets(newEnvAssets);
            }

            setResults().then(() => setEnvItemsLoaded(true));
          });
        }
      } catch (err) {
        console.error('Env data error:', err);
      }
    }

    async function fetchModels() {
      // Preload asset models
      Object.values(envAssets).forEach((envAsset) => {
        if (envAsset.type === "MODEL_3D")
          useGLTF.preload(envAsset.src);
      });

      // Preload product models
      Object.values(envProducts).forEach((envProduct) => {
        if (envProduct.type === "MODEL_3D" && envProduct.modelIndex) {
          useGLTF.preload(products.find((product) => product.id === envProduct.id)?.models[envProduct.modelIndex].sources?.[0].url || '');
        }
      });
    }

    (async () => {
      if(brandData && brandStatus === 'VALID') {
        await fetchProducts(); setProgress(myProgress > 32 ? myProgress : 32);
        await fetchEnvData(); setProgress(myProgress > 76 ? myProgress : 76);
        await fetchModels(); setProgress(myProgress > 99 ? myProgress : 99);
        await new Promise(() => {setTimeout(() => setProgress(100), 800)}); // Delay to show fully loaded progress bar
      }
    })();
    
  }, [brandStatus]);

  // Loader Video
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(navigator.userAgent);

  // Joystick
  useEffect(() => {
    const scrollY = window.scrollY;
    const joystickZone = document.getElementById("joystickZone");

    if (!(myProgress >= 100 && videoLoaded)) {
      if (joystickZone) {
        joystickZone.style.display = "none";
      }

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      if (joystickZone) {
        joystickZone.style.display = "block";
      }

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      if (joystickZone) {
        joystickZone.style.display = "block";
      }

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.scrollTo(0, scrollY);
    };
  }, [myProgress, videoLoaded]);

  return (
    <>
      {brandData && (
        <Helmet>
          <title>{brandData.original_brand_name} - Official Store</title>

          {/* Open Graph Meta Tags (For Social Sharing) */}
          <meta
            property="og:title"
            content={`${brandData.original_brand_name} - Official Store`}
          />
          {brandData.brand_logo_url && (
            <>
              <meta property="og:image" content={brandData.brand_logo_url} />
              <meta name="twitter:image" content={brandData.brand_logo_url} />
              <link rel="icon" sizes="32x32" href={brandData.brand_logo_url} />
              <link rel="icon" sizes="16x16" href={brandData.brand_logo_url} />
            </>
          )}

          <meta
            property="og:description"
            content={`Shop the latest products from ${brandData.original_brand_name}`}
          />
          <meta
            name="description"
            content={`Welcome to ${brandData.original_brand_name} store!`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="theme-color" content="#ffffff" />

          {/* Apple Touch Icon (Optional) */}
          {/* <link rel="apple-touch-icon" sizes="180x180" href="/media/sflogo.svg" /> */}
        </Helmet>
      )}
      <div id="container">
        {myProgress >= 100 ? (
          <UI />
        ) : (
          <Load progress={myProgress} />
        )}
        {myProgress >= 100 &&
          <Canvas camera={{ fov: 45 }} shadows>
            <React.Suspense fallback={null}>
              <App />
            </React.Suspense>
          </Canvas>
        }
      </div>
    </>
  );

  return null;
}

// 🔇 Remove console logs in production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  // Optional: leave console.warn and console.error for debugging
}

if (import.meta.env.MODE === "production") {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

if (import.meta.env.PROD) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <CanvasWrapper />
    </HelmetProvider>
  </React.StrictMode>
);
