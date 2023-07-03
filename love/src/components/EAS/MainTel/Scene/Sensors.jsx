import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

function Sensor(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={hovered ? [1.2, 1.2, 1.2]: [1, 1, 1]}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
      onClick={(e) => props.click(props.sensorId)}
      position={[props.position.x, props.position.y, props.position.z]}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color={hovered ? "white" : props.color}/>
    </mesh>
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
  name: PropTypes.string,
  click: PropTypes.func,
};

Sensor.defaultProps = {
  sensorId: 0,
  position: {x: 0, y: 0, z: 0},
  name: '',
  color: 0xffff00,
  click: () => {},
}

export function Sensors(props) {

  const sensors = [
    {
      id: 1,
      name: 'sensor1',
      position: {
        x: -2,
        y: 0,
        z: 0,
      },
      color: 0xff0000,
    },
    {
      id: 2,
      name: 'sensor2',
      position: {
        x: 2,
        y: 0,
        z: 0,
      },
      color: 0x00ff00,
    },
    {
      id: 3,
      name: 'sensor3',
      position: {
        x: 0,
        y: -2,
        z: 0,
      },
      color: 0xff0000,
    },
    {
      id: 4,
      name: 'sensor4',
      position: {
        x: 0,
        y: 2,
        z: 0,
      },
      color: 0x00ff00,
    },
    {
      id: 5,
      name: 'sensor5',
      position: {
        x: 0,
        y: 0,
        z: -2,
      },
      color: 0xff0000,
    },
    {
      id: 6,
      name: 'sensor6',
      position: {
        x: 0,
        y: 0,
        z: 2,
      },
      color: 0x00ff00,
    },
    {
      id: 7,
      name: 'sensor7',
      position: {
        x: 2,
        y: 2,
        z: 2,
      },
      color: 0xffff00,
    },
    {
      id: 8,
      name: 'sensor8',
      position: {
        x: -4.8,
        y: -4.8,
        z: -2,
      },
      color: 0xffff00,
    },
    {
      id: 9,
      name: 'sensor9',
      position: {
        x: -4.8,
        y: 0,
        z: 0,
      },
      color: 0xff1100,
    },
    {
      id: 10,
      name: 'sensor10',
      position: {
        x: 4.5,
        y: 0,
        z: -1,
      },
      color: 0x00ff00,
    },
    {
      id: 11,
      name: 'senso11',
      position: {
        x: -4.8,
        y: 4,
        z: -1,
      },
      color: 0xff0000,
    },
    {
      id: 12,
      name: 'sensor12',
      position: {
        x: -4.5,
        y: 4,
        z: 2,
      },
      color: 0x00ff00,
    },
  ]

  const click = (sensorId) => {
    console.log('click(id): ', sensorId);
  }

  return (
    <>
      {sensors.map((sensor) => {
        return (
          <Sensor
            key={`sensor-${sensor.id}`}
            sensorId={sensor.id}
            position={sensor.position}
            name={sensor.name}
            color={sensor.color}
            click={click}
          />
        );
      })}
    </>
  );
}