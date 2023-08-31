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
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import styles from './WindDirection.module.css';

export class WindDirection extends Component {
  render() {
    const { windSpeed, windDirection } = this.props;
    const minSpeed = 0;
    const maxSpeed = 30;
    const currentSpeed = windSpeed;
    const maxArrowHeight = 680;
    const arrowHeight = (currentSpeed / maxSpeed) * maxArrowHeight;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svgContainer}
        viewBox={`-40 -40 ${maxArrowHeight} ${maxArrowHeight}`}
      >
        <defs>
          <radialGradient id="a">
            <stop offset={0} stopColor="#fff" stopOpacity={0} />
            <stop offset={0.7} stopColor="#fff" stopOpacity={0} />
            <stop offset={0.8} stopColor="#fff" stopOpacity={0} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.4} />
          </radialGradient>
          <mask id="b">
            <circle cx={298} cy={298} r={333} fill="url(#a)" />
          </mask>
        </defs>

        <rect width="100%" height="100%" fill="none" className="PolarPlot_backgroundRect__fbFoV" />
        <circle cx={298} cy={298} r={295} className="PolarPlot_backgroundCircle__KlR4Y" />
        <text x={288} y={-10} className={styles.cardinalPoints}>
          {'N'}
        </text>
        <text x={288} y={650} className={styles.cardinalPoints}>
          {'S'}
        </text>
        <text x={-80} y={310} className={styles.cardinalPoints}>
          {'W'}
        </text>
        <text x={620} y={310} className={styles.cardinalPoints}>
          {'E'}
        </text>

        <foreignObject
          height={arrowHeight}
          width={arrowHeight}
          className={styles.arrowIconContainer}
          transform={`translate(${298 - arrowHeight / 2}, ${298 - arrowHeight / 2}) rotate(${windDirection})`}
        >
          <ArrowIcon up={true} style={styles.arrowIcon} />
        </foreignObject>
      </svg>
    );
  }
}

export default WindDirection;
