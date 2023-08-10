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
import styles from './UndoIcon.module.css';

function UndoIcon(props) {
  return (
    <svg viewBox="0 0 46.36 49.01" {...props}>
      <path
        d="M46.55 26.81A20.72 20.72 0 0126 50.22H12.53a1.73 1.73 0 01-1.71-1.71v-5.3a1.73 1.73 0 011.71-1.71h13.6A12 12 0 0037.89 27a12.26 12.26 0 00-12.12-9.49h-6.29v5.88a1.69 1.69 0 01-2.62 1.39L1.13 14.55a1.69 1.69 0 010-2.84L16.86 1.5a1.68 1.68 0 012.62 1.4v5.87h5.88c10.52 0 19.9 7.58 21.19 18.04z"
        className={styles['cls-1']}
        transform="translate(-.36 -1.21)"
      ></path>
    </svg>
  );
}

export default UndoIcon;
