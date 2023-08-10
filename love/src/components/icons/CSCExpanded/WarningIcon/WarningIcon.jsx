/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import styles from './WarningIcon.module.css';

export default function WarningIcon(props) {
  const className = [styles.svg, props.className].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.45 33.74" className={className}>
      <path
        className={styles['cls-1']}
        d="M18,.89.47,31.33A1.64,1.64,0,0,0,1.89,33.8H37a1.65,1.65,0,0,0,1.43-2.47L20.9.89A1.65,1.65,0,0,0,18,.89Z"
        transform="translate(-0.24 -0.06)"
      />
      <path
        className={styles['cls-2']}
        d="M19.06,9.67c-1.09,0-1.95.58-1.95,1.63,0,3.17.37,7.74.37,10.92,0,.83.73,1.18,1.58,1.18.64,0,1.55-.35,1.55-1.18,0-3.18.37-7.75.37-10.92A1.71,1.71,0,0,0,19.06,9.67Z"
        transform="translate(-0.24 -0.06)"
      />
      <path
        className={styles['cls-2']}
        d="M19.09,25.24a2.06,2.06,0,1,0,0,4.11,2.06,2.06,0,0,0,0-4.11Z"
        transform="translate(-0.24 -0.06)"
      />
    </svg>
  );
}
