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

import React, { Component } from 'react';
import styles from './MoveDownIcon.module.css';

export default class MoveDownIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.9 37.9" className={styles.svg}>
        <title>{'Move script down'}</title>
        <path
          className={styles['cls-1']}
          d="M38.2,19.39A19,19,0,1,1,19.25.44,19,19,0,0,1,38.2,19.39ZM12.14,22.55,19,28.94a.62.62,0,0,0,.86.1.94.94,0,0,0,.1-.1l6.84-6.39a.63.63,0,0,0-.09-.87.56.56,0,0,0-.39-.13h-5V10.73a.62.62,0,0,0-.62-.62H18.22a.62.62,0,0,0-.62.62V21.55h-5a.61.61,0,0,0-.62.61A.62.62,0,0,0,12.14,22.55Z"
          transform="translate(-0.29 -0.44)"
        />
      </svg>
    );
  }
}
