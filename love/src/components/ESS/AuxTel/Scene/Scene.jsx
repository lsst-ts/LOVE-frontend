import React, { Suspense, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Sensors } from '../../Common/Sensors';
import { Dome } from './Dome';
import { isEqual } from 'lodash';
import { Door } from './Door';
import { Fan } from './Fan';
import { FirstFloor } from './FirstFloor';

const INITIAL_CAMERA_POSITION = [-2.8, 9.5, -6];
const INITIAL_TARGET = [0, 0, 0];

function CameraController() {
  const { camera, gl } = useThree();
  useEffect(
     () => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 3;
        controls.maxDistance = 15;
        controls.target = new THREE.Vector3(INITIAL_TARGET[0], INITIAL_TARGET[1], INITIAL_TARGET[2]);
        controls.update();
        return () => {
          controls.dispose();
        };
     },
     [camera, gl]
  );
  return null;
};

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

  const fans = [
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(135)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(135)) * 4.47,
        z: -1.15 - 0.8,
      },
      angle: 135,
      percentOpen: 50,
      width: 1.93,
      height: 1.2,
    },
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(45)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(45)) * 4.47,
        z: -1.15 - 0.8,
      },
      angle: 45,
      percentOpen: 70,
      width: 1.93,
      height: 1.2,
    },
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(315)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(315)) * 4.47,
        z: -1.15 - 0.8,
      },
      angle: 315,
      percentOpen: 30,
      width: 1.93,
      height: 1.2,
    },
  ];

  const {
    positions,
    selectedSensor,
    setSensor,
    values,
    speeds,
    directions,
    getGradiantColorX,
    percentOpenMainDoor,
    percentOpenDropoutDoor,
    azimuthPosition,
  } = props;

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

      {/** Main Door */}
      <Door
        isMainDoor={true}
        thetaStart={28}
        thetaLength={84}
        openPercent={percentOpenMainDoor}
        azimuthPosition={azimuthPosition}
      />

      {/** Dropout Door */}
      <Door
        isMainDoor={false}
        thetaStart={0}
        thetaLength={27.9}
        openPercent={percentOpenDropoutDoor}
        azimuthPosition={azimuthPosition}
      />

      {/** Windows */}
      {fans.map((fan) => {
        return (
          <Fan
            position={fan.position}
            percentOpen={fan.percentOpen}
            angle={fan.angle}
            width={fan.width}
            height={fan.height}
          />
        );
      })}

      <FirstFloor />

      <Sensors 
        selectedSensor={selectedSensor}
        setSensor={setSensor}
        positions={positions}
        values={values}
        speeds={speeds}
        directions={directions}
        getGradiantColorX={getGradiantColorX}
      />

      </Suspense>
    </Canvas>
    </>
  );
}

Scene.propTypes = {
  selectedSensor: PropTypes.number,
  positions: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  })),
  setSensor: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.number),
  speeds: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  })),
  directions: PropTypes.arrayOf(PropTypes.number),
  getGradiantColorX: PropTypes.func,
  percentOpenMainDoor: PropTypes.number,
  percentOpenDropoutDoor: PropTypes.number,
};

Scene.defaultProps = {
  selectedSensor: 0,
  positions: [],
  percentOpenMainDoor: 0,
  percentOpenDropoutDoor: 0,
  setSensor: () => {console.log('scene default setSensor')},
}

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.selectedSensor === nextProps.selectedSensor &&
    prevProps.percentOpenMainDoor === nextProps.percentOpenMainDoor &&
    prevProps.percentOpenDropoutDoor === nextProps.percentOpenDropoutDoor &&
    isEqual(prevProps.positions, nextProps.positions )
  )
}

export default React.memo(Scene, comparator);
