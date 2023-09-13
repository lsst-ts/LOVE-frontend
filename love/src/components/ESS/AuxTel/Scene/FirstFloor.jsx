import React from 'react';
import * as THREE from "three";

export function FirstFloor() {

  const radius = 9.4 / 2;
  const displaceY = -3.9 - 1.05;
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

  const door = {
    position: {
      x: Math.sin(THREE.MathUtils.degToRad(225)) * radius,
      y: Math.cos(THREE.MathUtils.degToRad(225)) * radius,
      z: displaceY + 1.05,
    },
    angle: 225,
    width: 1.87,
    height: 2.10,
  };

  const garageDoor = {
    position: {
      x: Math.sin(THREE.MathUtils.degToRad(270)) * radius,
      y: Math.cos(THREE.MathUtils.degToRad(270)) * radius,
      z: displaceY + 1.35,
    },
    angle: 270,
    width: 2.43,
    height: 2.70,
  };

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
      <group
        position={[garageDoor.position.x, garageDoor.position.z, garageDoor.position.y]}
        rotation-y={THREE.MathUtils.degToRad(garageDoor.angle)}
      >
        <mesh>
          <boxGeometry args={[garageDoor.width, garageDoor.height, 0.05]} />
          <meshBasicMaterial color={0x3f7b9d} wireframe transparent opacity={0.8} />
        </mesh>
        <mesh
          position={[0, 0, 0.03]}
        >
          <planeBufferGeometry attach="geometry" args={[garageDoor.width - 0.01, garageDoor.height - 0.01]} />
          <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>
    </>
  );
};

export default FirstFloor;