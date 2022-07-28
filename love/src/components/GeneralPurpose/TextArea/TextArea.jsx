import React, { useEffect, useState } from 'react';
import styles from './TextArea.module.css';

export default function TextArea({ value, callback, ...otherProps }) {
  const [content, setContent] = useState(value ?? '');

  useEffect(() => {
    setContent(value ?? '');
  }, [value]);

  const onChange = (e) => {
    setContent(e.target.value);
    callback(e.target.value);
  };

  return <textarea className={styles.textarea} onChange={onChange} value={content} {...otherProps}></textarea>;
}
