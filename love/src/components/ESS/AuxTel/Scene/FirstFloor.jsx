import React from 'react';
import * as THREE from "three";

export function FirstFloor() {

  const radius = 9.3 / 2;

  const door = {
    position: {
      x: Math.sin(THREE.MathUtils.degToRad(227)) * radius,
      y: Math.cos(THREE.MathUtils.degToRad(227)) * radius,
      z: -0.8 -1.15 - 0.4,
    },
    angle: 227,
    width: 2,
    height: 2.30,
  };

  const displaceY = -radius + door.height/2;
  const height = 0.05;
  const radialSegments = 64;
  const heightSegments = 1;
  const openEnded = true;
  const thetaStart = THREE.MathUtils.degToRad(0);
  const thetaLength = THREE.MathUtils.degToRad(360);
  const args = [
    radius,
    radius, 
    height, 
    radialSegments, 
    heightSegments, 
    openEnded, 
    thetaStart, 
    thetaLength, 
  ];

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={args}
        />
        <meshBasicMaterial
          attach="material"
          color={0x3f7b9d}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide} 
        />
      </mesh>
      <mesh position={[0, displaceY, 0]}>
        <cylinderGeometry
          args={args}
        />
        <meshBasicMaterial
          attach="material"
          color={0x3f7b9d}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide} 
        />
      </mesh>
      <group
        position={[door.position.x, door.position.z, door.position.y]}
        rotation-y={THREE.MathUtils.degToRad(door.angle)}
      >
        <mesh>
          <boxGeometry args={[door.width, door.height, 0.05]} />
          <meshBasicMaterial color={0x3f7b9d} wireframe transparent opacity={0.8} />
        </mesh>
        <mesh
          position={[-door.width/4, 0, 0.03]}
        >
          <planeBufferGeometry attach="geometry" args={[door.width/2 - 0.01, door.height - 0.01]} />
          <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        <mesh
          position={[door.width/4, 0, 0.03]}
        >
          <planeBufferGeometry attach="geometry" args={[door.width/2 - 0.01, door.height - 0.01]} />
          <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>
    </>
  );
};

export default FirstFloor;