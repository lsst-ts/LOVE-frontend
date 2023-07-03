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
        controls.maxDistance = 30;
        return () => {
          controls.dispose();
        };
     },
     [camera, gl]
  );
  return null;
};

const Scene = (props) => {

  return (
    <>
    <Canvas
      camera={{
        position: [15, 15, 17],
      }}
    >
      <Suspense fallback={<div>loading</div>}>
      <CameraController />
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      <axesHelper args={[15]} />
      <gridHelper />

      <Dome />
      <Sensors />

      </Suspense>
    </Canvas>
    </>
  );
}

export default Scene;
