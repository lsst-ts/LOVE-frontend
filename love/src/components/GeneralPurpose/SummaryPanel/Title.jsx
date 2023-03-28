import React from 'react';
import styles from './SummaryPanel.module.css';

const Title = ({ wide, children }) => {

  return wide ? (
    <>
      <span className={styles.title+' '+styles.col2}>{children}</span>
    </>
  ) : (
    <span className={styles.title}>{children}</span>
  );
};

export default Title;
