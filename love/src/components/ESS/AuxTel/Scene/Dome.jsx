import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from "three";

export function Dome (props) {

  return (
    <>
    <mesh position={[0, props.displaceY, 0]}>
      <cylinderGeometry
        args={[
          props.radius,
          props.radius,
          props.height,
          Math.floor(2 * Math.PI * props.radius),
          props.height,
        ]}
      />
      <meshBasicMaterial color={0xffff00} transparent opacity={0.1} wireframe />
    </mesh>
    </>
  );
}

Dome.propTypes = {
  radius: PropTypes.number,
  height: PropTypes.number,
  displaceY: PropTypes.number,
};

Dome.defaultProps = {
  radius: 9.3 / 2,
  height: 10,
  displaceY: 0,
};

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.radius === nextProps.radius &&
    prevProps.height === nextProps.height &&
    prevProps.displaceY === nextProps.displaceY
  );
}

export default React.memo(Dome, comparator);
