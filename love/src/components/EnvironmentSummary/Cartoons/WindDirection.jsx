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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import { MAX_WIND_SPEED_MS } from 'Config';
import { defaultNumberFormatter } from 'Utils';
import styles from './WindDirection.module.css';

function WindDirection({
  windDirection,
  windSpeed,
  maxWindSpeed = MAX_WIND_SPEED_MS,
  showValues = false,
  subscribeToStreams = () => {},
  unsubscribeToStreams = () => {},
}) {
  const arrowHeight = (windSpeed / maxWindSpeed) * 100;

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  return (
    <div className={styles.container}>
      {showValues && (
        <div className={styles.values}>
          <div>
            <span className={styles.label}>Wind Direction:</span>
            <span className={styles.value}>{defaultNumberFormatter(windDirection, 2)}°</span>
          </div>
          <div>
            <span className={styles.label}>Wind Speed:</span>
            <span className={styles.value}>{defaultNumberFormatter(windSpeed, 2)} m/s</span>
          </div>
        </div>
      )}
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
          transform={`rotate(${windDirection + 180})`}
        >
          <ArrowIcon up={true} />
        </foreignObject>
      </svg>
    </div>
  );
}

WindDirection.propTypes = {
  /** Wind direction in degrees, 0 is coming from North,
   * 90 is coming from East, 180 is coming from South,
   * 270 is coming from West */
  windDirection: PropTypes.number.isRequired,
  /** Wind speed in m/s */
  windSpeed: PropTypes.number.isRequired,
  /** Maximum wind speed in m/s */
  maxWindSpeed: PropTypes.number,
  /** Show wind direction and speed values */
  showValues: PropTypes.bool,
  /** Function to subscribe to data streams */
  subscribeToStreams: PropTypes.func,
  /** Function to unsubscribe from data streams */
  unsubscribeToStreams: PropTypes.func,
};

export default WindDirection;
