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

const Vector = (props) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = props.selectedSensor === props.sensorId;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  const points = [];
  const v1 = new THREE.Vector3(props.start.x, props.start.z, props.start.y);
  let v2 = undefined;
  if (props.end !== undefined && props.angle === undefined) {
    v2 = new THREE.Vector3(props.end.x, props.end.z, props.end.y);
  } else {
    const angleRadians = THREE.MathUtils.degToRad(props.angle); //degree to radians
    v2 = new THREE.Vector3(Math.cos(angleRadians), Math.sin(angleRadians), 0).normalize();
  }
  points.push(v1);
  points.push(v2);

  const direction = new THREE.Vector3();
  const distance = v1.distanceTo(v2);
  direction.subVectors(v2, v1).normalize();

  const conePosition = new THREE.Vector3().copy(v1).addScaledVector(direction, distance - 0.2);
  const coneRotation = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction),
  );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <>
      <group
        onPointerEnter={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        onClick={(e) => {
          props.setSensor(props.sensorId);
          setHover(true);
        }}
      >
        <line {...props} ref={ref} geometry={lineGeometry}>
          <lineBasicMaterial
            color={hovered ? 0xffffff : props.color}
            linewidth={3}
            linecap={'round'}
            linejoin={'round'}
          />
        </line>
        <mesh {...props} ref={ref} position={conePosition} rotation={coneRotation}>
          <coneGeometry args={[0.2, 0.5, 32]} />
          <meshBasicMaterial color={hovered ? 0xffffff : props.color} />
        </mesh>
      </group>
    </>
  );
};

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.sensorId === nextProps.sensorId &&
    prevProps.angle === nextProps.angle &&
    prevProps.color === nextProps.color &&
    isEqual(prevProps.start, nextProps.start) &&
    isEqual(prevProps.end, nextProps.end)
  );
};

Vector.propTypes = {
  sensorId: PropTypes.number,
  start: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  end: PropTypes.oneOf([
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
    undefined,
  ]),
  angle: PropTypes.oneOf([PropTypes.number, undefined]),
  color: PropTypes.number,
  setSensor: PropTypes.func,
};

Vector.defaultProps = {
  sensorId: 0,
  start: { x: 0, y: 0, z: 0 },
  end: undefined,
  angle: undefined,
  color: 0xffff00,
  setSensor: (id) => {
    console.log('Sensor Arrow default setSensor(', id, ')');
  },
};

export default React.memo(Vector, comparator);
