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

import React, { Component } from 'react';
import styles from './StopIcon.module.css';

export default class StopIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.96 37.96" className={styles.svg}>
        <title>{'Stop script'}</title>
        <path
          className={styles['cls-1']}
          d="M19.12.47a19,19,0,1,0,19,19A19,19,0,0,0,19.12.47Zm9.42,26.29a2.12,2.12,0,0,1-2.11,2.11H11.82a2.12,2.12,0,0,1-2.11-2.11V12.15A2.13,2.13,0,0,1,11.82,10H26.37a2.13,2.13,0,0,1,2.12,2.12V26.76Z"
          transform="translate(-0.14 -0.47)"
        />
      </svg>
    );
  }
}
