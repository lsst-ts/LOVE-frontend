import React from 'react';
import PropTypes from 'prop-types';
import styles from './Clock.module.css';
import AnalogClock from '../../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../../GeneralPurpose/DigitalClock/DigitalClock';
import { DateTime } from 'luxon';
import { parseTimestamp } from '../../../Utils';


/**
 * Component that displays time, date and an analog clock, with options to display only some of those elements.
 */
Clock.propTypes = {
  /** Optional title to display above the clock */
  title: PropTypes.string,
  /** Date-able object or float, if float it must be in milliseconds */
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** Flag to hide or not the analog clock, false by default */
  hideAnalog: PropTypes.bool,
  /** Flag to hide or not the date, false by default */
  hideDate: PropTypes.bool,
  /** Flag to hide or not the UTC offset besides the title, false by default */
  hideOffset: PropTypes.bool,
}

Clock.defaultProps = {
  title: null,
  timestamp: DateTime.local(),
  hideDate: false,
  hideAnalog: false,
  hideOffset: false,
}

export default function Clock ({ timestamp, title, hideDate, hideAnalog, hideOffset }) {
  const t = parseTimestamp(timestamp);
  return (
    <div className={styles.container}>
      { title && (
        <div className={styles.title}>
          { hideOffset ? title : `${title} (${timestamp.offsetNameShort})` }
        </div>
      )}
      <DigitalClock timestamp={timestamp} hideDate={hideDate}/>
      { !hideAnalog && (
        <div className={styles.analog}>
          <AnalogClock timestamp={timestamp}/>
        </div>
      )}
    </div>
  );
}
