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

import React, { useRef, useUpdate } from 'react';
import PropTypes from 'prop-types';
import { Frame } from './Frame';
import * as THREE from 'three';

export function Door(props) {
  const ref = useRef();

  const radius = 9.4 / 2;
  const height = 2.4;
  const radialSegments = 32;
  const heightSegments = 1;
  const openEnded = true;
  const thetaStart = THREE.MathUtils.degToRad(props.thetaStart);
  const thetaLength = THREE.MathUtils.degToRad(props.thetaLength);
  const args = [radius, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength];

  const frameLengthAngle = props.thetaStart + props.thetaLength;

  const openDoor = props.isMainDoor
    ? THREE.MathUtils.degToRad((-1 * props.thetaLength * props.openPercent) / 100)
    : THREE.MathUtils.degToRad((90 * props.openPercent) / 100);

  return (
    <>
      <group position={[props.position.x, props.position.z, props.position.y]}>
        <group position={[0, 0, !props.isMainDoor ? radius : 0]} rotation-x={openDoor}>
          <group position={[0, 0, !props.isMainDoor ? -1 * radius : 0]}>
            <mesh ref={ref} rotation-z={THREE.MathUtils.degToRad(90)} position={[0, 0, 0]}>
              <cylinderBufferGeometry attach="geometry" args={args} />
              <meshBasicMaterial attach="material" color={0x3f7b9d} transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>

        {/** Frame Door */}
        {props.isMainDoor ? (
          <>
            <Frame position={{ x: -height / 2, y: 0, z: 0 }} thetaStart={0} thetaLength={frameLengthAngle} />
            <Frame
              position={{ x: height / 2, y: 0, z: 0 }}
              thetaStart={0}
              thetaLength={frameLengthAngle}
              radialSegments={9}
            />
            <Frame
              position={{ x: 0, y: 0, z: 0 }}
              thetaStart={frameLengthAngle - 1}
              thetaLength={2}
              height={height + 0.1}
              radialSegments={1}
              heightSegments={3}
            />
            <Frame
              position={{ x: 0, y: 0, z: 0 }}
              thetaStart={-1}
              thetaLength={2}
              height={height + 0.1}
              radialSegments={1}
              heightSegments={3}
            />
          </>
        ) : (
          <></>
        )}
      </group>
    </>
  );
}

Door.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  openPercent: PropTypes.number,
  thetaStart: PropTypes.number,
  thetaLength: PropTypes.number,
  isMainDoor: PropTypes.bool,
};

Door.defaultProps = {
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  openPercent: 40,
  thetaStart: 20,
  thetaLength: 80,
  isMainDoor: true,
};

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.openPercent === nextProps.openPercent &&
    isEqual(prevProps.position, nextProps.position)
  );
};

export default React.memo(Door, comparator);
