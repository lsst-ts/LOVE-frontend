import React from 'react';
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import Button from '../../GeneralPurpose/Button/Button';
import { severityToStatus } from '../../../Config';

export default function Alarm({ severity, ackButtonLocation, acknowledged, muted, ackAlarm }) {
  const status = severityToStatus[severity];
  const ackButton = !acknowledged ? (
    <Button
      title='ack'
      status='info'
      disabled={acknowledged}
      onClick={(event) => {ackAlarm(event)}}
      command
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
