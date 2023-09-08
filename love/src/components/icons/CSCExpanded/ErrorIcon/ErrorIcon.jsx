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
import styles from './ErrorIcon.module.css';

export default function ErrorIcon(props) {
  const className = [styles.svg, props.className].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.12 33.5" className={className}>
      <path
        className={styles['cls-1']}
        d="M27.74.44H10.49a1.79,1.79,0,0,0-1.56.9L.3,16.28a1.81,1.81,0,0,0,0,1.8L8.93,33a1.79,1.79,0,0,0,1.56.9H27.74a1.81,1.81,0,0,0,1.57-.9l8.62-15a1.76,1.76,0,0,0,0-1.8L29.31,1.34A1.81,1.81,0,0,0,27.74.44Z"
        transform="translate(-0.06 -0.44)"
      />
      <path
        className={styles['cls-2']}
        d="M12.49,25.73a.8.8,0,0,1-1.14-1.13l6.84-6.84-6.84-6.85a.81.81,0,0,1,0-1.14.8.8,0,0,1,1.14,0l6.84,6.84,6.84-6.84a.8.8,0,0,1,1.14,0,.81.81,0,0,1,0,1.14l-6.84,6.85,6.84,6.84a.8.8,0,1,1-1.14,1.13l-6.84-6.84Z"
        transform="translate(-0.06 -0.44)"
      />
    </svg>
  );
}
