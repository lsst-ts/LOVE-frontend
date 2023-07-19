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
    const temperature = values[index];
    const rgb = (getGradiantColorX  && temperature) ? getGradiantColorX(temperature) : 'rgb(255, 255, 0)';
    return { position: position, id: index + 1, color: rgb };
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
  values: PropTypes.arrayOf(PropTypes.number),
  getGradiantColorX: PropTypes.func,
};

Sensors.defaultProps = {
  positions: [],
  setSensor: () => {console.log('Sensors default setSensor')},
  selectedSensor: undefined,
  values: [],
  getGradiantColorX: () => {0xffff00},
};
