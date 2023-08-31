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
import styles from './ViewIcon.module.css';

function ViewIcon(props) {
  const { selected } = props;
  const colorClass = !selected ? styles.clsView1 : styles.clsView1Sel;
  return (
    <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.9 13.28">
      <path
        className={colorClass}
        d="m11.45,0h0C5.14,0,0,4.98,0,6.64s5.14,6.47,11.45,6.64h0c6.31,0,11.45-4.98,11.45-6.64S17.76,0,11.45,0Zm0,10.45c-2.16,0-3.98-1.66-3.98-3.98,0-2.16,1.66-3.98,3.98-3.98s3.98,1.66,3.98,3.98c-.17,2.32-1.83,3.98-3.98,3.98Z"
      />
      <circle className={colorClass} cx="11.45" cy="6.64" r="1.99" />
    </svg>
  );
}

export default ViewIcon;
