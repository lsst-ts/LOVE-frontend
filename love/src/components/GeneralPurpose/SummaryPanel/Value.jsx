import React from 'react';
import styles from './SummaryPanel.module.css';

const Value = ({ children }) => {
  let child = children;
  if (typeof children === 'object' && !React.isValidElement(children)) {
    if (children.value !== undefined) child = children.value;
    else child = JSON.stringify(children);
  }
  return <span className={styles.value}>{child}</span>;
};

export default Value;
