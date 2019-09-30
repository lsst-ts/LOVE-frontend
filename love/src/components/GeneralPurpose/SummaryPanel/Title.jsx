import React from 'react';
import styles from './SummaryPanel.module.css';

const Title = ({children}) => {
  return <span className={styles.title}>{children}</span>;
};

export default Title;
