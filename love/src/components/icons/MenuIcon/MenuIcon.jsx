/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <g>
        <circle cx="256" cy="256" r="64" />
        <circle cx="256" cy="448" r="64" />
        <circle cx="256" cy="64" r="64" />
      </g>
    </svg>
  );
}

export default MenuIcon;
