import React from 'react';
import styles from './SummaryPanel.module.css';

const Value = ({children}) => {
  return <span className={styles.value}>{children}</span>;
};

export default Value;
