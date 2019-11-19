import React from 'react';
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import Button from '../../GeneralPurpose/Button/Button';
import SeverityArrowIcon from '../../icons/Watcher/SeverityArrowIcon/SeverityArrowIcon';

export const severityToStatus = {
  0: 'unkown',
  1: 'ok',
  2: 'warning',
  3: 'alert',
  4: 'critical',
};

export default function Alarm({ severity, maxSeverity, statusOnly, acknowledged, muted, ackAlarm }) {
  const status = severityToStatus[severity];
  let change = '';
  if (acknowledged) {
    change = 'clear';
  } else if (severity < maxSeverity) {
    change = 'increase';
  } else if (severity > maxSeverity) {
    change = 'decrease';
  } else if (severity === maxSeverity) {
    change = 'static';
  }
  return (
    <div className={[styles.alarmContainer, statusOnly ? styles.statusOnly : ''].join(' ')}>
      <div className={styles.statusContainer}>
        <StatusText status={status}>{status}</StatusText>
        <span>
          <SeverityArrowIcon change={change}></SeverityArrowIcon>
        </span>
      </div>
      {statusOnly ? null : (
        <Button
          title="ack"
          status="info"
          size="small"
          disabled={acknowledged}
          onClick={(event) => {
            ackAlarm(event);
          }}
        >
          {' '}
          ACK{' '}
        </Button>
      )}
    </div>
  );
}
