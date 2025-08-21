import bigRoomPlaceHolderData from "./placeHolderData/BigRoom";
import castlePlaceHolderData from "./placeHolderData/Castle";
import singleRoomPlaceHolderData from "./placeHolderData/SingleRoom";

import PlaceHolderData from "./placeHolderData/PlaceHolderData";
import ShowRoomPlaceHolderData from "./placeHolderData/ShowRoom";
import LotusDomePlaceHolderData from "./placeHolderData/LotusDome";
import LunoxPlaceHolderData from "./placeHolderData/Lunox";
import ShelfscapePlaceHolderData from "./placeHolderData/Shelfscape";
import KidsStorePlaceHolderData from "./placeHolderData/KidsStore";
import ArcadeZonePlaceHolderData from "./placeHolderData/ArcadeZone";
import VarsityVaultPlaceHolderData from "./placeHolderData/VarsityVault";
import GlowBarPlaceHolderData from "./placeHolderData/Glowbar";
import LuxeCradlePlaceHolderData from "./placeHolderData/LuxeCradle";
import FlareSuitePlaceHolderData from "./placeHolderData/FlareSuite";
import GardenAtlierPlaceHolderData from "./placeHolderData/GardenAtelier";
import CocktailDenPlaceHolderData from "./placeHolderData/CocktailDen";
import PetalPavilionPlaceHolderData from "./placeHolderData/PetalPavilion";
import AutoHavenPlaceHolderData from "./placeHolderData/AutoHaven";
import BarbieClutchPlaceHolderData from "./placeHolderData/BarbieClutch";
import MerryMeadowPlaceHolderData from "./placeHolderData/MerryMeadow";
import SovereignAtriumPlaceHolderData from "./placeHolderData/SovereignAtrium";
import SilkenHallPlaceHolderData from "./placeHolderData/SilkenHall";
import IndigoChamberPlaceHolderData from "./placeHolderData/IndigoChamber";

interface EnvironmentData {
  [environment_name: string]: {
    playerSpeed: number;
    playerHeight: number;
    placeHolderData: PlaceHolderData[];
    initialGSAP: {
      start: {
        position: [number, number, number];
        rotation: [number, number, number];
        duration: number;
      };
      update: {
        position: [number, number, number];
        rotation: [number, number, number];
        duration: number;
        ease?: string;
      }[];
    };
    televisions: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }[];
    brandPosters: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }[];
  };
}

