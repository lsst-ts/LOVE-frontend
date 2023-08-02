import React, { Suspense, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Sensors } from '../../Common/Sensors';
import { Dome } from './Dome';
import { isEqual } from 'lodash';
import { Shutter } from './Shutter';

const INITIAL_CAMERA_POSITION = [8.8, 4.5, 7];
const INITIAL_TARGET = [0, 1, 0];

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

  const {
    positions,
    selectedSensor,
    setSensor,
    values,
    speeds,
    directions,
    getGradiantColorX,
    percentOpenShutter
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
      <gridHelper args={[6, 6]}/>

      <Dome />

      <Shutter
        name={'shutter 0'}
        position={{x: 0, y: -3.3, z: 7}}
        openPercent={percentOpenShutter[0] ?? 100}
      />

      <Shutter
        name={'shutter 1'}
        position={{x: 0, y: 3.3, z: 7}}
        openPercent={percentOpenShutter[1] ?? 100}
      />

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
  louversIds: PropTypes.arrayOf(PropTypes.number),
  percentOpen: PropTypes.arrayOf(PropTypes.number),
};

Scene.defaultProps = {
  selectedSensor: 0,
  positions: [],
  percentOpen: [],
  setSensor: () => {console.log('scene default setSensor')},
}

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.selectedSensor === nextProps.selectedSensor &&
    isEqual(prevProps.percentOpen, nextProps.percentOpen ) &&
    isEqual(prevProps.positions, nextProps.positions )
  )
}

export default React.memo(Scene, comparator);
