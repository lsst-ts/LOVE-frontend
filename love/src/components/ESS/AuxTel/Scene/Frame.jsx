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

import * as THREE from 'three';

export function Frame(props) {
  const ref = useRef();

  const radius = 9.4 / 2;
  const { height = 0.1 } = props;
  const { radialSegments = 16 } = props;
  const { heightSegments = 1 } = props;
  const openEnded = true;
  const thetaStart = THREE.MathUtils.degToRad(props.thetaStart);
  const thetaLength = THREE.MathUtils.degToRad(props.thetaLength);
  const args = [radius, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength];

  const args2 = [
    radius - 0.04,
    radius - 0.04,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength,
  ];

  return (
    <>
      <group position={[props.position.x, props.position.z, props.position.y]}>
        <group position={[0, 0, 0]}>
          <group position={[0, 0, 0]}>
            <mesh ref={ref} rotation-z={THREE.MathUtils.degToRad(90)} position={[0, 0, 0]}>
              <cylinderBufferGeometry attach="geometry" args={args} />
              <meshBasicMaterial
                attach="material"
                color={0x3f7b9d}
                transparent
                opacity={0.9}
                wireframe
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh ref={ref} rotation-z={THREE.MathUtils.degToRad(90)} position={[0, 0, 0]}>
              <cylinderBufferGeometry attach="geometry" args={args2} />
              <meshBasicMaterial
                attach="material"
                color={0x3f7b9d}
                transparent
                opacity={0.9}
                wireframe
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

Frame.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  thetaStart: PropTypes.number,
  thetaLength: PropTypes.number,
};

Frame.defaultProps = {
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  thetaStart: 0,
  thetaLength: 100,
};

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.thetaStart === nextProps.thetaStart &&
    prevProps.thetaLength === nextProps.thetaLength &&
    isEqual(prevProps.position, nextProps.position)
  );
};

export default React.memo(Frame, comparator);
