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
import PropTypes from 'prop-types';
import styles from './Dome.module.css';

export default class MountTopView extends Component {
  static propTypes = {
    /** Coordinates of current pointing */
    currentPointing: PropTypes.object,
  };

  render() {
    const az = this.props.currentPointing.az;

    return (
      <svg
        x="0px"
        y="0px"
        viewBox="0 0 211.1 65.2"
        className={[styles.svgOverlay]}
        style={{
          width: '33%',
          transform: `translate(-50%, -50%) rotateZ(${az}deg)`,
          transition: 'transform 1.5s linear',
        }}
      >
        <g className={styles.mountTop}>
          <polygon points="160.1,21.9 209.4,21.9 209.7,43.8 160.4,43.8 	" />
          <polygon points="162.7,19 185,19 185.3,46.8 163.1,46.8 	" />
          <polygon points="50.9,43.3 1.7,43.3 1.4,21.4 50.6,21.4 	" />
          <polygon points="48.3,46.2 26.1,46.2 25.7,18.4 48,18.4 	" />
          <polygon points="36.9,1.2 173.3,1.2 174.2,64 37.8,64 	" />
        </g>
      </svg>
    );
  }
}
