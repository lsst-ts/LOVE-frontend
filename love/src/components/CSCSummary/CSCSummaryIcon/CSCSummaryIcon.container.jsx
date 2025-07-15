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
import CSCSummaryIcon from './CSCSummaryIcon';

export const schema = {
  description: 'CSC summary icon component',
  defaultSize: [77, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC Summary Icon',
    },
  },
};

const CSCSummaryIconContainer = () => {
  return (
    <CSCSummaryIcon />
  );
};

export default CSCSummaryIconContainer;
