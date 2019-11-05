import React from 'react';
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import AcknowledgeIcon from '../../icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import MutedIcon from '../../icons/Watcher/MutedIcon/MutedIcon';
import SeverityArrowIcon from '../../icons/Watcher/SeverityArrowIcon/SeverityArrowIcon';

export default function Alarm({ severity, increase, decrease, ack, snoozed }) {
  const severityToStatus = {
    0: 'ok',
    1: 'warning',
    2: 'alert',
    3: 'critical',
  };
  const status = severityToStatus[severity];
  return (
    <div className={styles.alarmContainer}>
      <StatusText status={status}>{status}</StatusText>
      <div className={styles.ackContainer}>
        <AcknowledgeIcon active={!ack}></AcknowledgeIcon>
        <SeverityArrowIcon increase={increase} decrease={decrease}></SeverityArrowIcon>
      </div>
      <MutedIcon active={!snoozed}></MutedIcon>
    </div>
  );
}
