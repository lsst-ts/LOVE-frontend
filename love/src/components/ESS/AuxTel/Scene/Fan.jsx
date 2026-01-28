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

import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import * as THREE from 'three';

export function Fan({ position = { x: 0, y: 0, z: 0 }, angle = 0, percentOpen = 100, width = 2, height = 2 }) {
  const angleRadians = THREE.MathUtils.degToRad(angle); //degree to radians

  const frame = [width, height];
  const window = [width, height * ((100 - percentOpen) / 100) + 0.15];

  return (
    <>
      <group position={[position.x, position.z, position.y]} rotation-y={angleRadians}>
        <group>
          <mesh position={[0, frame[1] / 2 + 0.15 - window[1] / 2, 0]}>
            <planeBufferGeometry attach="geometry" args={window} />
            <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[frame[0], frame[1], 0.05]} />
          <meshBasicMaterial color={0x3f7b9d} wireframe transparent opacity={0.8} />
        </mesh>
      </group>
    </>
  );
}

Fan.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  angle: PropTypes.number,
  percentOpen: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

const comparator = (prevProps, nextProps) => {
  return (
    isEqual(nextProps.position, prevProps.position) &&
    prevProps.angle === nextProps.angle &&
    prevProps.percentOpen === nextProps.percentOpen
  );
};

export default React.memo(Fan, comparator);
