import React from 'react';
import Datetime from 'react-datetime';
import styles from './DateTime.module.css';

/**
 * A react-datetime with LOVE styles.
 * It passes down props directly to the Datetime object.
 * @param {object} props
 */
const DateTime = (props) => {
  const { inputProps, ...otherProps } = props;
  return (
    <Datetime
      inputProps={{
        className: [styles.date, props.className].join(' '),
        ...props.inputProps,
      }}
      {...otherProps}
    />
  );
};
DateTime.defaultProps = {
  inputProps: {},
};

export default DateTime;
