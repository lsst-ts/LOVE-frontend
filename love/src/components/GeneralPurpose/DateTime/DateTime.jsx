import React, { memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Datetime from 'react-datetime';
import Moment from 'moment';
import styles from './DateTime.module.css';

/**
 * A react-datetime with LOVE styles.
 * It passes down props directly to the Datetime object.
 */
const DateTime = (props) => {
  const { label = '', inputProps, minDate, maxDate, className: inputClassName, ...otherProps } = props;
  return (
    <>
      {label !== '' && <span className={styles.label}>{label}</span>}
      <Datetime
        utc={true}
        inputProps={{
          className: [styles.date, inputClassName].join(' '),
          ...props.inputProps,
        }}
        isValidDate={(currentDate) => {
          if (!minDate && !maxDate) {
            return true;
          }

          if (minDate && !maxDate) {
            return currentDate.isAfter(minDate);
          }

          if (maxDate && !minDate) {
            return currentDate.isBefore(maxDate);
          }

          if (maxDate && minDate) {
            return currentDate.isBefore(maxDate) && currentDate.isAfter(minDate);
          }
        }}
        {...otherProps}
      />
    </>
  );
};

DateTime.propTypes = {
  /** Label to add at the beginning of the datetime picker */
  label: PropTypes.string,
  /** Classname of the component */
  className: PropTypes.string,
  /** Properties to add to the input */
  inputProps: PropTypes.object,
  /** Minimum date allowed */
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Maximum date allowed */
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
};

const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.className === nextProps.className &&
    isEqual(prevProps.inputProps, nextProps.inputProps) &&
    Moment(prevProps.minDate).isSame(nextProps.minDate) &&
    Moment(prevProps.maxDate).isSame(nextProps.maxDate)
  );
};

export default memo(DateTime, arePropsEqual);
