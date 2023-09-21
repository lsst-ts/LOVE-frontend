/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import * as THREE from 'three';

const Sensor = (props) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = props.selectedSensor === props.sensorId;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <group
      ref={mesh}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
      onClick={(e) => {
        props.setSensor(props.sensorId);
        setHover(true);
      }}
      position={[props.position.x, props.position.z, props.position.y]}
    >
      {(isSelected || hovered) && (
        <mesh scale={hovered ? [2.3, 2.3, 2.3] : [1.3, 1.3, 1.3]}>
          <sphereGeometry args={[0.15, 64, 64]} />
          <meshBasicMaterial color={hovered ? props.color : 0xffffff} side={THREE.BackSide} />
        </mesh>
      )}
      <mesh scale={hovered ? [2, 2, 2] : [1, 1, 1]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={hovered ? 0xffffff : props.color} />
      </mesh>
    </group>
  );
};

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
  position: { x: 0, y: 0, z: 0 },
  color: 0xffff00,
  setSensor: (id) => {
    console.log('Sensor default setSensor(', id, ')');
  },
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
