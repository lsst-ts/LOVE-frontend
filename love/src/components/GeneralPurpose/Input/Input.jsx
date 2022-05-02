import React from 'react';
import styles from './Input.module.css';

export default function Input({ defaultValue, value, onChange, onClick, className, type, ...props }) {
  return (
    <input
      type={type}
      className={[styles.input, className].join(' ')}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      onClick={onClick}
      {...props}
    />
  );
}

Input.defaultProps = {
  type: 'text',
  onChange: () => {},
  onClick: () => {},
};
