import React from 'react';
import styles from './Input.module.css';

export default function Input({ defaultValue, onChange, className }) {
  return <input type="text" className={[styles.input, className].join(' ')} defaultValue={defaultValue} onChange={onChange} />;
}
