import { useThree } from "@react-three/fiber";
import { Image } from "@react-three/uikit";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type DynamicImageProps = {
  width?: number;
  height?: number;
  borderRadius?: number;
    imageUrl?: string;
  };
  
  export function DynamicImage({ imageUrl,width,height,borderRadius }: DynamicImageProps) {
    const { invalidate } = useThree();
  
    // Persistent canvas + CanvasTexture to avoid remounts and mid-frame mutation issues
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const textureRef = useRef<THREE.CanvasTexture | null>(null);
  
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
      // Set a reasonable backing size; adjust as needed
      canvasRef.current.width = 1024;
      canvasRef.current.height = 1024;
    }
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvasRef.current);
      textureRef.current.colorSpace = THREE.SRGBColorSpace;
      textureRef.current.needsUpdate = true;
    }
  
    useEffect(() => {
      if (!imageUrl) return;
      let cancelled = false;
      const img = new (window as Window & typeof globalThis).Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        if (cancelled) return;
        const cvs = canvasRef.current!;
        const ctx = cvs.getContext("2d")!;
        // Clear and fit image into canvas while preserving aspect ratio
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const ratio = Math.min(cvs.width / img.width, cvs.height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (cvs.width - w) / 2;
        const y = (cvs.height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        textureRef.current!.needsUpdate = true;
        invalidate?.();
      };
      img.onerror = () => {
        // Keep previous texture content on error
      };
      return () => {
        cancelled = true;
      };
    }, [imageUrl, invalidate]);
  
    return (
      <Image
      
        src={textureRef.current!}
        width={`${width || 100}%`} height={`${height || 100}%`} borderRadius={borderRadius || 8}
      />
    );
  }