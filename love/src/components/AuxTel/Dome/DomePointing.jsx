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
import PropTypes from 'prop-types';
import styles from './Dome.module.css';

export default class DomePointing extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Whether the radial distances are projected or equidistant */
    isProjected: PropTypes.bool,
    /** Coordinates of current pointing */
    currentPointing: PropTypes.object,
    /** Coordinates of target pointing */
    targetPointing: PropTypes.object,
  };

  static defaultProps = {
    azelToPixel: () => {},
    width: 596,
    height: 596,
    isProjected: true,
  };

  /** Function to convert az/el to pixels */
  azelToPixel = (pos, isProjected) => {
    const { az, el } = pos;
    const width = 596;
    const height = 596;
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
    const el = this.props.currentPointing.el;
    const az = this.props.currentPointing.az;

    const posTranslate = Math.sin(((el - 90) * Math.PI) / 180) * (298 - 30);

    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 596 596">
        {this.props.targetPointing.az !== az && this.props.targetPointing.el !== el && (
          <circle
            className={styles.targetPointing}
            r={16}
            strokeWidth={2}
            cx={zenithPixels.x}
            cy={zenithPixels.y}
            style={{
              transform: `rotateZ(${this.props.targetPointing.az}deg) translate(0px, ${posTranslate}px) rotateX(${
                this.props.targetPointing.el - 90
              }deg)`,
              transformOrigin: '50% 50%',
            }}
          />
        )}

        <circle
          className={styles.currentPointing}
          r={16}
          strokeWidth={2}
          cx={zenithPixels.x}
          cy={zenithPixels.y}
          style={{
            transform: `rotateZ(${az}deg) translate(0px, ${posTranslate}px) rotateX(${el - 90}deg)`,
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
    );
  }
}
