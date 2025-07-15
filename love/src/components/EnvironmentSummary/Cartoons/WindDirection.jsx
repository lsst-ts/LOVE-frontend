/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import styles from './WindDirection.module.css';

export class WindDirection extends Component {
  render() {
    const { windSpeedPercent, windDirection } = this.props;
    const arrowHeight = windSpeedPercent * 100;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`-50 -50 100 100`}>
        <circle cx={0} cy={0} r={50} className={styles.windroseBackground} />
        <text x={0} y={-50} textAnchor="middle" alignmentBaseline="hanging" className={styles.cardinalPoints}>
          {'N'}
        </text>
        <text x={0} y={50} textAnchor="middle" alignmentBaseline="baseline" className={styles.cardinalPoints}>
          {'S'}
        </text>
        <text x={-50} y={0} textAnchor="start" alignmentBaseline="middle" className={styles.cardinalPoints}>
          {'W'}
        </text>
        <text x={50} y={0} textAnchor="end" alignmentBaseline="middle" className={styles.cardinalPoints}>
          {'E'}
        </text>

        <foreignObject
          height={arrowHeight}
          width={arrowHeight}
          x={-arrowHeight / 2}
          y={-arrowHeight / 2}
          className={styles.arrowIconContainer}
          transform={`rotate(${windDirection})`}
        >
          <ArrowIcon up={true} />
        </foreignObject>
      </svg>
    );
  }
}

WindDirection.propTypes = {
  /** Percentage of wind speed, from 0 to 1 */
  windSpeedPercent: PropTypes.number.isRequired,
  /** Wind direction in degrees, 0 is North, 90 is East, 180 is South, 270 is West */
  windDirection: PropTypes.number.isRequired,
};

export default WindDirection;
