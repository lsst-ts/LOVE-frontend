import React from 'react';
import styles from './SummaryPanel.module.css';

const Value = ({ children }) => {
  const child = typeof children === 'object' && !React.isValidElement(children) ? JSON.stringify(children) : children;
  return <span className={styles.value}>{child}</span>;
};

export default Value;
