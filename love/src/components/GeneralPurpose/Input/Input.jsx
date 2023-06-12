import React from 'react';
import styles from './Input.module.css';

const Input = ({
  defaultValue,
  value,
  onChange = () => {},
  onClick = () => {},
  className = '',
  type = 'text',
  min,
  max,
  ...props
}) => {
  return (
    <input
      type={type}
      className={[styles.input, className].join(' ')}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      onClick={onClick}
      min={min}
      max={max}
      {...props}
    />
  );
};

const comparator = (prevProps, nextProps) => {
  return (
      nextProps.value === prevProps.value && 
      nextProps.defaultValue === prevProps.defaultValue &&
      nextProps.min === prevProps.min && 
      nextProps.max === prevProps.max && 
      nextProps.className === prevProps.className
    );
};

export default React.memo(Input, comparator);
