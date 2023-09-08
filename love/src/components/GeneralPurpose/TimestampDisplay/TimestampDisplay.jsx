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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Hoverable from '../Hoverable/Hoverable';
import { relativeTime, formatTimestamp, isoTimestamp } from '../../../Utils';
import styles from './TimestampDisplay.module.css';

/**
 * Component that displays a time in relative time, as a timestamp with hover,
 * and allows you to copy the value as ISO string format to the clipboard onclick
 */
TimestampDisplay.propTypes = {
  /** Date-able object or float, if float it must be in milliseconds */
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** Diferrence between TAI and UTC timestamps in seconds */
  taiToUtc: PropTypes.number,
  /** Optional className */
  className: PropTypes.string,
  /** Optional default value when secs is zero */
  defValue: PropTypes.string,
};

export default function TimestampDisplay({ timestamp, taiToUtc, className, defValue = '' }) {
  const [copied, setCopied] = useState(false);
  const hoverValue = formatTimestamp(timestamp);
  const copyValue = isoTimestamp(timestamp);
  const displayValue = timestamp ? relativeTime(timestamp, taiToUtc) : defValue;

  const onClick = () => {
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
  };

  const cleanCopied = () => {
    if (copied) {
      setCopied(false);
    }
  };

  return (
    <Hoverable bottom>
      <div className={[className, styles.dataCell].join(' ')} onClick={onClick} onMouseOut={cleanCopied}>
        {displayValue}
      </div>
      <div className={styles.tooltip}>{copied ? 'Copied!' : hoverValue + ' (click to copy ISO str)'}</div>
    </Hoverable>
  );
}
