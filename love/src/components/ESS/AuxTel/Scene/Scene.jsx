/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Suspense, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { isEqual } from 'lodash';
import { FirstFloor } from './FirstFloor';

const INITIAL_CAMERA_POSITION = [-2.8, 9.5, -6];
const INITIAL_TARGET = [0, 0, 0];

function CameraController() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.target = new THREE.Vector3(INITIAL_TARGET[0], INITIAL_TARGET[1], INITIAL_TARGET[2]);
    controls.update();
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
}

function createTextCanvas(text, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = `bold 100px Arial`;
  const textWidth = context.measureText(text).width;

  canvas.width = textWidth;
  canvas.height = 100;

  context.font = `bold 100px Arial`;
  context.fillStyle = color;
  context.fillText(text, 0, 100);
  return canvas;
}

const Scene = (props) => {
  const canvas = createTextCanvas('N', 'white');
  const textTexture = new THREE.CanvasTexture(canvas);

  const initialCameraPosition = [
    props.initialCameraPosition?.x ?? INITIAL_CAMERA_POSITION[0],
    props.initialCameraPosition?.z ?? INITIAL_CAMERA_POSITION[1],
    props.initialCameraPosition?.y ?? INITIAL_CAMERA_POSITION[2],
  ];

  return (
    <>
      <Canvas
        camera={{
          position: initialCameraPosition,
        }}
      >
        <Suspense fallback={<div>loading</div>}>
          <CameraController />
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 12, 12]} intensity={1} />
          <axesHelper args={[7]} />
          <gridHelper args={[10, 10]} />

          <mesh
            position={[0, 0.2, 5.8]}
            rotation-x={THREE.MathUtils.degToRad(90)}
            rotation-y={THREE.MathUtils.degToRad(180)}
            scale={[1.6, 1.6, 1.6]}
          >
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={textTexture} side={THREE.DoubleSide} transparent />
          </mesh>

          <FirstFloor />

          {props.children}
        </Suspense>
      </Canvas>
    </>
  );
};

Scene.propTypes = {
  initialCameraPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
};

Scene.defaultProps = {
  initialCameraPosition: {
    x: INITIAL_CAMERA_POSITION[0],
    y: INITIAL_CAMERA_POSITION[2],
    z: INITIAL_CAMERA_POSITION[1],
  },
};

const comparator = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.initialCameraPosition, nextProps.initialCameraPosition) &&
    isEqual(prevProps.children, nextProps.children)
  );
};

export default React.memo(Scene, comparator);
