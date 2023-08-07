import React, { useRef  } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from 'react-three-fiber';
import { isEqual } from 'lodash';
import * as THREE from "three";

export function Fan(props) {

  const angleRadians = THREE.MathUtils.degToRad(props.angle); //degree to radians

  const { width, height } = props;
  const frame = [width, height];
  const window = [width, height * ((100 - props.percentOpen) / 100) + 0.15];

  return (
    <>
      <group
        position={[props.position.x, props.position.z, props.position.y]}
        rotation-y={angleRadians}
      >
        <group
        >
          <mesh
            position={[0, frame[1]/2 + 0.15 - window[1]/2, 0]}
          >
            <planeBufferGeometry attach="geometry" args={window} />
            <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
        <mesh
          position={[0, 0, -0.05]}
        >
          <boxGeometry args={[frame[0], frame[1], 0.05]} />
          <meshBasicMaterial color={0x3f7b9d} wireframe transparent opacity={0.8} />
        </mesh>
      </group>
    </>
  );
};

Fan.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  name: PropTypes.string,
  id: PropTypes.number,
  angle: PropTypes.number,
  percentOpen: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

Fan.defaultProps = {
  position: {x: 0, y: 0, z: 0},
  name: '',
  id: 1,
  angle: 0,
  percentOpen: 100,
  width: 2,
  height: 2,
};

const comparator = (prevProps, nextProps) => {
  return (
      isEqual(nextProps.position, prevProps.position) && 
      prevProps.name === nextProps.name && 
      prevProps.angle === nextProps.angle && 
      prevProps.percentOpen === nextProps.percentOpen
    );
};

export default React.memo(Fan, comparator);
