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
import styles from './InfoIcon.module.css';

export default function InfoIcon(props) {
  const className = [styles.svg, props.className].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.98 37.98" className={className}>
      <circle className={styles['cls-1']} cx="18.99" cy="18.99" r="18.99" />
      <path
        className={styles['cls-2']}
        d="M19.3,8a2.3,2.3,0,1,0,2.31,2.3A2.3,2.3,0,0,0,19.3,8Z"
        transform="translate(-0.31 0.06)"
      />
      <path
        className={styles['cls-2']}
        d="M19.3,16.05a1.73,1.73,0,0,0-1.72,1.73V28.14a1.73,1.73,0,0,0,3.45,0V17.78A1.73,1.73,0,0,0,19.3,16.05Z"
        transform="translate(-0.31 0.06)"
      />
    </svg>
  );
}
