import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import styles from './DateTime.module.css';

/**
 * A react-datetime with LOVE styles.
 * It passes down props directly to the Datetime object.
 * @param {object} props
 */
const DateTime = (props) => {
  const { inputProps, minDate, maxDate, ...otherProps } = props;
  return (
    <>
      {props.label !== '' && <span className={styles.label}>{props.label}</span>}
      <Datetime
        utc={true}
        inputProps={{
          className: [styles.date, props.className].join(' '),
          ...props.inputProps,
        }}
        isValidDate={(currentDate) => {
          if (!minDate && !maxDate) {
            return true;
          }

          if (minDate && !maxDate) {
            return currentDate.isAfter(moment(minDate));
          }

          if (maxDate && !minDate) {
            return currentDate.isBefore(moment(maxDate));
          }

          if (maxDate && minDate) {
            return currentDate.isBefore(moment(maxDate)) && currentDate.isAfter(moment(minDate));
          }
        }}
        {...otherProps}
      />
    </>
  );
};
DateTime.defaultProps = {
  inputProps: {},
};

export default DateTime;
