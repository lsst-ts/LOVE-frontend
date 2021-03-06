import React, { useState } from 'react';
import styles from './TextArea.module.css';

export default function TextArea({ callback, ...otherProps }) {
  const [content, setContent] = useState('');

  const onChange = (e) => {
    setContent(e.target.value);
    callback(e.target.value);
  };
  return <textarea className={styles.textarea} onChange={onChange} value={content} {...otherProps}></textarea>;
}
