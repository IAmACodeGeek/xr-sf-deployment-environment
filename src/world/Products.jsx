import React, { Suspense } from "react";
import { useEnvAssetStore, useEnvProductStore, useResourceFetchStore } from "@/stores/ZustandStores";

const LazyDraggableProductContainer = React.lazy(() => 
  import("./DraggableProductContainer").then(module => ({ 
    default: module.default || module 
  }))
);

const LazyDraggableAssetContainer = React.lazy(() => 
  import("./DraggableAssetContainer").then(module => ({ 
    default: module.default || module 
  }))
);

const Products = () => {
  const {envProducts} = useEnvProductStore();
  const {envAssets} = useEnvAssetStore();
  const {productsLoaded, envItemsLoaded} = useResourceFetchStore();

  return (
    <Suspense fallback={null}>
      {productsLoaded && envItemsLoaded &&
        Object.keys(envProducts).map((id) => {
          return (
            <LazyDraggableProductContainer
              placeHolderId={envProducts[id].placeHolderId}
              envPosition={envProducts[id].position}
              envRotation={envProducts[id].rotation}
              envScale={envProducts[id].scale}
              envProduct={envProducts[id]}
              key={id}
            />
          );
        })
      }
      {envItemsLoaded &&
        Object.keys(envAssets).map((id) => {
          return (
            <LazyDraggableAssetContainer
              envPosition={envAssets[id].position}
              envRotation={envAssets[id].rotation}
              envScale={envAssets[id].scale}
              envAsset={envAssets[id]}
              key={id}
            />
          );
        })
      }
    </Suspense>
  );
};

export default Products;
