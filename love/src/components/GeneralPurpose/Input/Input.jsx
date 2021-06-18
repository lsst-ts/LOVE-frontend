import React from 'react';
import styles from './Input.module.css';

const labelStyle = {
  display: "block",
  marginBottom: 4,
}

export default function Input({ defaultValue, value, onChange, className, label, ...props }) {
  return label ? (
    <label>
      <span style={labelStyle}>{label}</span>
      <input
        type="text"
        className={[styles.input, className].join(' ')}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        {...props}
      />
    </label>
  ) : (
      <input
        type="text"
        className={[styles.input, className].join(' ')}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        {...props}
      />
  );
}
