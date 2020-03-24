import React from 'react';
import styles from './DashedBox.module.css';

const DashedBox = () => {
  return (
    <>
      <svg className={styles.svg} viewBox="0 0 300 100" preserveAspectRatio="none">
        <path className={styles.path} d="M0,0 300,0 300,100 0,100z" vector-effect="non-scaling-stroke" />
      </svg>
    </>
  );
};

export default DashedBox;
