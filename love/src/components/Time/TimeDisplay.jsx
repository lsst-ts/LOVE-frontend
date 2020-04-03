import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './TimeDisplay.module.css';


TimeDisplay.propTypes = {
  /** Number of seconds to add to a TAI timestamp to convert it in UTC */
  taiToUtc: PropTypes.number,
}

export default function TimeDisplay (taiToUtc) {
  return (
    <div className={styles.container}> 
      Blahh
    </div>
  );
}
