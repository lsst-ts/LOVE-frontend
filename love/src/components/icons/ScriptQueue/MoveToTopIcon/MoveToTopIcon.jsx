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
import styles from './MoveToTopIcon.module.css';

export default class MoveToTopIcon extends Component {
  render() {
    return (
      <svg viewBox="0 0 21.88 24.27" className={styles.svg}>
        <title>{'Move script to top'}</title>
        <path
          className={styles.st0}
          d="M12.49 4a.76.76 0 00-1.08 0L2.5 12.94a.77.77 0 00-.16.84.78.78 0 00.71.47h8.13v9.12a.76.76 0 00.77.77.76.76 0 00.54-.22.79.79 0 00.23-.55v-9.89a.77.77 0 00-.77-.77h-7l7-7 7 7h-3.49a.77.77 0 100 1.54h5.39a.78.78 0 00.71-.47.77.77 0 00-.16-.84zM2.15 2.26a1 1 0 01-.89-.95.85.85 0 011-.88L21.68.37a.93.93 0 01.07 1.85z"
          transform="translate(-1.01 -.12)"
        />
      </svg>
    );
  }
}
