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
  radius: 15,
  height: 27,
  displaceY: 0,
};
