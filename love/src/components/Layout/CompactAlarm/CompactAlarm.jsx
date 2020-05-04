import React from 'react';
import styles from './CompactAlarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

export const severityToStatus = {
  0: 'unknown',
  1: 'ok',
  2: 'warning',
  3: 'serious',
  4: 'critical',
};

export default function CompactAlarm({ name, severity, maxSeverity, acknowledged, muted, severityUpdateTimestamp }) {
  const severityStatus = severityToStatus[severity];
  const maxSeverityStatus = severityToStatus[maxSeverity];
  return (
    <div className={styles.alarmContainer}>
      <div className={styles.alarmWrapper}>
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
      </div>
    </div>
  );
}
