import React, { memo } from 'react';
import PropTypes from 'prop-types';

import styles from './Input.module.css';

const Input = ({
  defaultValue,
  value,
  type = 'text',
  className = '',
  placeholder,
  checked,
  min,
  max,
  onChange = () => {},
  onClick = () => {},
  ...props
}) => {
  return (
    <input
      defaultValue={defaultValue}
      value={value}
      type={type}
      className={[styles.input, className].join(' ')}
      placeholder={placeholder}
      checked={checked}
      min={min}
      max={max}
      onChange={onChange}
      onClick={onClick}
      {...props}
    />
  );
};

Input.propTypes = {
  /** Default value */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Type */
  type: PropTypes.string,
  /** Class name */
  className: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Checked */
  checked: PropTypes.bool,
  /** Min */
  min: PropTypes.number,
  /** Max */
  max: PropTypes.number,
  /** On change function */
  onChange: PropTypes.func,
  /** On click function */
  onClick: PropTypes.func,
};

export default memo(Input);
