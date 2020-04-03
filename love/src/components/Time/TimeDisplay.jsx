import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DigitalClock from '../GeneralPurpose/DigitalClock/DigitalClock';
import styles from './TimeDisplay.module.css';
import * as dayjs from 'dayjs'


TimeDisplay.propTypes = {
  /** Number of seconds to add to a TAI timestamp to convert it in UTC */
  taiToUtc: PropTypes.number,
}

export default function TimeDisplay (taiToUtc) {
  const localTime = dayjs();
  return (
    <div className={styles.container}> 
      <DigitalClock timestamp={localTime}/>
    </div>
  );
}
