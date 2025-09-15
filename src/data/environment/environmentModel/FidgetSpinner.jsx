import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function FidgetSpinnerModel() {
  const { scene: Walls } = useGLTF("/models/fidget spinner/walls.glb");
  const { nodes, materials } = useGLTF("/models/fidget spinner/assets.glb");
  return (
    <>
    <mesh
        castShadow
        receiveShadow
        geometry={nodes.Flower_pot002.geometry}
        material={materials['Mat.1']}
        position={[0.017* 55, 0.047* 55, -0.176* 55]}
        rotation={[Math.PI /2, 0, 0]}
        scale={0.01 * 55}
      />
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={Walls} scale={55} />
      <group dispose={null} scale={55} position={[0, 0, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Emmision.geometry}
          material={materials['Spinner_rect_0005:Emmision_mat']}
          position={[-2.945, 11.566, -14.379]}
          rotation={[0, 0, -Math.PI]}
          scale={-1}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006.geometry}
          material={materials['Mat.1']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006_1.geometry}
          material={materials['Mat.2']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006_2.geometry}
          material={materials.Mat}
        />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh007.geometry}
          material={materials['Table_black.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh007_1.geometry}
          material={materials['table_white.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh007_2.geometry}
          material={materials['pillaaaaars.001']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface4.geometry}
        material={materials.god}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Flower_pot001.geometry}
        material={materials.Mat}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Flower_pot003.geometry}
        material={materials['Mat.2']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
    </group>
    </RigidBody>
    </>
  );
}