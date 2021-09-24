import React, { useState } from 'react';
import { DATE_TIME_FORMAT } from 'Config';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import styles from './DateTimeRange.module.css';
import './react-datetime.css';

const DateTimeRange = ({ ...props }) => {
  const [dateStart, setDateStart] = useState(new Date(new Date() - 24 * 60 * 60 * 1000));
  const [dateEnd, setDateEnd] = useState(new Date());

  const handleChangeStart = (changeEvent) => {
    console.log(changeEvent.format(DATE_TIME_FORMAT));
    setDateStart(changeEvent);
  };

  const handleChangeEnd = (changeEvent) => {
    console.log(changeEvent.format(DATE_TIME_FORMAT));
    setDateEnd(changeEvent);
  };

  return (
    <div className={styles.horizontalFilter}>
      {props.label !== '' && <span className={styles.label}>{props.label}</span>}
      <DateTime
        viewMode="time"
        inputProps={{ placeholder: 'Initial date' }}
        value={dateStart}
        onChange={handleChangeStart}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
      />
      <span className={styles.to}>to</span>
      <DateTime
        viewMode="time"
        inputProps={{ placeholder: 'Final date' }}
        value={dateEnd}
        onChange={handleChangeEnd}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
      />
    </div>
  );
};

export default DateTimeRange;
