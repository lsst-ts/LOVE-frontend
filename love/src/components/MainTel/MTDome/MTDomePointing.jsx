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
import styles from './MTDome.module.css';

export default class MTDomePointing extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Target mount azimuth at the specified time. The allowed range is 0 to 360 */
    targetPointingAz: PropTypes.object,
    /** Target mount elevation at the specified time */
    targetPointingEl: PropTypes.object,
  };

  static defaultProps = {
    targetPointingAz: {},
    targetPointingEl: {},
    currentPointing: {
      el: 90,
      az: 0,
    },
    azelToPixel: () => {},
    width: 300,
    height: 300,
    isProjected: true,
  };

  /** Function to convert az/el to pixels */
  azelToPixel = (pos, isProjected) => {
    const { az, el } = pos;
    const width = 300;
    const height = 300;
    const offset = 20;
    const center = [width / 2, height / 2];
    let r;
    if (isProjected) {
      r = Math.cos((el * Math.PI) / 180) * (width / 2 - offset);
    } else {
      r = ((90 - el) / 90) * (width / 2 - offset);
    }
    const x = center[0] + r * Math.sin((az * Math.PI) / 180);
    const y = center[1] - r * Math.cos((az * Math.PI) / 180);
    return {
      x,
      y,
    };
  };

  render() {
    const { width, height } = this.props;
    const zenithPixels = this.azelToPixel({ az: 0, el: 90 }, false);
    const { currentPointing, targetPointing } = this.props;

    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 300 300">
        {/* pointing */}
        {(targetPointing?.az !== currentPointing?.az || targetPointing?.el !== currentPointing?.el) && (
          <g
            className={styles.pointing}
            style={{
              transform: `rotateZ(${targetPointing?.az}deg)`,
              transformOrigin: `50% 50%`,
            }}
          >
            <circle
              className={styles.targetPointing}
              r={16}
              strokeWidth={2}
              cx={zenithPixels.x}
              cy={zenithPixels.y}
              style={{
                transform: `rotateX(${targetPointing?.el - 90}deg)`,
              }}
            />
          </g>
        )}

        <g
          style={{
            transform: `rotateZ(${currentPointing?.az}deg)`,
            transformOrigin: `50% 50%`,
          }}
        >
          <circle
            className={styles.currentPointing}
            r={16}
            strokeWidth={2}
            cx={zenithPixels.x}
            cy={zenithPixels.y}
            style={{
              transform: `rotateX(${currentPointing?.el - 90}deg)`,
            }}
          />
        </g>
      </svg>
    );
  }
}
