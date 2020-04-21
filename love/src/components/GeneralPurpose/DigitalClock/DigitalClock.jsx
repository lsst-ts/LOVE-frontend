import React from 'react';
import PropTypes from 'prop-types';
import styles from './DigitalClock.module.css';
import { DateTime } from 'luxon';
import { parseTimestamp } from '../../../Utils';


/**
 * Component that displays time and optionally the date below
 */
DigitalClock.propTypes = {
  /** Date-able object or float, if float it must be in milliseconds */
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** Flag to hide or not the date, false by default */
  hideDate: PropTypes.bool,
}

DigitalClock.defaultProps = {
  timestamp: DateTime.local(),
  hideDate: false,
}

export default function DigitalClock ({ timestamp, hideDate }) {
  const t = parseTimestamp(timestamp);
  return (
    <div className={styles.container}> 
      <div className={styles.time}> 
        { t.toFormat('HH:mm:ss') }
      </div>
     { !hideDate && (
        <div className={styles.date}> 
          { t.toFormat('EEE, MMM dd yyyy') }
        </div>
      )}
    </div>
  );
}
