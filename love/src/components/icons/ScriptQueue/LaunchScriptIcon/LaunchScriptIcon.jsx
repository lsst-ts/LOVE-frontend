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
import styles from './LaunchScriptIcon.module.css';

export default class LaunchScriptIcon extends Component {
  static defaultProps = {
    style: '',
    title: '',
  };

  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.53 38.08" className={styles.svg}>
        <title>{this.props.title}</title>
        <path
          className={styles['cls-1']}
          d="M8.06.35H21.52l7.83,7.83V27.79a2.1,2.1,0,0,1-2.09,2.09H8.06A2.1,2.1,0,0,1,6,27.79V2.44A2.1,2.1,0,0,1,8.06.35Z"
          transform="translate(-5.97 -0.35)"
        />
        <path
          className={styles['cls-2']}
          d="M15,13.39,12,15l3,1.58V18.5c-2.31-1.16-5.26-2.74-5.27-2.75V14.2s3-1.58,5.27-2.75v1.94Z"
          transform="translate(-5.97 -0.35)"
        />
        <path
          className={styles['cls-2']}
          d="M20.3,13.39l3,1.59-3,1.58V18.5c2.31-1.16,5.26-2.74,5.27-2.75V14.2s-3-1.58-5.27-2.75v1.94Z"
          transform="translate(-5.97 -0.35)"
        />
        <polygon
          className={styles['cls-2']}
          points="14.08 10.13 11.17 19.12 9.31 19.12 12.21 10.13 14.08 10.13 14.08 10.13"
        />
        <path
          className={styles['cls-3']}
          d="M32.85,29.66,21.54,37.18A1.47,1.47,0,0,1,19.26,36V20.91a1.47,1.47,0,0,1,2.28-1.21l11.31,7.53A1.47,1.47,0,0,1,32.85,29.66Z"
          transform="translate(-5.97 -0.35)"
        />
      </svg>
    );
  }
}
