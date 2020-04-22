import React from 'react';
import styles from './SummaryPanel.module.css';

const Label = ({children}) => {
  return <span className={styles.label}>{children}</span>;
};

export default Label;
