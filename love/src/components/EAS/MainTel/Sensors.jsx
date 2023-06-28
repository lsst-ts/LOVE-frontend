import React, { useRef, useState } from 'react';

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
      position={[props.position.x, props.position.y, props.position.z]}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color={hovered ? "white" : props.color}/>
    </mesh>
  );
    
}

export function Sensors() {

  const sensors = [
    {
      name: 'sensor1',
      position: {
        x: -2,
        y: 0,
        z: 0,
      },
      color: 0xff0000,
    },
    {
      name: 'sensor2',
      position: {
        x: 2,
        y: 0,
        z: 0,
      },
      color: 0x00ff00,
    },
    {
      name: 'sensor3',
      position: {
        x: 0,
        y: -2,
        z: 0,
      },
      color: 0xff0000,
    },
    {
      name: 'sensor4',
      position: {
        x: 0,
        y: 2,
        z: 0,
      },
      color: 0x00ff00,
    },
    {
      name: 'sensor5',
      position: {
        x: 0,
        y: 0,
        z: -2,
      },
      color: 0xff0000,
    },
    {
      name: 'sensor6',
      position: {
        x: 0,
        y: 0,
        z: 2,
      },
      color: 0x00ff00,
    },
    {
      name: 'sensor7',
      position: {
        x: 2,
        y: 2,
        z: 2,
      },
      color: 0xffff00,
    },
    {
      name: 'sensor8',
      position: {
        x: -4.8,
        y: -4.8,
        z: -2,
      },
      color: 0xffff00,
    },
    {
      name: 'sensor9',
      position: {
        x: -4.8,
        y: 0,
        z: 0,
      },
      color: 0xff1100,
    },
    {
      name: 'sensor10',
      position: {
        x: 4.5,
        y: 0,
        z: -1,
      },
      color: 0x00ff00,
    },
    {
      name: 'senso11',
      position: {
        x: -4.8,
        y: 4,
        z: -1,
      },
      color: 0xff0000,
    },
    {
      name: 'sensor12',
      position: {
        x: -4.5,
        y: 4,
        z: 2,
      },
      color: 0x00ff00,
    },
  ]

  return (
    <>
      {sensors.map((sensor) => {
        return (
          <Sensor
            position={sensor.position}
            name={sensor.name}
            color={sensor.color}
          />
        );
      })}
    </>
  );
}