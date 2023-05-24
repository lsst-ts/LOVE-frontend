import React from 'react';
import styles from './SummaryPanel.module.css';

const Label = ({ wide, children }) => {
  return wide ? (
    <>
      <span className={`${styles.label} ${styles.col2}`}>{children}</span>
    </>
  ) : (
    <span className={styles.label}>{children}</span>
  );
};

export default Label;
