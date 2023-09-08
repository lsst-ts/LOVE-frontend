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
import styles from './UserIcon.module.css';

export default function UserIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.userIcon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 46.41 45.11" className={className}>
      <g>
        <g>
          <path
            className={status}
            d="M23.5,2.66c-5.77,0-10.42,4.2-10.42,11.4S17,28.72,23.5,28.72c7.13,0,10.42-7.46,10.42-14.66S29.27,2.66,23.5,2.66ZM11.83,29.28A11.65,11.65,0,0,0,.39,38.68a5.47,5.47,0,0,0,.75,3.88l0,.06C2,44,15.51,47.77,23.5,47.77S45,44,45.83,42.62l0-.06a5.47,5.47,0,0,0,.75-3.88,11.65,11.65,0,0,0-11.45-9.4H32.21a2,2,0,0,0-1,.33,12.65,12.65,0,0,1-7.72,2.58A12.17,12.17,0,0,1,16,29.61a1.83,1.83,0,0,0-1-.33Z"
            transform="translate(-0.29 -2.66)"
          />
        </g>
      </g>
    </svg>
  );
}
