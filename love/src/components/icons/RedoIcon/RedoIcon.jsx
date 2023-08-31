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
import styles from './RedoIcon.module.css';

function RedoIcon(props) {
  return (
    <svg viewBox="0 0 46.36 49.01" {...props}>
      <path
        d="M.53 26.81a20.71 20.71 0 0020.52 23.41h13.5a1.72 1.72 0 001.7-1.71v-5.3a1.72 1.72 0 00-1.7-1.71H20.94A12 12 0 019.19 27a12.24 12.24 0 0112.11-9.52h6.29v5.88a1.7 1.7 0 002.63 1.39l15.72-10.2a1.69 1.69 0 000-2.84L30.22 1.5a1.69 1.69 0 00-2.63 1.4v5.87h-5.87C11.2 8.77 1.82 16.35.53 26.81z"
        className={styles['cls-1']}
        transform="translate(-.36 -1.21)"
      ></path>
    </svg>
  );
}

export default RedoIcon;
