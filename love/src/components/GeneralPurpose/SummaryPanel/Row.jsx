import React from 'react';
import styles from './SummaryPanel.module.css';

const Row = ({children}) => {
  return <span className={styles.row}>{children}</span>;
};

export default Row;
