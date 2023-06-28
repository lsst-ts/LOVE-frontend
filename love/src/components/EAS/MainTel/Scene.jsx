import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sensors } from './Sensors';
import { Dome } from './Dome';

function CameraController() {
  const { camera, gl } = useThree();
  useEffect(
     () => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 3;
        controls.maxDistance = 20;
        return () => {
          controls.dispose();
        };
     },
     [camera, gl]
  );
  return null;
};

const Scene = (props) => {

  const meshRef = useRef();

  return (
    <>
    <Canvas
      camera={{
        position: [8, 9, 6],
      }}
    >
      <Suspense fallback={<div>loading</div>}>

      <CameraController />
      
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 5, 5]} intensity={1} />

      <axesHelper size={3} />

      <Sensors />

      <Dome />

      <mesh ref={meshRef}>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial wireframe />
      </mesh>

      </Suspense>

    </Canvas>
    </>
  );
}

export default Scene;
