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

import React, { Component } from 'react';

export default class EditIcon extends Component {
  render() {
    return (
      <svg {...this.props} viewBox="0 0 55.25 55.25">
        <g>
          <rect
            x="5.5"
            y="19.39"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -12.3013 25.9513)"
            width="39.35"
            height="16.86"
          />
          <polygon points="0,53 15.9,49.02 3.98,37.1  " />
          <path d="M52.06,8.34l-7.4-7.4c-1.25-1.25-3.28-1.25-4.53,0L37.1,3.97L49.03,15.9l3.04-3.04C53.31,11.61,53.31,9.59,52.06,8.34z" />
          <rect
            x="40.14"
            y="3.49"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 3.599 32.5375)"
            width="1.87"
            height="16.86"
          />
        </g>
      </svg>
    );
  }
}
