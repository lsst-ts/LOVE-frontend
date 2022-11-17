import React, { useState, useEffect } from 'react';
import { DATE_TIME_FORMAT } from 'Config';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import styles from './DateTimeRange.module.css';

const DateTimeRange = (props) => {
  const [dateStart, setDateStart] = useState(props.startDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [dateEnd, setDateEnd] = useState(props.endDate ?? new Date(Date.now() + 37 * 1000)); // Add 37 seconds to comply with TAI

  useEffect(() => {
    props.onChange(dateStart, 'start');
    props.onChange(dateEnd, 'end');
  }, []);

  const handleChangeStart = (changeEvent) => {
    setDateStart(changeEvent);
    props.onChange(changeEvent, 'start');
  };

  const handleChangeEnd = (changeEvent) => {
    setDateEnd(changeEvent);
    props.onChange(changeEvent, 'end');
  };

  return (
    <div className={[styles.horizontalFilter, props.className].join(' ')}>
      {props.label !== '' && <span className={styles.label}>{props.label}</span>}
      <DateTime
        viewMode="time"
        inputProps={{ placeholder: 'Initial date' }}
        value={dateStart}
        onChange={handleChangeStart}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
        {...props.startDateProps}
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
        {...props.endDateProps}
      />
    </div>
  );
};

export default DateTimeRange;
