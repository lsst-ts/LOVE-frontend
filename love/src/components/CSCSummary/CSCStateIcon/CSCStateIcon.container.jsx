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
import CSCStateIcon from './CSCStateIcon';

export const schema = {
  description: 'CSC state icon component',
  defaultSize: [77, 32],  // Default size for the icon
  props: {
    cscName: {
      type: 'string',
      description: 'Name of the CSC to monitor',
      isPrivate: false,
      default: 'Test',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the CSC',
      isPrivate: false,
      default: 1,
    },
    hasHeartbeat: {
      type: 'boolean',
      description: 'Whether the CSC produces heartbeat',
      isPrivate: false,
      default: true,
    },
  },
};

const CSCStateIconContainer = ( cscName, salindex, hasHeartbeat) => {
  return (
    <CSCStateIcon cscName={cscName} salindex={salindex} hasHeartbeat={hasHeartbeat} />
  );
};

export default CSCStateIconContainer;
