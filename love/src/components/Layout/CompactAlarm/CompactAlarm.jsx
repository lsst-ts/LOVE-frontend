import React, { useState } from 'react';
import styles from './CompactAlarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

export const severityToStatus = {
  0: 'unknown',
  1: 'ok',
  2: 'warning',
  3: 'serious',
  4: 'critical',
};

export default function CompactAlarm({
  name,
  severity,
  maxSeverity,
  acknowledged,
  muted,
  reason,
  severityUpdateTimestamp,
}) {
  const severityStatus = severityToStatus[severity];
  const maxSeverityStatus = severityToStatus[maxSeverity];
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.alarmContainer}>
      <div
        className={styles.alarmWrapper}
        onClick={(event) => {
          setExpanded(!expanded);
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
        }}
      >
        <span className={styles.name}>{name}</span>
        <span className={styles.labelWrapper}>
          <span className={styles.label}>SEVERITY: </span>
        </span>
        <div className={styles.statusContainer}>
          <StatusText status={severityStatus}>{severityStatus}</StatusText>
        </div>
        <span className={styles.timestampContainer}>
          <span className={styles.label}>Updated: </span>
          <span className={styles.timestamp}>{severityUpdateTimestamp}</span>
        </span>
        <span className={styles.labelWrapper}>
          <span className={styles.label}>MAX SEVERITY: </span>
        </span>
        <div className={styles.statusContainer}>
          <StatusText status={maxSeverityStatus}>{maxSeverityStatus}</StatusText>
        </div>
        <div className={[styles.separator, expanded ? '' : styles.hidden].join(' ')}></div>
      </div>
      <div
        className={[styles.expandedAlarm, expanded ? '' : styles.hidden].join(' ')}
        onClick={(event) => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
        }}
      >
        <span className={styles.label}>Reason:</span>
        <div className={styles.reason}>
          {reason}
          dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa
          dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa
          dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa
          dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa
          dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa
          dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa dsadsa
        </div>
      </div>
    </div>
  );
}
