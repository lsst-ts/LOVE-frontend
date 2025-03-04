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
import styles from './DebugIcon.module.css';

function DebugIcon(props) {
  return (
    <svg viewBox="0 0 48.27 55.46" {...props}>
      <path
        d="M12.05 2.16l5.15 8.78a9.07 9.07 0 00-1.55 5.17 20.79 20.79 0 018.59-1.9 21.41 21.41 0 018.59 1.9v-.17a8.59 8.59 0 00-1.54-5l5.15-8.78L33.52.44l-4.81 8.09a7.92 7.92 0 00-4.47-1.2 9.56 9.56 0 00-4.46 1.2L15 .44z"
        className={styles['cls-1']}
        transform="translate(-.02 -.44)"
      ></path>
      <path
        d="M48.29 43.5v-8.79c-6.35-3.27-4.81-2.41-7.38-3.79a14.39 14.39 0 00-1.72-4.48c1.89-1 .51-.34 7.21-3.61v-8.62H43v6.55c-5 2.58-3.78 1.89-5.84 2.93a16.81 16.81 0 00-13.06-6 17.37 17.37 0 00-13 6L9.64 23l-4.29-2.07v-6.72H1.91V23l5.67 2.93 1.55.69a19.51 19.51 0 00-1.72 4.48C5 32.3 6.38 31.61 0 34.88v8.79h3.46v-6.55l3.43-1.72a15.73 15.73 0 002.92 9.3c-1.54.86-.68.35-4.64 2.41v8.79h3.44v-6.55c2.23-1.2 1.55-.69 3.44-1.72a17 17 0 0024.05 0c1.89 1 1.2.52 3.43 1.72v6.55H43v-8.79c-3.61-1.89-2.75-1.37-4.64-2.41a17.46 17.46 0 002.92-9.3l3.44 1.72v6.55h3.6z"
        className={styles['cls-1']}
        transform="translate(-.02 -.44)"
      ></path>
    </svg>
  );
}

export default DebugIcon;
