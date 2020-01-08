import React, { useState } from 'react';
import Hoverable from '../Hoverable/Hoverable';
import { relativeTime, secsToIsoStr } from '../../../Utils';
import styles from './TimestampDisplay.module.css';


export default function TimestampDisplay({ time, taiToUtc, className, defValue='' }) {
  const [copied, setCopied] = useState(false);
  const copyValue = secsToIsoStr(time);
  const displayValue = time ? relativeTime(time, taiToUtc) : defValue;

  const onClick = () => {
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
  };

  const cleanCopied = () => {
    if (copied) {
      setCopied(false);
    }
  };

  return (
    <Hoverable bottom>
      <div
        className={[className, styles.dataCell].join(' ')}
        onClick={onClick}
        onMouseOut={cleanCopied}
      >
        {displayValue}
      </div>
      <div className={styles.tooltip}>
        {copied ? "Copied!" : copyValue + " (click to copy)"}
      </div>
    </Hoverable>
  );
}
