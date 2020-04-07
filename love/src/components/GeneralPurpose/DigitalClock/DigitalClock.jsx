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
  /** Flag to display or not the date, true by default */
  showDate: PropTypes.bool,
}

DigitalClock.defaultProps = {
  timestamp: DateTime.local(),
  showDate: true,
}

export default function DigitalClock ({ timestamp, showDate }) {
  const t = parseTimestamp(timestamp);
  return (
    <div className={styles.container}> 
      <div className={styles.time}> 
        { t.toFormat('HH:mm:ss') }
      </div>
     { showDate && (<div className={styles.date}> 
        { t.toFormat('EEE, MMM dd yyyy') }
      </div>)}
    </div>
  );
}
