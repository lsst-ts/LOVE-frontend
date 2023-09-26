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

import React, { Component } from 'react';
import styles from './MoveToBottomIcon.module.css';

export default class MoveToBottomIcon extends Component {
  render() {
    return (
      <svg viewBox="0 0 21.88 24.27" className={styles.svg}>
        <title>{'Move script to bottom'}</title>
        <path
          className={styles.st0}
          d="M11.41 20.48a.76.76 0 001.08 0l8.91-8.91a.77.77 0 00.16-.84.78.78 0 00-.71-.47h-8.13V1.14A.76.76 0 0012 .37a.8.8 0 00-.54.22.79.79 0 00-.23.55V11a.77.77 0 00.77.77h7l-7 7-7-7h3.44a.77.77 0 000-1.54H3.05a.78.78 0 00-.71.47.77.77 0 00.16.84zM21.75 22.25a1 1 0 01.89.95.85.85 0 01-1 .88l-19.46.06a.93.93 0 01-.07-1.85z"
          transform="translate(-1.01 -.12)"
        />
      </svg>
    );
  }
}
