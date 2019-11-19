import React, {useState} from 'react';
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import Button from '../../GeneralPurpose/Button/Button';

export const severityToStatus = {
  0: 'unkown',
  1: 'ok',
  2: 'warning',
  3: 'alert',
  4: 'critical',
};

export default function Alarm({ severity, statusOnly, acknowledged, muted, ackAlarm }) {
  const [showButton, setShowButton] = useState(false);
  const status = severityToStatus[severity];
  return (
    <div
      className={[styles.alarmContainer, statusOnly ? styles.statusOnly : ''].join(' ')}
      onMouseEnter={() => {setShowButton(true)}}
      onMouseLeave={() => {setShowButton(false)}}
    >
      <StatusText status={status}>{status}</StatusText>
      {statusOnly || acknowledged ? null : (
        !showButton ? (
          <div className={styles.newLabel}>
            NEW
          </div>
        ) : (
          <Button
            title='ack'
            status='success'
            disabled={acknowledged}
            onClick={(event) => {ackAlarm(event)}}
          >
            ACK
          </Button>
        )
      )}
    </div>
  );
}
