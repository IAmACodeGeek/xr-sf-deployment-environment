import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import App from "@/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore } from "./stores/ZustandStores";
import { useBrandStore } from "./stores/brandStore";

function CanvasWrapper() {
  const { setProducts } = useComponentStore();
  const { brandData, setBrandData } = useBrandStore();
  const { progress } = useProgress();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [maxProgress, setMaxProgress] = useState(0);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // ✅ Extract subdomain function
  function getSubdomain() {
    const host = window.location.hostname; // e.g., subdomain.strategyfox.in
    const parts = host.split(".");
    if (parts.length > 2) {
      return parts[0]; // Extracts 'subdomain'
    }
    return null;
  }

  // ✅ Fetch API Data based on subdomain
  async function fetchBrandData() {
    const subdomain = getSubdomain();
    if (!subdomain) {
      console.warn("No subdomain detected.");
      return;
    }

    try {
      const response = await fetch(
        `https://function-11-934416248688.us-central1.run.app?brandname=${subdomain}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setBrandData(data);
      console.log("📌 Brand Data:", data); // ✅ Log response in the console
    } catch (error) {
      console.error("❌ Error fetching brand data:", error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response);
    } catch (err) {
      console.error(err);
    }
  }

  // ✅ Fetch brand data on component mount
  useEffect(() => {
    fetchBrandData();
    fetchProducts();
  }, []);

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
          <meta
            property="og:title"
            content={`${brandData.brand_name} - Official Store`}
          />
          <meta property="og:image" content={brandData.brand_logo_url} />
          <meta
            property="og:description"
            content={`Shop the latest products from ${brandData.brand_name}`}
          />
          <meta
            name="description"
            content={`Welcome to ${brandData.brand_name} store!`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={brandData.brand_logo_url} />
          <meta name="theme-color" content="#ffffff" />
        </Helmet>
      )}
      <div id="container">
        {progress >= 100 && videoLoaded ? (
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
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <CanvasWrapper />
    </HelmetProvider>
  </React.StrictMode>
);
