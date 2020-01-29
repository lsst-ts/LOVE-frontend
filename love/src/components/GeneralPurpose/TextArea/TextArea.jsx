import React, { useState } from 'react';
import styles from './TextArea.module.css';

export default function TextArea({ callback }) {
  const [content, setContent] = useState('');

  const onChange = (e) => {
    setContent(e.target.value);
    callback(content);
  };
  return <textarea className={styles.textarea} onChange={onChange} value={content}></textarea>;
}
