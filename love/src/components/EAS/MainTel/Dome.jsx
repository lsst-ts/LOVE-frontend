import * as THREE from "three";

export function Dome () {

  const clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)];

  return (
    <>
    <mesh position={[0, -1, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial color="lightblue" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>

    <mesh position={[0, 1, 0]}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial wireframe color="red" clippingPlanes={clippingPlanes} clipIntersection={false} />
    </mesh>
    </>
  );
}