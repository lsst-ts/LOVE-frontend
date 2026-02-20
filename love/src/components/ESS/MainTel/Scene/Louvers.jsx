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

import PropTypes from 'prop-types';
import { LouversPositionESS } from 'Config';
import Louver from './Louver';

export function Louvers({ percentOpen = [], ids = [1] }) {
  const idsToUse = ids ?? [1];
  const percentOpenToUse = percentOpen ?? [0];
  return LouversPositionESS.map((louver) => {
    const index = idsToUse.indexOf(louver.id ?? 1);
    return (
      <Louver
        key={`louver-${index}`}
        position={louver.position}
        id={louver.id}
        name={louver.name}
        angle={louver.angle}
        type={louver.type}
        percentOpen={percentOpenToUse[index]}
      />
    );
  });
}

Louvers.propTypes = {
  louvers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        z: PropTypes.number,
      }),
      angle: PropTypes.number,
      type: PropTypes.string,
    }),
  ),
  percentOpen: PropTypes.arrayOf(PropTypes.number),
  ids: PropTypes.arrayOf(PropTypes.number),
};
