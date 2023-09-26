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
import styles from './TerminateIcon.module.css';

export default class TerminateIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" className={styles.svg}>
        <title>{'Terminate script'}</title>
        <path
          className={styles['cls-1']}
          d="M19.29.44a19,19,0,1,0,19,19A19,19,0,0,0,19.29.44ZM29.37,27.13,27,29.52a.82.82,0,0,1-1.16,0l-5.94-5.95a.83.83,0,0,0-1.17,0l-5.94,5.95a.83.83,0,0,1-1.17,0L9.21,27.13a.83.83,0,0,1,0-1.17L15.16,20a.83.83,0,0,0,0-1.17L9.21,12.91a.82.82,0,0,1,0-1.16l2.39-2.4a.83.83,0,0,1,1.17,0l5.94,6a.83.83,0,0,0,1.17,0l5.94-6a.82.82,0,0,1,1.16,0l2.39,2.4a.8.8,0,0,1,0,1.16l-5.94,5.94a.83.83,0,0,0,0,1.17L29.37,26A.82.82,0,0,1,29.37,27.13Z"
          transform="translate(-0.29 -0.44)"
        />
      </svg>
    );
  }
}
