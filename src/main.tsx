import React, { useEffect, useState, useRef, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore, useEnvAssetStore, useEnvironmentStore, useBrandStore, useResourceFetchStore, useEnvProductStore, EnvProduct, EnvAsset } from "./stores/ZustandStores";
import BrandService from "./api/brandService";
import EnvStoreService from "./api/envStoreService";
import Load from "./UI/Components/Loader.js";
import ErrorBoundary from "./UI/Components/ErrorBoundary";
import ThreeJSErrorBoundary from "./UI/Components/ThreeJSErrorBoundary";
import { ACESFilmicToneMapping, LinearToneMapping } from "three";

function CanvasWrapper() {
  // Load brand data
  const { brandData, setBrandData } = useBrandStore();
  const [brandStatus, setBrandStatus] = useState<'LOADING' | 'VALID' | 'INVALID' | null>(null);
  const { environmentType } = useEnvironmentStore();
  const { loaded, total } = useProgress();
  
  // Environments that should use LinearToneMapping
  const linearToneMappingEnvironments = [
    "GLOWBAR",
    "LUXECRADLE",
    "GARDENATELIER",
    "INDIGOCHAMBER",
    "CRYSTALPALACE",
    "FIDGETSPINNER",
    "NEXTRON",
  ];

  const toneMappingExposures: { [key: string]: number } = {
    SILKENHALL: 1.4,
    SOVEREIGNATRIUM: 1.24,
    CRYSTALPALACE: 1.4,
    FIDGETSPINNER: 1.2,
    NEXTRON: 1.2,
  };

  const environmentFOV: { [key: string]: number } = {
    GRANDGALLERIA: 55,
    SPACEPARK: 55,
  };

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
          const response = (brandData.shopify_store_name !== 'nufewd-83.myshopify.com' && brandData.shopify_store_name !== 'h49c6z-yr.myshopify.com')
           ? await ProductService.getAllProducts(brandData.brand_name, brandData) 
           : await ProductService.getAllProductsFromVendor(brandData.brand_name, brandData);
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
        {myProgress >= 100 && brandData?.account_status === 'active' ? (
          <ErrorBoundary>
            <UI />
          </ErrorBoundary>
        ) : myProgress >= 100 && brandData?.account_status === 'inactive' ? (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            color: '#fff',
            textAlign: 'center',
            padding: '20px',
            fontFamily: 'DM Sans, sans-serif'
          }}>

            
            {/* Main content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '24px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)',
              border: '1px solid rgba(255, 127, 50, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 127, 50, 0.1)',
              backdropFilter: 'blur(10px)',
              width: '90%',
              maxWidth: '500px'
            }}>
              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF7F32 0%, #FFA07A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255, 127, 50, 0.4)'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
                  <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z" fill="white"/>
                  <path d="M5 6L5.47 7.76L7.24 8.24L5.47 8.71L5 10.47L4.53 8.71L2.76 8.24L4.53 7.76L5 6Z" fill="white"/>
                </svg>
              </div>
              
              <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem', 
                fontWeight: '700',
                fontFamily: 'DM Sans, sans-serif',
                background: 'linear-gradient(135deg, #FF7F32 0%, #FFA07A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Upgrade Required
              </h1>
              
              <p style={{ 
                fontSize: '1.2rem', 
                maxWidth: '500px', 
                lineHeight: '1.6',
                marginBottom: '2rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '400'
              }}>
                You might need to upgrade to feel the experience
              </p>
              
              <div style={{
                padding: '16px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(255, 127, 50, 0.1) 0%, rgba(255, 160, 122, 0.05) 100%)',
                border: '1px solid rgba(255, 127, 50, 0.2)',
                marginBottom: '2rem'
              }}>
                <p style={{ 
                  fontSize: '1rem', 
                  opacity: 0.8,
                  margin: 0,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500'
                }}>
                  Please contact support to reactivate your account
                </p>
              </div>
              
              {/* Action button */}
              <button style={{
                background: 'linear-gradient(135deg, #FF7F32 0%, #FFA07A 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 32px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(255, 127, 50, 0.3)',
                textTransform: 'none',
                width: '100%',
                maxWidth: '300px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 16px rgba(255, 127, 50, 0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(255, 127, 50, 0.3)';
              }}
              onClick={() => {
                const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
                window.open(`https://dashboard.shackit.${domainExtension}`, '_blank');
              }}
              >
                Renew Plan
              </button>
            </div>
          </div>
        ) : (
          // Loading component not needed since Canvas is wrapped in Suspense which handles loading states
          // <Load progress={myProgress} />
          <></>
        )}
        { brandData?.account_status === 'active' &&
        <Suspense fallback={<Load progress={(loaded/total) * 100} />}>
          <ThreeJSErrorBoundary>
            <Canvas camera={{ fov: environmentType && environmentFOV[environmentType] || 45 }} 
             gl={{
               toneMapping: environmentType && linearToneMappingEnvironments.includes(environmentType) ? LinearToneMapping : ACESFilmicToneMapping,
               toneMappingExposure: (environmentType && toneMappingExposures[environmentType]) || 1,
             }}
            shadows>
                <App />
            </Canvas>
          </ThreeJSErrorBoundary>
        </Suspense>
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
      <ErrorBoundary>
        <CanvasWrapper />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
