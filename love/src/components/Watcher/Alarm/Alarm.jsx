import React from 'react';
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

export default function Alarm({ severity, ackButtonLocation, acknowledged, muted, ackAlarm }) {
  const status = severityToStatus[severity];
  const ackButton = acknowledged ? (
    <Button
      title='ack'
      status='info'
      disabled={acknowledged}
      onClick={(event) => {ackAlarm(event)}}
    >
      ACK
    </Button>
  ) : (
    <div></div>
  );
  return (
    <>
    <div
      className={[
        styles.alarmContainer,
        ackButtonLocation === 'left'? styles.leftAckButton : '',
        ackButtonLocation === 'right'? styles.rightAckButton : ''
      ].join(' ')}
    >
      {ackButtonLocation === 'left' ? (ackButton) : null}
      <StatusText status={status}>{status}</StatusText>
      {ackButtonLocation === 'right' ? (ackButton) : null}
    </div>
    </>
  );
}
