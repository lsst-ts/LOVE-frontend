import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import * as THREE from "three";

const Sensor = (props) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = props.selectedSensor === props.sensorId;
  return (
    <>
      { (isSelected || hovered) && (<mesh
        {...props}
        ref={mesh}
        scale={hovered ? [2.1, 2.1, 2.1]: [1.2, 1.2, 1.2]}
        onPointerEnter={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        onClick={(e) => {
          props.setSensor(props.sensorId);
          setHover(true);
        }}
        position={[props.position.x, props.position.y, props.position.z]}
      >
        <sphereGeometry args={[0.15, 64, 64]} />
        <meshBasicMaterial color={hovered ? props.color : "white"} side={THREE.BackSide}/>
      </mesh>)}
      <mesh
        {...props}
        ref={mesh}
        scale={hovered ? [2, 2, 2]: [1, 1, 1]}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
        onClick={(e) => props.setSensor(props.sensorId)}
        position={[props.position.x, props.position.y, props.position.z]}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={hovered ? "white" : props.color}/>
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
}

const comparatorSensor = (prevProps, nextProps) => {
  console.log('comparatorSensor');
  return (
      nextProps.sensorId === prevProps.sensorId && 
      isEqual(nextProps.position, prevProps.position) &&
      nextProps.color === prevProps.color && 
      nextProps.setSensor === prevProps.setSensor
    );
};

React.memo(Sensor, comparatorSensor);

export function Sensors(props) {

  const {
    positions = [],
    sensorName,
    setSensor,
    selectedSensor
  } = props;
  
  const sensors = positions.map((position, index) => {
    return { name: sensorName, position: position, id: index, color: 0xffff00};
  });

  return (
    <>
      {sensors.map((sensor) => {
        return (
          <Sensor
            key={`sensor-${sensor.id}`}
            sensorId={sensor.id}
            position={sensor.position}
            color={sensor.color}
            setSensor={() => setSensor(sensor.id)}
            selectedSensor={selectedSensor}
          />
        );
      })}
    </>
  );
}

Sensors.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  })),
  setSensor: PropTypes.func,
  selectedSensor: PropTypes.number,
};

Sensors.defaultProps = {
  positions: [],
  setSensor: () => {console.log('Sensors default setSensor')},
  selectedSensor: undefined,
};
