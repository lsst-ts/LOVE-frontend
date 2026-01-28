/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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

const Sensor = ({
  sensorId = 0,
  position = { x: 0, y: 0, z: 0 },
  color = 0xffff00,
  setSensor = (id) => {
    console.log('Sensor default setSensor(', id, ')');
  },
  selectedSensor,
}) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = selectedSensor === sensorId;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <group
      ref={mesh}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => {
        setSensor(sensorId);
        setHover(true);
      }}
      position={[position.x, position.z, position.y]}
    >
      {(isSelected || hovered) && (
        <mesh scale={hovered ? [2.3, 2.3, 2.3] : [1.3, 1.3, 1.3]}>
          <sphereGeometry args={[0.15, 64, 64]} />
          <meshBasicMaterial color={hovered ? color : 0xffffff} side={THREE.BackSide} />
        </mesh>
      )}
      <mesh scale={hovered ? [2, 2, 2] : [1, 1, 1]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={hovered ? 0xffffff : color} />
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

const comparatorSensor = (prevProps, nextProps) => {
  return (
    nextProps.sensorId === prevProps.sensorId &&
    isEqual(nextProps.position, prevProps.position) &&
    nextProps.color === prevProps.color &&
    nextProps.setSensor === prevProps.setSensor
  );
};

export default React.memo(Sensor, comparatorSensor);
