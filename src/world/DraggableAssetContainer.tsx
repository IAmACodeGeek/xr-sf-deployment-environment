import { EnvAsset } from "@/stores/ZustandStores";
import { PivotControls, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import {BackSide, Box3, Euler, Mesh, Object3D, Quaternion, TextureLoader, Vector3} from 'three';
import { useLoader, useThree } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface DraggableAssetContainerProps {
  envPosition?: [number, number, number];
  envRotation?: [number, number, number];
  envScale?: number;
  envAsset: EnvAsset;
}

const DraggableAssetContainer = ({
  envPosition = undefined,
  envRotation = undefined,
  envScale = 1,
  envAsset
}: DraggableAssetContainerProps) => {
  const {camera} = useThree();

  // Get the model URL
  const modelUrl = useMemo(() => {
    if (envAsset.type !== "MODEL_3D" || !envAsset.src) {
      return null;
    }
    
    return envAsset.src;
  }, [envAsset.type, envAsset.src]);

  // Load the GLTF model
  const [model, setModel] = useState<GLTF | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!modelUrl) return;
    
    let isMounted = true;
    const loadModel = async () => {
      setIsLoading(true);
      
      // Create GLTFLoader with DRACOLoader
      const loader = new GLTFLoader();
      
      // Set up DRACOLoader
      const dracoLoader = new DRACOLoader();
      // Set the path to the Draco decoder files
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
      
      // Attach DRACOLoader to GLTFLoader
      loader.setDRACOLoader(dracoLoader);
      
      try {
        const gltf = await new Promise<GLTF>((resolve, reject) => {
          loader.load(
            modelUrl,
            (gltf) => resolve(gltf),
            (progress) => {
              // Optional: handle loading progress
              // console.log(`Loading progress: ${(progress.loaded / progress.total) * 100}%`);
            },
            (error) => reject(error)
          );
        });
        
        if (isMounted) {
          setModel(gltf);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading model:', error);
        if (isMounted) {
          setIsLoading(false);
          
          // Implement a retry mechanism with a maximum retry count
          if (retryCount < 5) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1000); // Wait 1 second before retrying
          }
        }
      }
    };
    
    loadModel();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [modelUrl, retryCount]);
  
  // You can still use useGLTF.preload at the component level
  useEffect(() => {
    if (modelUrl) {
      useGLTF.preload(modelUrl);
    }
  }, [modelUrl]);

  const scene = useMemo(() => {
    return model?.scene;
  }, [model]);

  // Memoize the scene to prevent unnecessary rerenders
  const memoizedModelScene = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone();
    return clonedScene;
  }, [scene]);

  // Fetch position, rotation & scale from placeholder
  const position = useMemo(() => {
    return envPosition;
  }, [envPosition]);

  const rotation = useMemo(() => {
    return envRotation;
  }, [envRotation]);

  const scale = useMemo(() => {
    return envScale;
  }, [envScale]);

  // Convert rotation from degrees to radians
  const computedRotation = useMemo(() => {
    const rotArray = [0, 0, 0];
    if(!rotation){
      const cameraPosition = new Vector3(); camera.getWorldPosition(cameraPosition);
      const direction = new Vector3().subVectors(cameraPosition, new Vector3(...(position || [0, 0, 0]))).normalize();
      direction.y = 0;
      const angle = Math.atan(direction.x / direction.z) * 180 / Math.PI;
      rotArray[1] = angle - (direction.z < 0 ? 180: 0);
    }
    else{
      rotArray[0] = rotation[0]; rotArray[1] = rotation[1]; rotArray[2] = rotation[2];
    }
    return new Euler(
      rotArray[0] * Math.PI / 180,
      rotArray[1] * Math.PI / 180,
      rotArray[2] * Math.PI / 180,
      'YZX'
    );
  }, [rotation, position]);
  
  // Manually compute scale such that object has unit height
  const computedScaleForModel = useMemo(() => {
    if(!scene) return null;

    const box = new Box3().setFromObject(scene);

    const size = new Vector3();
    box.getSize(size);

    return scale / size.y;
  }, [scene, scale]);

  const {computedPositionForModel} = useMemo(() => {
    if(!computedScaleForModel || !scene) return {
      computedPositionForModel: null,
      boxCenter: null
    };

    const cameraPosition = new Vector3(); camera.getWorldPosition(cameraPosition);
    const cameraDirection = new Vector3(); camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(5);
    cameraPosition.add(cameraDirection);
    const positionVector = position? new Vector3(position[0], position[1], position[2]) : cameraPosition;
    
    // Get the bounding box AFTER applying scale
    const scaledScene = scene.clone();
    scaledScene.scale.set(computedScaleForModel, computedScaleForModel, computedScaleForModel);
    const box = new Box3().setFromObject(scaledScene);
    
    // Calculate center offset
    const boxCenter = new Vector3();
    box.getCenter(boxCenter);
    
    // Adjust position to account for scaled center offset
    const newPosition = positionVector.clone().sub(boxCenter.clone());
    return {
      computedPositionForModel: [newPosition.x, newPosition.y, newPosition.z],
    }
  }, [scene, computedScaleForModel, position, camera]);

  // Set position and rotation
  const rigidBodyRef = useRef<any>(null);
  const modelRef = useRef<Object3D>(null);
  const meshRef = useRef<Mesh>(null);
  const backMeshRef = useRef<Mesh>(null);
  useEffect(() => {
    if(!modelRef.current || envAsset.type !== "MODEL_3D") return;

    // Position
    const worldPosition = new Vector3(...(computedPositionForModel || [0, 0, 0]));
    
    modelRef.current.matrixWorld.setPosition(worldPosition);
    if (modelRef.current.parent) {
      worldPosition.applyMatrix4(modelRef.current.parent.matrixWorld.invert());
    }
    // Update physics body
    modelRef.current.position.copy(new Vector3(0, 0, 0));
    rigidBodyRef.current.setTranslation(
      { x: worldPosition.x, y: worldPosition.y, z: worldPosition.z },
      true
    );

    // Rotation
    const worldRotation = computedRotation;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(worldRotation);

    if (modelRef.current.parent){
      const parentQuaternion = new Quaternion();
      modelRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    rigidBodyRef.current.setRotation(quaternion, true);

    const nullQuaternion = new Quaternion();
    nullQuaternion.setFromEuler(new Euler(0, 0, 0));
    modelRef.current.setRotationFromQuaternion(nullQuaternion);
  }, [position, computedPositionForModel, envAsset.type, computedRotation, camera, modelRef]);

  useEffect(() => {
    if(!meshRef.current || !backMeshRef.current || envAsset.type !== "PHOTO") return;

    // Position
    const cameraPosition = new Vector3(); camera.getWorldPosition(cameraPosition);
    const cameraDirection = new Vector3(); camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(5);
    cameraPosition.add(cameraDirection);

    const worldPosition = position? new Vector3(...position) : cameraPosition;
    
    meshRef.current.matrixWorld.setPosition(worldPosition);
    if (meshRef.current.parent) {
      worldPosition.applyMatrix4(meshRef.current.parent.matrixWorld.invert());
    }
    // Update physics body
    rigidBodyRef.current.setTranslation(
      { x: worldPosition.x, y: worldPosition.y, z: worldPosition.z },
      true
    );
    meshRef.current.position.copy(new Vector3(0, 0, 0));
    backMeshRef.current.position.copy(new Vector3(0, 0, 0));

    // Rotation
    const worldRotation = computedRotation;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(worldRotation);

    if (meshRef.current.parent){
      const parentQuaternion = new Quaternion();
      meshRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    meshRef.current.setRotationFromQuaternion(quaternion);
    backMeshRef.current.setRotationFromQuaternion(quaternion);

  }, [position, computedPositionForModel, envAsset.type, computedRotation, camera, meshRef, backMeshRef]);

  // Load Image texture
  const imageUrl = useMemo(() => {
    if(envAsset.type !== "PHOTO" || !envAsset.src) return null;
    return envAsset.src;
  }, [envAsset.type, envAsset.src]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const texture = imageUrl? useLoader(TextureLoader, imageUrl) : null;
  const imageTexture = useMemo(() => {
    if(!imageUrl) return null;
    try{
      return texture;
    }
    catch(error){
      console.error('Error Loading Asset Image: ', error);
      return null;
    }
  }, [imageUrl]);

  const computedSizeForImage = useMemo(() => {
    if(!imageTexture) return null;

    const width = imageTexture.image.width;
    const height = imageTexture.image.height;

    // Convert to world size
    const convertPixelToWorldSize = (i: number) => { return i / 100 };
    const imageWidthInWorld = convertPixelToWorldSize(width);
    const imageHeightInWorld = convertPixelToWorldSize(height)

    // Scale
    const computedScale = scale / imageHeightInWorld;
    return [
      computedScale * imageWidthInWorld,
      computedScale * imageHeightInWorld
    ];
  }, [imageTexture, scale]);

  const handleEvent = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      {envAsset.type === "MODEL_3D" && memoizedModelScene &&
        <RigidBody ref={rigidBodyRef} type="fixed" colliders="hull">
          <group
            position={[0, 0, 0]}
            rotation={new Euler(0, 0, 0, 'YZX')}
          >
            <primitive
              ref={modelRef}
              object={memoizedModelScene}
              scale={[computedScaleForModel, computedScaleForModel, computedScaleForModel]}
              onTouchStart={handleEvent}
              onClick={handleEvent}
              castShadow
              receiveShadow
            />
          </group>
        </RigidBody>
      }
      {envAsset.type === "PHOTO" && computedSizeForImage &&
        <RigidBody ref={rigidBodyRef} type="fixed" colliders="hull">
          <group
            position={[0, 0, 0]}
            rotation={new Euler(0, 0, 0, 'YZX')}
          >
            <>
              <mesh
                rotation={computedRotation}
                ref={meshRef}
                onClick={handleEvent}
                onPointerDown={handleEvent}
              >
                <planeGeometry args={[computedSizeForImage[0], computedSizeForImage[1]]} />
                <meshBasicMaterial 
                  map={imageTexture}
                  transparent={true}
                />
              </mesh>
              <mesh
                ref={backMeshRef}
                rotation={computedRotation}
              >
                <planeGeometry args={[computedSizeForImage[0], computedSizeForImage[1]]} />
                <meshBasicMaterial 
                  color={0xffffff}
                  side={BackSide}
                />
              </mesh>
            </>
          </group>
        </RigidBody>
      }
    </>
  );
};

export default DraggableAssetContainer;