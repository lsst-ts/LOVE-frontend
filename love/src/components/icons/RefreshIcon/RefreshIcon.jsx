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

import React from 'react';
import styles from './RefreshIcon.module.css';

function RefreshIcon(props) {
  const { className: propsClassName, ...otherProps } = props;
  return (
    <svg className={[styles.icon, propsClassName].join(' ')} viewBox="0 0 256 256" {...otherProps}>
      <title>{props.title}</title>
      <g
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeDasharray=""
        strokeDashoffset="0"
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
      >
        <g transform="scale(5.33333,5.33333)">
          <path d="M13,13c0,-3.3 2.7,-6 6,-6h10c3.3,0 6,2.7 6,6h4c0,-5.5 -4.5,-10 -10,-10h-10c-5.5,0 -10,4.5 -10,10v11.2h4z"></path>
          <path d="M4.6,22l6.4,8.4l6.4,-8.4z"></path>
          <g>
            <path d="M35,35c0,3.3 -2.7,6 -6,6h-10c-3.3,0 -6,-2.7 -6,-6h-4c0,5.5 4.5,10 10,10h10c5.5,0 10,-4.5 10,-10v-12h-4z"></path>
            <path d="M30.6,26l6.4,-8.4l6.4,8.4z"></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default RefreshIcon;
