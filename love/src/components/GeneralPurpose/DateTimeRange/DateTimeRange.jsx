import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DATE_TIME_FORMAT } from 'Config';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import styles from './DateTimeRange.module.css';

const DateTimeRange = ({
  className,
  startDate,
  endDate,
  startDateProps,
  endDateProps,
  label = '',
  onChange = () => {},
}) => {
  const [dateStart, setDateStart] = useState(startDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [dateEnd, setDateEnd] = useState(endDate ?? new Date(Date.now() + 37 * 1000)); // Add 37 seconds to comply with TAI

  useEffect(() => {
    onChange(dateStart, 'start');
    onChange(dateEnd, 'end');
  }, [startDate, endDate]);

  const handleChangeStart = (changeEvent) => {
    setDateStart(changeEvent);
    onChange(changeEvent, 'start');
  };

  const handleChangeEnd = (changeEvent) => {
    setDateEnd(changeEvent);
    onChange(changeEvent, 'end');
  };

  return (
    <div className={[styles.horizontalFilter, className].join(' ')}>
      {label !== '' && <span className={styles.label}>{label}</span>}
      <DateTime
        viewMode="time"
        inputProps={{ placeholder: 'Initial date' }}
        value={dateStart}
        onChange={handleChangeStart}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
        {...startDateProps}
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
        {...endDateProps}
      />
    </div>
  );
};

DateTimeRange.propTypes = {
  /** Classname of the component */
  className: PropTypes.string,
  /** Date for the datetime range start */
  startDate: PropTypes.instanceOf(Date),
  /** Date for the datetime range end */
  endtDate: PropTypes.instanceOf(Date),
  /** Properties to add to the start DateTime component */
  startDateProps: PropTypes.object,
  /** Properties to add to the end DateTime component */
  endDateProps: PropTypes.object,
  /** Label to be appended at the beginning of the datetime range component */
  label: PropTypes.string,
  /** Function used to change the values of the dateTimeRange */
  onChange: PropTypes.func,
};

export default DateTimeRange;
