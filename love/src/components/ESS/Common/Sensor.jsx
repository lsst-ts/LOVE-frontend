import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import * as THREE from "three";
import { Vector } from './Vector';

const Sensor = (props) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = props.selectedSensor === props.sensorId;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered]);

  return (
    <>
      { (isSelected || hovered) && (<mesh
        {...props}
        ref={mesh}
        scale={hovered ? [2.3, 2.3, 2.3]: [1.3, 1.3, 1.3]}
        onPointerEnter={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        onClick={(e) => {
          props.setSensor(props.sensorId);
          setHover(true);
        }}
        position={[props.position.x, props.position.z, props.position.y]}
      >
        <sphereGeometry args={[0.15, 64, 64]} />
        <meshBasicMaterial color={hovered ? props.color : 0xffffff} side={THREE.BackSide}/>
      </mesh>)}
      <mesh
        {...props}
        ref={mesh}
        scale={hovered ? [2, 2, 2]: [1, 1, 1]}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
        onClick={(e) => {
          props.setSensor(props.sensorId);
          setHover(true);
        }}
        position={[props.position.x, props.position.z, props.position.y]}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={hovered ? 0xffffff : props.color}/>
      </mesh>
    </>
  ); 
}

Sensor.propTypes = {
  sensorId: PropTypes.number,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  color: PropTypes.number,
  setSensor: PropTypes.func,
};

Sensor.defaultProps = {
  sensorId: 0,
  position: {x: 0, y: 0, z: 0},
  color: 0xffff00,
  setSensor: (id) => {console.log('Sensor default setSensor(', id, ')')},
};

const comparatorSensor = (prevProps, nextProps) => {
  return (
      nextProps.sensorId === prevProps.sensorId && 
      isEqual(nextProps.position, prevProps.position) &&
      nextProps.color === prevProps.color && 
      nextProps.setSensor === prevProps.setSensor
    );
};

export default React.memo(Sensor, comparatorSensor);
