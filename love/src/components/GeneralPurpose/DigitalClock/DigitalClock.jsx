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

import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './DigitalClock.module.css';
import { parseTimestamp } from '../../../Utils';

/**
 * Component that displays time and optionally the date below
 */
const DigitalClock = memo(function DigitalClock({ timestamp, hideDate }) {
  const t = timestamp === 0 ? 0 : parseTimestamp(timestamp);
  return (
    <div className={styles.container}>
      <div className={styles.time}>{t ? t.toFormat('HH:mm:ss') : '--:--:--'}</div>
      {!hideDate && <div className={styles.date}>{t ? t.toFormat('EEE, MMM dd yyyy') : '---'}</div>}
    </div>
  );
});

DigitalClock.propTypes = {
  /** Date-able object or float, if float it must be in milliseconds */
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** Flag to hide or not the date, false by default */
  hideDate: PropTypes.bool,
};

export default DigitalClock;
