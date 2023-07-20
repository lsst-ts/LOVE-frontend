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
        scale={hovered ? [2.3, 2.3, 2.3]: [1.3, 1.3, 1.3]}
        onPointerEnter={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        onClick={(e) => {
          props.setSensor(props.sensorId);
          setHover(true);
        }}
        position={[props.position.x, props.position.y, props.position.z]}
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
        onClick={(e) => props.setSensor(props.sensorId)}
        position={[props.position.x, props.position.y, props.position.z]}
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
  color: PropTypes.string,
  setSensor: PropTypes.func,
};

Sensor.defaultProps = {
  sensorId: 0,
  position: {x: 0, y: 0, z: 0},
  color: 0xffff00,
  setSensor: (id) => {console.log('Sensor default setSensor(', id, ')')},
}

// const comparatorSensor = (prevProps, nextProps) => {
//   console.log('comparatorSensor');
//   return (
//       nextProps.sensorId === prevProps.sensorId && 
//       isEqual(nextProps.position, prevProps.position) &&
//       nextProps.color === prevProps.color && 
//       nextProps.setSensor === prevProps.setSensor
//     );
// };

// React.memo(Sensor, comparatorSensor);

export function Sensors(props) {

  const {
    selectedSensor,
    setSensor,
    positions,
    values,
    getGradiantColorX,
  } = props;

  const RGBToHex = (rgb) => {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;

    const num = parseInt("0x" + r + g + b, 16);
    return num;
  };
  
  const sensors = positions.map((position, index) => {
    const value = values[index];
    const rgb = (getGradiantColorX  && value) ? getGradiantColorX(value) : 'rgb(255, 255, 0)';
    return { position: position, id: index + 1, color: rgb };
  });

  return (
    <>
      {sensors.map((sensor) => {
        if (sensor.values) {
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
        } else {
          return (
            <Line
              key={`sensor-${sensor.id}`}
              sensorId={sensor.id}
              start={sensor.position}
              end={sensor.value}
              color={sensor.color}
              setSensor={() => setSensor(sensor.id)}
              selectedSensor={selectedSensor}
            />
          );
        }
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
  values: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }))]),
  getGradiantColorX: PropTypes.func,
};

Sensors.defaultProps = {
  positions: [],
  setSensor: () => {console.log('Sensors default setSensor')},
  selectedSensor: undefined,
  values: [],
  getGradiantColorX: () => {0xffff00},
};

const Line = (props) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = props.selectedSensor === props.sensorId;

  const points = [];
  const v1 = new THREE.Vector3(props.start.x, props.start.y, props.start.z);
  const v2 = new THREE.Vector3(props.end.x, props.end.y, props.end.z);
  points.push(v1);
  points.push(v2);

  const direction = new THREE.Vector3();
  const distance = v1.distanceTo(v2);
  direction.subVectors(v2, v1).normalize();

  const conePosition = new THREE.Vector3().copy(v1).addScaledVector(direction, distance - 0.2);
  const coneRotation = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
  );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <>
      <line
        {...props}
        ref={ref}
        onClick={(e) => props.setSensor(props.sensorId)}
        geometry={lineGeometry}
      >
        <lineBasicMaterial color={hovered ? 0xffffff : props.color}
          linewidth={3} linecap={'round'} linejoin={'round'}
        />
      </line>
      <mesh
        {...props}
        ref={ref}
        onClick={(e) => props.setSensor(props.sensorId)}
        position={conePosition}
        rotation={coneRotation}
      >
        <coneGeometry args={[0.2, 0.5, 32]} />
        <meshBasicMaterial color={hovered ? 0xffffff : props.color}/>

      </mesh>
    </>
  );
}

Line.propTypes = {
  sensorId: PropTypes.number,
  start: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  end: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  color: PropTypes.string,
  setSensor: PropTypes.func,
};

Line.defaultProps = {
  sensorId: 0,
  start: {x: 0, y: 0, z: 0},
  end: {x: 1, y: 1, z: 1},
  color: 0xffff00,
  setSensor: (id) => {console.log('Sensor Arrow default setSensor(', id, ')')},
}
