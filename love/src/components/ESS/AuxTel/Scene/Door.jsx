import React, { useRef, useUpdate } from 'react';
import PropTypes from 'prop-types';

import * as THREE from "three";

export function Door (props) {

  const ref = useRef();

  const radius = 9.3 / 2;
  const height = 3;
  const radialSegments = 32;
  const heightSegments = 1;
  const openEnded = true;
  const thetaStart = THREE.MathUtils.degToRad(props.thetaStart);
  const thetaLength = THREE.MathUtils.degToRad(props.thetaLength);
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

  const openDoor = props.isMainDoor ? 
    THREE.MathUtils.degToRad(-1 * props.thetaLength * props.openPercent / 100)
    : THREE.MathUtils.degToRad(90 * props.openPercent / 100);

  return (
    <>
        <group
          position={[props.position.x, props.position.z, props.position.y]}
        >
          <group
            position={[0, 0, !props.isMainDoor ? radius : 0]}
            rotation-x={openDoor}
          >
            <group
              position={[0, 0, !props.isMainDoor ? -1 * radius : 0]}
            >
              <mesh
                ref={ref}
                rotation-z={THREE.MathUtils.degToRad(90)}
                position={[0, 0, 0]}
              >
                <cylinderBufferGeometry
                  attach="geometry"
                  args={args}
                />
                <meshBasicMaterial
                  attach="material"
                  color={0x3f7b9d}
                  transparent
                  opacity={0.6}
                  side={THREE.DoubleSide} 
                />
              </mesh>
            </group>
          </group>
        </group>
    </>
  );
}

Door.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  openPercent: PropTypes.number,
  thetaStart: PropTypes.number,
  thetaLength: PropTypes.number,
  isMainDoor: PropTypes.bool,
};

Door.defaultProps = {
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  openPercent: 40,
  thetaStart: 20,
  thetaLength: 80,
  isMainDoor: true,
};

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.openPercent === nextProps.openPercent &&
    isEqual(prevProps.position, nextProps.position)
  );
}

export default React.memo(Door, comparator);
