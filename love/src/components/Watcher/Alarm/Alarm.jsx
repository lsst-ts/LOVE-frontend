import React from 'react';
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import AcknowledgeIcon from '../../icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import MutedIcon from '../../icons/Watcher/MutedIcon/MutedIcon';
import SeverityArrowIcon from '../../icons/Watcher/SeverityArrowIcon/SeverityArrowIcon';

export const severityToStatus = {
  0: 'unkown',
  1: 'ok',
  2: 'warning',
  3: 'alert',
  4: 'critical',
};

export default function Alarm({ severity, statusOnly, sevIncrease, sevDecrease, acknowledged, muted, ackAlarm }) {
  const status = severityToStatus[severity];
  return (
    <div className={[styles.alarmContainer, statusOnly ? styles.statusOnly : ''].join(' ')}>
      <StatusText status={status}>{status}</StatusText>
      {statusOnly ? null : (
        <>
          <div className={styles.ackContainer} onClick={(event) => ackAlarm(event)}>
            <AcknowledgeIcon active={!acknowledged}></AcknowledgeIcon>
            <SeverityArrowIcon increase={sevIncrease} decrease={sevDecrease}></SeverityArrowIcon>
          </div>
          <MutedIcon active={!muted}></MutedIcon>
        </>
      )}
    </div>
  );
}
