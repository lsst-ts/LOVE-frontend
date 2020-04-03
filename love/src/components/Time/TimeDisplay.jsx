import React from 'react';
import PropTypes from 'prop-types';
import DigitalClock from '../GeneralPurpose/DigitalClock/DigitalClock';
import styles from './TimeDisplay.module.css';
import * as dayjs from 'dayjs';


TimeDisplay.propTypes = {
  /** Number of seconds to add to a TAI timestamp to convert it in UTC */
  taiToUtc: PropTypes.number,
}

export default function TimeDisplay ({taiToUtc}) {
  const localTime = dayjs();
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <DigitalClockWrapper timestamp={localTime} title='Local Time'/>
        <DigitalClockWrapper timestamp={localTime} title='Sidereal Time'/>
      </div>
      <div className={styles.group}>
        <div className={styles.column}>
          <DigitalClockWrapper timestamp={localTime} title='La Serena'/>
          <DigitalClockWrapper timestamp={localTime} title='Arizona'/>
          <DigitalClockWrapper timestamp={localTime} title='Illinois'/>
        </div>
        <div className={styles.column}>
          <DigitalClockWrapper timestamp={localTime} title='Universal Time (UTC)'/>
          <DigitalClockWrapper timestamp={localTime} title='International Atomic Time (TAI)'/>
          <DigitalClockWrapper timestamp={localTime} title='Modified JD:'/>
        </div>
      </div>
    </div>
  );
}

function DigitalClockWrapper ({timestamp, title}) {
  return (
    <div className={styles.clockWrapper}>
      <div className={styles.title}>
        {title}
      </div>
      <DigitalClock timestamp={timestamp}/>
    </div>
  );
}