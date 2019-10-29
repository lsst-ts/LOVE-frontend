import React from 'react';
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

export default function Alarm({ severity, ack, snoozed }) {
  const severityToStatus = {
    ok: 'ok',
    warning: 'warning',
    serious: 'alert',
    critical: 'critical',
  };
  const status = severityToStatus[severity];
  return (
    <div className={styles.alarmContainer}>
      <StatusText status={status}>{status}</StatusText>
      <span>{ack ? "ACK":"NACK"}</span>
      <span>{snoozed ? "SNO":"NSNO"}</span>
    </div>
  );
}
