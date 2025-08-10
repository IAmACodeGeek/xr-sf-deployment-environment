import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import { RigidBody } from "@react-three/rapier";
import React from "react";

export function MerryMeadowModel() {
    const { nodes, materials } = useGLTFWithKTX2("/models/Merry meadow.glb");
    materials["Material.004"].transparent = true;
    materials["Material.004"].opacity = 0;
    return (
      <>
        <group scale={20} dispose={null}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere001.geometry}
            material={materials["Material.001"]}
            position={[0, 4.429, 0]}
            scale={25.679}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.MASH2_ReproMesh001.geometry}
            material={materials.grass1}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          />
          <RigidBody type="fixed" colliders="trimesh">
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Sphere002.geometry}
              material={materials["Material.003"]}
              position={[0, 4.95, 0]}
              scale={25.679}
            />
            <group
              position={[1.241, 0, 0]}
              rotation={[Math.PI / 2, 0, 1.546]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane28.geometry}
                material={materials.leaf}
                position={[-97.009, -33.422, -136.715]}
                rotation={[2.969, -1.174, 0.673]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane32.geometry}
                material={materials.leaf}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane33.geometry}
                material={materials.leaf}
                position={[-107.632, -60.477, -53.824]}
                rotation={[1.081, -0.28, -2.842]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane34.geometry}
                material={materials.leaf}
                position={[-102.539, -78.854, -57.425]}
                rotation={[1.081, -0.28, -2.842]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane35.geometry}
                material={materials.leaf}
                position={[-94.328, -72.789, -73.13]}
                rotation={[1.081, -0.28, -2.842]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane36.geometry}
                material={materials.leaf}
                position={[-40.12, -28.367, -11.987]}
                rotation={[0.223, 0.565, -2.74]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane37.geometry}
                material={materials.leaf}
                position={[-45.177, -39.6, -5.308]}
                rotation={[0.223, 0.565, -2.74]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane44.geometry}
                material={materials.leaf}
                position={[40.018, 2.595, 1.011]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane45.geometry}
                material={materials.leaf}
                position={[32.097, 16.401, 18.771]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane46.geometry}
                material={materials.leaf}
                position={[65.432, -115.972, -83.009]}
                rotation={[0.848, 0.853, -1.585]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane47.geometry}
                material={materials.leaf}
                position={[88.494, -23.001, 3.059]}
                rotation={[-0.224, 0.469, -1.095]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane48.geometry}
                material={materials.leaf}
                position={[83.811, 2.344, 21.124]}
                rotation={[-0.224, 0.469, -1.095]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane49.geometry}
                material={materials.leaf}
                position={[37.227, -11.101, 40.37]}
                rotation={[-0.224, 0.469, -1.095]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane50.geometry}
                material={materials.leaf}
                position={[75, -43.531, 24.235]}
                rotation={[-0.224, 0.469, -1.095]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane51.geometry}
                material={materials.leaf}
                position={[112.028, -18.761, 35.136]}
                rotation={[-0.224, 0.469, -1.095]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane52.geometry}
                material={materials.leaf}
                position={[103.064, -41.909, 50.804]}
                rotation={[-0.224, 0.469, -1.095]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane53.geometry}
                material={materials.leaf}
                position={[-33.004, -76.181, 67.035]}
                rotation={[0.044, 0.017, -2.28]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane54.geometry}
                material={materials.leaf}
                position={[-52.384, -53.486, 60.58]}
                rotation={[0.044, 0.017, -2.28]}
              />
            </group>
            <group rotation={[Math.PI / 2, 0, 0]} scale={0.006}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh019.geometry}
                material={materials.sereal_light}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh019_1.geometry}
                material={materials.black_placri}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.sweep17.geometry}
              material={materials.standardSurface1}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCube18.geometry}
              material={materials.grass1}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            />
            <group
              position={[0.303, 0.421, 0.214]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh023.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh023_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[0.023, 0.421, 0.214]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh024.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh024_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[-0.256, 0.421, 0.214]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh025.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh025_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[-0.256, 0.421, -0.001]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh026.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh026_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[0.023, 0.421, -0.001]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh027.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh027_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[0.303, 0.421, -0.001]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh028.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh028_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[-0.256, 0.421, -0.224]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh029.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh029_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[0.023, 0.421, -0.224]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh030.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh030_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <group
              position={[0.303, 0.421, -0.224]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={0.005}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh031.geometry}
                material={materials.black_p}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh031_1.geometry}
                material={materials.standardSurface15}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCube35.geometry}
              material={materials["Material.002"]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            />
            <group
              position={[2.133, 0.037, 0.855]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh033.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh033_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.144, 0.111, 0.847]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh034.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh034_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.142, 0.144, 0.846]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh035.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh035_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.15, 0.199, 0.842]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh036.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh036_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.138, 0.218, 0.849]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh037.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh037_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.137, 0.23, 0.85]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh038.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh038_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.148, 0.245, 0.852]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh039.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh039_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.157, 0.27, 0.854]}
              rotation={[1.284, -0.214, -2.628]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh040.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh040_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[1.967, -0.101, -0.657]}
              rotation={[1.284, -0.214, 2.277]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh041.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh041_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[0.712, 0.109, -0.988]}
              rotation={[1.284, -0.214, 1.162]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh042.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh042_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[-0.09, 0.728, -0.03]}
              rotation={[1.251, -0.31, 0.005]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh043.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh043_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[-0.094, 0.758, -0.029]}
              rotation={[1.251, -0.31, 0.005]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh044.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh044_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[-0.094, 0.776, -0.028]}
              rotation={[1.251, -0.31, 0.005]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh045.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh045_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.229, -0.243, 0.096]}
              rotation={[0.663, -0.064, 2.546]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh046.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh046_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.063, -0.067, 0.773]}
              rotation={[0.881, -0.452, -3.082]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh047.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh047_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.038, -0.06, 0.771]}
              rotation={[0.881, -0.452, -3.082]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh048.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh048_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.043, -0.045, 0.763]}
              rotation={[0.881, -0.452, -3.082]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh049.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh049_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.457, 0.621, 0.401]}
              rotation={[-0.506, 0.183, 2.892]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh050.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh050_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group
              position={[2.436, 0.634, 0.397]}
              rotation={[-0.506, 0.183, 2.892]}
              scale={0.01}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh051.geometry}
                material={materials.black_placri}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh051_1.geometry}
                material={materials.sereal_light}
              />
            </group>
            <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh052.geometry}
                material={materials.ight_h}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh052_1.geometry}
                material={materials.black_placri1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh052_2.geometry}
                material={materials.c_light2}
              />
            </group>
            <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh053.geometry}
                material={materials.ight_h}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh053_1.geometry}
                material={materials.black_placri1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh053_2.geometry}
                material={materials.c_light2}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCube38_f_01875.geometry}
              material={materials.table_cloth}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.camp.geometry}
              material={materials.camp}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.sweep1001.geometry}
              material={materials["tree_texture.001"]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.grass_plain.geometry}
              material={materials.grass}
              position={[0, 0.01, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={13.248}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.grass_plain001.geometry}
              material={materials["Material.004"]}
              position={[0, 0.01, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={13.248}
            />
          </RigidBody>
        </group>
      </>
    );
}