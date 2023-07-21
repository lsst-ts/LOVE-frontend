import PropTypes from 'prop-types';
import * as THREE from "three";

const LOUVERS = [
  {

  },
];

export function Louver (props) {

  return (
    <>
      <mesh
        {...props}
        scale={[1, 1, 1]}
        position={[props.position.x, props.position.y, props.position.z]}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={hovered ? 0xffffff : props.color}/>
      </mesh>
    </>
  );
}

Louver.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  color: PropTypes.string,
};

Louver.defaultProps = {
  position: {x: 0, y: 0, z: 0},
  color: 0xffff00,
};


export function Louvers (props) {
  const {louvers = [] } = props; 

  return (
    louvers.map((louver) => {
      return (
        <Louver 
          position={louver.position}
        />
      )
    })
  )
}

Louvers.propTypes = {
  louvers: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
    color: PropTypes.string,
  })),
};

Louvers.defaultProps = {
  louvers: [{
    position: {x: 0, y: 0, z: 0},
    color: 0xffff00,
  },],
};