const environmentData: EnvironmentData = {
  BIGROOM: {
    playerSpeed: 10,
    playerHeight: 2,
    placeHolderData: bigRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [40, 4, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [40, 4, 0],
          rotation: [0, 270, 0],
          duration: 5,
        },
        {
          position: [20, 3.2, 0],
          rotation: [0, 270, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [47.8, 4.5, 0],
        rotation: [0, 180, 0],
        scale: 0.37,
      },
    ],
    brandPosters: [
      {
        position: [-5, 3.2, 14.3],
        rotation: [0, 90, 0],
        scale: 4,
      },
      {
        position: [-5, 3.2, -12.4],
        rotation: [0, 90, 0],
        scale: 4,
      },
    ],
  },

  CASTLE: {
    playerSpeed: 17,
    playerHeight: 2,
    placeHolderData: castlePlaceHolderData,
    initialGSAP: {
      start: {
        position: [-4.62, 2.3, 46],
        rotation: [0, -30, 0],
        duration: 0,
      },
      update: [
        {
          position: [10, 2.5, -25],
          rotation: [0, 0, 0],
          duration: 4,
          ease: "power2.inOut",
        },
      ],
    },
    televisions: [
      {
        position: [-7.3, 33, -136.5],
        rotation: [0, 276, 0],
        scale: 0.8,
      },
    ],
    brandPosters: [
      {
        position: [-3.2, 10, -84],
        rotation: [2, 90, 0],
        scale: 5,
      },
    ],
  },
  SINGLEROOM: {
    playerSpeed: 15,
    playerHeight: 2,
    placeHolderData: singleRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 4, 0],
          rotation: [0, 360, 0],
          duration: 5,
        },
        {
          position: [0, 3.2, 18],
          rotation: [0, 360, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0, 4.5, -17.1],
        rotation: [0, -90, 0],
        scale: 0.6,
      },
    ],
    brandPosters: [
      {
        position: [9, 4.5, -17.1],
        rotation: [0, 0, 0],
        scale: 3,
      },
      {
        position: [-9, 4.5, -17.1],
        rotation: [0, 0, 0],
        scale: 3,
      },
    ],
  },
  SHOWROOM: {
    playerSpeed: 15,
    playerHeight: 7,
    placeHolderData: ShowRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [-20, 7, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [30, 10, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [11, 10, -23.5],
        rotation: [0, -90, 0],
        scale: 1,
      },
    ],
    brandPosters: [
      {
        position: [-22.5, 10, 0],
        rotation: [0, 90, 0],
        scale: 5,
      },
    ],
  },
  LOTUSDOME: {
    playerSpeed: 15,
    playerHeight: 1.5,
    placeHolderData: LotusDomePlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 5, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-22, 4, 6],
        rotation: [0, 10, 0],
        scale: 0.3,
      },
    ],
    brandPosters: [
      {
        position: [-22, 4, -6],
        rotation: [0, 80, 0],
        scale: 2.5,
      },
      {
        position: [-18.686, 4, 13.965],
        rotation: [0, 123.0, 0],
        scale: 2.5,
      },
    ],
  },
  LUNOX: {
    playerSpeed: 8,
    playerHeight: 2,
    placeHolderData: LunoxPlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 5, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-34, 5.2, 0],
        rotation: [0, 0, 0],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [17.2, 5, 7],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
      {
        position: [17.2, 5, -8],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
    ],
  },
  SHELFSCAPE: {
    playerSpeed: 8,
    playerHeight: 3.5,
    placeHolderData: ShelfscapePlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 7, -2],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 5, -2],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [5, 7, -2],
        rotation: [0, 180, 0],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [5.5, 7, 7],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
      {
        position: [5.5, 7, -11],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
    ],
  },
  KIDSSTORE: {
    playerSpeed: 8,
    playerHeight: 2.3,
    placeHolderData: KidsStorePlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 5, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [11.6, 4, -1],
        rotation: [0, 180, 0],
        scale: 0.35,
      },
    ],
    brandPosters: [
      {
        position: [-14.1, 7.4, -5.6],
        rotation: [0, 90, 0],
        scale: 2,
      },
    ],
  },
  ARCADEZONE: {
    playerSpeed: 10,
    playerHeight: 1.5,
    placeHolderData: ArcadeZonePlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 4, 10],
        rotation: [0, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, -20],
          rotation: [0, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0.13, 2.5, 2.5],
        rotation: [0, 90, 0],
        scale: 0.27,
      },
    ],
    brandPosters: [
      {
        position: [0, 3.5, -21],
        rotation: [0, 0, 0],
        scale: 3,
      },
    ],
  },
  VARSITYVAULT: {
    playerSpeed: 15,
    playerHeight: 2.5,
    placeHolderData: VarsityVaultPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 4, 10],
        rotation: [0, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, -20],
          rotation: [0, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [7, 4, -27.6],
        rotation: [0, -90, 0],
        scale: 0.4,
      },
    ],
    brandPosters: [
      {
        position: [3, 5, 29],
        rotation: [0, 180, 0],
        scale: 2.5,
      },
    ],
  },
  GLOWBAR: {
    playerSpeed: 10,
    playerHeight: 3,
    placeHolderData: GlowBarPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 135, 0],
        duration: 0,
      },
      update: [
        {
          position: [15.373, 6, -7.952],
          rotation: [0, 135, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [18.6, 6, 0],
        rotation: [0, 180, 0],
        scale: 0.5,
      },
    ],
    brandPosters: [
      {
        position: [-18.6, 6, -3.5],
        rotation: [0, 90, 0],
        scale: 4,
      },
    ],
  },
  LUXECRADLE: {
    playerSpeed: 10,
    playerHeight: 3,
    placeHolderData: LuxeCradlePlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [15.373, 6, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [18.6, 6, 0],
        rotation: [0, 180, 0],
        scale: 0.5,
      },
    ],
    brandPosters: [
      {
        position: [-18.6, 6, 1],
        rotation: [0, 90, 0],
        scale: 3,
      },
    ],
  },
  FLARESUITE: {
    playerSpeed: 10,
    playerHeight: 2.5,
    placeHolderData: FlareSuitePlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [15, 5, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-26, 6, 0],
        rotation: [0, 0, 0],
        scale: 0.5,
      },
    ],
    brandPosters: [
      {
        position: [26.5, 6, 0],
        rotation: [0, -90, 0],
        scale: 3,
      },
    ],
  },
  GARDENATELIER: {
    playerSpeed: 10,
    playerHeight: 3,
    placeHolderData: GardenAtlierPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 5, 0],
        rotation: [0, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 5, -10],
          rotation: [0, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0, 6, 23.5],
        rotation: [0, 90, 0],
        scale: 0.4,
      },
    ],
    brandPosters: [
      {
        position: [-0.1, 7, -20],
        rotation: [0, 0, 0],
        scale: 2.8,
      },
    ],
  },
  COCKTAILDEN: {
    playerSpeed: 10,
    playerHeight: 5,
    placeHolderData: CocktailDenPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 45, 0],
        duration: 0,
      },
      update: [
        {
          position: [22, 6, 22],
          rotation: [0, 45, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [4.102, 10.115, 22.392],
        rotation: [0, 90, 0],
        scale: 0.6,
      },
    ],
    brandPosters: [
      {
        position: [22.875, 10.115, -0.785],
        rotation: [0, -90, 0],
        scale: 4,
      },
    ],
  },
  PETALPAVILION: {
    playerSpeed: 12,
    playerHeight: 2,
    placeHolderData: PetalPavilionPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 3, 55],
        rotation: [0, 0, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 85],
          rotation: [0, 0, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0, 2, -26.5],
        rotation: [0, -90, 0],
        scale: 0.4,
      },
    ],
    brandPosters: [
      {
        position: [19.022, 2, -18.814],
        rotation: [0, -45, 0],
        scale: 3,
      },
      {
        position: [-19.022, 2, -18.814],
        rotation: [0, 45, 0],
        scale: 3,
      },
    ],
  },
  AUTOHAVEN: {
    playerSpeed: 17,
    playerHeight: 5,
    placeHolderData: AutoHavenPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [13, 6, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-20.424, 13.619, 21.2],
        rotation: [0, 0, 0],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [-29.977, 13.619, -21],
        rotation: [0, 90, 0],
        scale: 3,
      },
    ],
  },
  BARBIECLUTCH: {
    playerSpeed: 17,
    playerHeight: 5,
    placeHolderData: BarbieClutchPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 10],
        rotation: [5, 0, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 6, 43],
          rotation: [5, 0, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-10.86, 8, 2],
        rotation: [0, 0, -5],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [10.8, 8, 2],
        rotation: [0, -90, 0],
        scale: 4,
      },
    ],
  },
  MERRYMEADOW: {
    playerSpeed: 17,
    playerHeight: 4,
    placeHolderData: MerryMeadowPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, -15],
        rotation: [5, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 6, -45],
          rotation: [5, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [11.019, 11, 25.11],
        rotation: [0, 180 - 45 - 10, 0],
        scale: 2.45,
      },
    ],
    brandPosters: [
      {
        position: [23.15, 2.766, -1.351],
        rotation: [0, -90 - 45, 0],
        scale: 3,
      },
    ],
  },
  SOVEREIGNATRIUM: {
    playerSpeed: 17,
    playerHeight: 4,
    placeHolderData: SovereignAtriumPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [5, 30, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 6, 15],
          rotation: [5, 0, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0, 5.4, 18.5],
        rotation: [0, 90, 0],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [-12, 5.4, -18.7],
        rotation: [0, 0, 0],
        scale: 2,
      },
    ],
  },
  SILKENHALL: {
    playerSpeed: 15,
    playerHeight: 3,
    placeHolderData: SilkenHallPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [5, 30, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 6, 15],
          rotation: [5, 0, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-0.2, 6, -23],
        rotation: [0, -90, 0],
        scale: 0.25,
      },
    ],
    brandPosters: [
      {
        position: [0, 6, 22.8],
        rotation: [0, 180, 0],
        scale: 2,
      },
    ],
  },
  INDIGOCHAMBER: {
    playerSpeed: 10,
    playerHeight: 2,
    placeHolderData: IndigoChamberPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 3.5, 0],
        rotation: [5, 30, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3.5, 15],
          rotation: [5, 0, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-18.25, 5.2, 0],
        rotation: [0, 0, 0],
        scale: 0.4,
      },
    ],
    brandPosters: [
      {
        position: [18.25, 5.3, 0],
        rotation: [0, -90, 0],
        scale: 3.5,
      },
    ],
  },
};

export default environmentData;
