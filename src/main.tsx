import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import App from "@/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore, useEnvAssetStore, useEnvironmentStore, useBrandStore, useResourceFetchStore, useEnvProductStore } from "./stores/ZustandStores";
import BrandService from "./api/brandService";
import EnvStoreService from "./api/envStoreService";

function CanvasWrapper() {
  // Load Brand Details
  const { brandData, setBrandData } = useBrandStore();
  useEffect(() => {
    // const queryParams = new URLSearchParams(window.location.search);
    // const brandName = queryParams.get('brandName');
    try{
      const host = window.location.hostname;
      const parts = host.split(".");
      const brandName = parts[0];
      if(!brandName) return;
      
      BrandService.fetchBrandData(brandName).then((response) => {
        console.log(response);
        setBrandData(response);
      });
    }
    catch(error){
      console.error(error);
    }

  }, [setBrandData]);

  // Set the environment type
  const { setEnvironmentType } = useEnvironmentStore();
  useEffect(() => {
    if(!brandData) return;
    setEnvironmentType(brandData.environment_name.toUpperCase());
  }, [brandData, setEnvironmentType]);

  // Set products and assets
  const { envAssets, setEnvAssets } = useEnvAssetStore();
  const {setEnvProducts} = useEnvProductStore();
  const { products, setProducts } = useComponentStore();
  const {productsLoaded, setProductsLoaded, productsLoading, setProductsLoading} = useResourceFetchStore();
  const {envItemsLoaded, setEnvItemsLoaded, envItemsLoading, setEnvItemsLoading} = useResourceFetchStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = await ProductService.getAllProducts(brandData.brand_name);
          setProducts(response);
          setProductsLoaded(true);
          console.log('Products:', response);
        }
      } catch (err) {
        console.error('Products error:', err);
      }
    }
    fetchProducts();
  }, [brandData]);
  
  useEffect(() => {
    async function fetchEnvData() {
      try {
        if (!envItemsLoaded && !envItemsLoading && brandData) {
          setEnvItemsLoading(true);
          await EnvStoreService.getEnvData(brandData.brand_name).then((response) => {
            console.log("EnvProducts: ", response.envProducts);
            console.log("EnvAssets: ", response.envAssets);
            setEnvProducts(response.envProducts);
            setEnvAssets(response.envAssets);

            // Preload asset models
            Object.keys(envAssets).forEach((envAsset) => {
              if(envAssets[envAsset].type === "MODEL_3D")
                useGLTF.preload(envAssets[envAsset].src);
            });

            setEnvItemsLoaded(true);
          });
        }
      } catch (err) {
        console.error('Products error:', err);
      }
    }
    fetchEnvData();
  }, [brandData, products]);

  // Loader
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [maxProgress, setMaxProgress] = useState(0);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const { progress } = useProgress();

  // Joystick
  useEffect(() => {
    const scrollY = window.scrollY;
    const joystickZone = document.getElementById("joystickZone");

    if (!(progress >= 100 && videoLoaded)) {
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
  }, [progress, videoLoaded]);

  useEffect(() => {
    if (progress > maxProgress) {
      setMaxProgress(progress);
    }
  }, [progress]);

  return (
    <>
      {brandData && (
        <Helmet>
          <title>{brandData.brand_name} - Official Store</title>

          {/* Open Graph Meta Tags (For Social Sharing) */}
          <meta
            property="og:title"
            content={`${brandData.brand_name} - Official Store`}
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
            content={`Shop the latest products from ${brandData.brand_name}`}
          />
          <meta
            name="description"
            content={`Welcome to ${brandData.brand_name} store!`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="theme-color" content="#ffffff" />

          {/* Apple Touch Icon (Optional) */}
          {/* <link rel="apple-touch-icon" sizes="180x180" href="/media/sflogo.svg" /> */}
        </Helmet>
      )}
      <div id="container">
        {progress >= 100 && videoLoaded && productsLoaded && envItemsLoaded? (
          <UI />
        ) : (
          <div className="video-loader">
            <video
              ref={videoRef}
              src={isMobile ? "/media/Intro.mp4" : "/media/Intro.MOV"}
              autoPlay
              muted
              playsInline
              onEnded={() => setVideoLoaded(true)}
            />
            {videoLoaded && (
              <>
                <div className="loading-text">Your experience is loading!</div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${Math.min(maxProgress, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        <Canvas camera={{ fov: 45 }} shadows>
          <React.Suspense fallback={null}>
            <App />
          </React.Suspense>
        </Canvas>
      </div>
    </>
  );

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <CanvasWrapper />
    </HelmetProvider>
  </React.StrictMode>
);
