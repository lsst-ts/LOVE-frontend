import React, { Suspense, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Sensors } from '../../Common/Sensors';
import { Dome } from './Dome';
import { isEqual } from 'lodash';
import { Door } from './Door';
import { Frame } from './Frame';
import { Fan } from './Fan';

const INITIAL_CAMERA_POSITION = [8.8, 4.5, 7];
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

const Scene = (props) => {

  const fans = [
    {
      position: {
        x: 0,
        y: 0,
        z: -1 -0.8 -1.15,
      },
      angle: 45,
      percentOpen: 50,
    },
    {
      position: {
        x: 0,
        y: 0,
        z: -1 -0.8 -1.15,
      },
      angle: 116,
      percentOpen: 40,
    },
    {
      position: {
        x: 0,
        y: 0,
        z: -1 -0.8 -1.15,
      },
      angle: 187,
      percentOpen: 10,
    },
    {
      position: {
        x: 0,
        y: 0,
        z: -1 -0.8 -1.15,
      },
      angle: 262,
      percentOpen: 70,
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
  } = props;

  return (
    <>
    <Canvas
      camera={{
        position: INITIAL_CAMERA_POSITION,
      }}
    >
      <Suspense fallback={<div>loading</div>}>
      <CameraController />
      <ambientLight intensity={0.8} />
      <directionalLight position={[-12, 12, 0]} intensity={1} />
      <axesHelper args={[7]} />
      <gridHelper args={[9, 9]}/>

      {/* <Dome /> */}

      {/** Main Door */}
      <Door
        isMainDoor={true}
        thetaStart={20.2}
        thetaLength={80}
        openPercent={percentOpenMainDoor}
      />

      {/** Dropout Door */}
      <Door
        isMainDoor={false}
        thetaStart={0}
        thetaLength={20}
        openPercent={percentOpenDropoutDoor}
      />

      {/** Frame Door */}
      <Frame
        position={{x: -1.5, y: 0, z: 0}}
        thetaStart={0}
        thetaLength={100}
      />
      <Frame
        position={{x: 1.5, y: 0, z: 0}}
        thetaStart={0}
        thetaLength={100}
        radialSegments={9}
      />
      <Frame
        position={{x: 0, y: 0, z: 0}}
        thetaStart={99}
        thetaLength={2}
        height={3.1}
        radialSegments={1}
        heightSegments={3}
      />
      <Frame
        position={{x: 0, y: 0, z: 0}}
        thetaStart={-1}
        thetaLength={2}
        height={3.1}
        radialSegments={1}
        heightSegments={3}
      />

      {/** Windows */}
      {fans.map((fan) => {
        return (
          <Fan
            position={fan.position}
            percentOpen={fan.percentOpen}
            angle={fan.angle}
          />
        );
      })}

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
  speeds: PropTypes.oneOf([undefined, PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  })]),
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
