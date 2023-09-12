import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import styles from './DateTimeRange.module.css';

const DateTimeRange = ({
  label = '',
  className,
  startDate,
  endDate,
  startDateProps,
  endDateProps,
  onChange = () => {},
}) => {
  const [dateStart, setDateStart] = useState(startDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000 + 37 * 1000)); // Add 37 seconds to comply with TAI
  const [dateEnd, setDateEnd] = useState(endDate ?? new Date(Date.now() + 37 * 1000)); // Add 37 seconds to comply with TAI

  // Effect used to update startDate and endDate
  // When first pased, the arguments could be undefined
  useEffect(() => {
    onChange(dateStart, 'start');
    onChange(dateEnd, 'end');
  }, []);

  // Effect used to update startDate and endDate
  useEffect(() => {
    if (startDate) {
      setDateStart(startDate);
    }
    if (endDate) {
      setDateEnd(endDate);
    }
  }, [startDate, endDate]);

  const handleChangeStart = useCallback((changeEvent) => {
    setDateStart(changeEvent);
    onChange(changeEvent, 'start');
  }, []);

  const handleChangeEnd = useCallback((changeEvent) => {
    setDateEnd(changeEvent);
    onChange(changeEvent, 'end');
  }, []);

  return (
    <div className={[styles.horizontalFilter, className].join(' ')}>
      {label !== '' && <span className={styles.label}>{label}</span>}
      <DateTime
        inputProps={{ placeholder: 'Initial date' }}
        viewMode="time"
        value={dateStart}
        onChange={handleChangeStart}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
        {...startDateProps}
      />
      <span className={styles.to}>to</span>
      <DateTime
        inputProps={{ placeholder: 'Final date' }}
        viewMode="time"
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
  /** Label to be appended at the beginning of the datetime range component */
  label: PropTypes.string,
  /** Classname of the component */
  className: PropTypes.string,
  /** Date for the datetime range start */
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Date for the datetime range end */
  endtDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Properties to add to the start DateTime component */
  startDateProps: PropTypes.object,
  /** Properties to add to the end DateTime component */
  endDateProps: PropTypes.object,
  /** Function used to change the values of the dateTimeRange */
  onChange: PropTypes.func,
};

const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.className === nextProps.className &&
    Moment(prevProps.startDate).isSame(nextProps.startDate) &&
    Moment(prevProps.endDate).isSame(nextProps.endDate)
  );
};

export default memo(DateTimeRange, arePropsEqual);
