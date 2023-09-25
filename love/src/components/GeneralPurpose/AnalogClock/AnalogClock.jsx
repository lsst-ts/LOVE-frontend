/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './AnalogClock.module.css';
import { DateTime } from 'luxon';
import { parseTimestamp } from '../../../Utils';

/**
 * Component that displays time and optionally the date below
 */
AnalogClock.propTypes = {
  /** Date-able object or float, if float it must be in milliseconds */
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

AnalogClock.defaultProps = {
  timestamp: DateTime.local(),
  showDate: true,
};

const renderMarkers = () => {
  const markers = [];
  const deltaAngle = 6;
  const shortLength = 1;
  const longLength = 1.5;
  for (let i = 0; i < 60; i++) {
    markers.push(
      <line
        key={i}
        x1={19 - (i % 5 ? shortLength : longLength)}
        y1="0"
        x2="19"
        y2="0"
        transform={`rotate(${deltaAngle * i}, 0, 0)`}
        className={i % 5 ? null : styles.strongMarker}
      />,
    );
  }
  markers.push(
    <text key="hour-0" className={styles.number} transform={`translate(-2, -13.5)`}>
      {' '}
      12{' '}
    </text>,
  );
  markers.push(
    <text key="hour-3" className={styles.number} transform={`translate(14.5, 1.5)`}>
      {' '}
      3{' '}
    </text>,
  );
  markers.push(
    <text key="hour-9" className={styles.number} transform={`translate(-1, 16.5)`}>
      {' '}
      6{' '}
    </text>,
  );
  markers.push(
    <text key="hour-6" className={styles.number} transform={`translate(-16.5, 1.5)`}>
      {' '}
      9{' '}
    </text>,
  );
  return markers;
};

export default function AnalogClock({ timestamp }) {
  const t = parseTimestamp(timestamp);
  const markers = renderMarkers();
  const second = t.second;
  const minute = t.minute + second / 60;
  const hour = (t.hour % 12) + minute / 60;
  return (
    <svg viewBox="0 0 40 40" className={styles.clock}>
      <circle className={styles.background} cx="20" cy="20" r="19" />
      <circle className={styles.center} cx="20" cy="20" r="0.7" />

      <g className={styles.marks}>
        {markers}
        <text key="hour-0" className={styles.number} transform={`translate(-2, -13.5)`}>
          {' '}
          12{' '}
        </text>
        <text key="hour-3" className={styles.number} transform={`translate(14.5, 1.5)`}>
          {' '}
          3{' '}
        </text>
        <text key="hour-9" className={styles.number} transform={`translate(-1, 16.5)`}>
          {' '}
          6{' '}
        </text>
        <text key="hour-6" className={styles.number} transform={`translate(-16.5, 1.5)`}>
          {' '}
          9{' '}
        </text>

        <line x1="0" y1="0" x2="9" y2="0" className={styles.hour} transform={`rotate(${30 * hour - 90}, 0, 0)`} />
        <line x1="0" y1="0" x2="12" y2="0" className={styles.minute} transform={`rotate(${6 * minute - 90}, 0, 0)`} />
        <line x1="-3" y1="0" x2="14" y2="0" className={styles.second} transform={`rotate(${6 * second - 90}, 0, 0)`} />
      </g>
    </svg>
  );
}
