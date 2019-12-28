import React from 'react';
import styles from './Input.module.css';

export default function Input({ onChange, className }) {
  return <input type="text" className={[styles.input, className].join(' ')} onChange={onChange} />;
}
