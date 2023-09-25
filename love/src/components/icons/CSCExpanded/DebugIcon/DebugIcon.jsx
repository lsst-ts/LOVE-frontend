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
import styles from './DebugIcon.module.css';

export default function DebugIcon(props) {
  const className = [styles.svg, props.className].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.98 37.98" className={className}>
      <circle className={styles['cls-1']} cx="18.99" cy="18.99" r="18.99" />
      <path
        className={styles['cls-2']}
        d="M30.13,20.24a.83.83,0,0,0-.61-.26h-3V16.05l2.31-2.31a.83.83,0,0,0,0-1.21.85.85,0,0,0-1.2,0l-2.32,2.32H14l-2.31-2.32a.86.86,0,0,0-1.21,1.21l2.32,2.31V20h-3a.83.83,0,0,0-.6.26.85.85,0,0,0,0,1.2.83.83,0,0,0,.6.26h3a8.1,8.1,0,0,0,.77,3.66l-2.7,3a.87.87,0,0,0-.21.62.91.91,0,0,0,.28.6.87.87,0,0,0,.57.21.86.86,0,0,0,.65-.28l2.44-2.77.21.19a4.12,4.12,0,0,0,.58.43,7.87,7.87,0,0,0,.88.52,5.73,5.73,0,0,0,1.16.45,5.3,5.3,0,0,0,1.36.18v-12h1.71v12a4.85,4.85,0,0,0,1.3-.18,5.36,5.36,0,0,0,1.1-.39,9.4,9.4,0,0,0,.87-.48c.28-.19.47-.31.56-.39l.2-.17,2.65,2.64a.85.85,0,0,0,1.2,0,.83.83,0,0,0,0-1.21l-2.78-2.79a7.81,7.81,0,0,0,.9-3.88h3a.83.83,0,0,0,.6-.26.84.84,0,0,0,0-1.2Z"
        transform="translate(-0.31 -0.94)"
      />
      <path
        className={styles['cls-2']}
        d="M22.71,10.1a4.3,4.3,0,0,0-6.06,0,4.12,4.12,0,0,0-1.25,3H24A4.16,4.16,0,0,0,22.71,10.1Z"
        transform="translate(-0.31 -0.94)"
      />
    </svg>
  );
}
