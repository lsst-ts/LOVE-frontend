/** 
This file is part of LOVE-frontend.

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
import Level1 from './Level1.svg?react';
import Level2 from './Level2.svg?react';
import Level3 from './Level3.svg?react';
import Level4 from './Level4.svg?react';
import Level5 from './Level5.svg?react';

function Map({ level }) {
  switch (level) {
    case 1:
      return <Level1 />;
    case 2:
      return <Level2 />;
    case 3:
      return <Level3 />;
    case 4:
      return <Level4 />;
    case 5:
      return <Level5 />;
    default:
      return <Level1 />;
  }
}

Map.propTypes = {
  /** Facility level to show */
  level: PropTypes.number,
};

export default Map;
