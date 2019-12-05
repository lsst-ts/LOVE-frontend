import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
import Button from '../../../GeneralPurpose/Button/Button';
import { severityToStatus } from '../../Alarm/Alarm';
import { relativeTime, msToStr } from '../../../../Utils';
import styles from './DetailsPanel.module.css';

const timeoutOptions = [
  { value: 900, label: '15 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 7200, label: '2 hours' },
];

const severityOptions = [
  { value: 2, label: 'WARNING' },
  { value: 3, label: 'ALERT' },
  { value: 4, label: 'CRITICAL' },
];

const initialState = {
  timeout: timeoutOptions[0],
  muteSeverity: severityOptions[0],
};

export function DataDisplay({ children, copyData, tooltipData, className }) {
  return (
    <div
      className={[className, styles.dataCell].join(' ')}
      title={tooltipData + " (click to copy)"}
      onClick={() => {navigator.clipboard.writeText(copyData)}}
    >
      {children}
    </div>
  );
}

export function TstampDisplay({ time, className, defValue='' }) {
  const copyValue = msToStr(time);
  const displayValue = time ? relativeTime(time) : defValue;
  return (
    <div
      className={[className, styles.dataCell].join(' ')}
      title={copyValue + " (click to copy)"}
      onClick={() => {navigator.clipboard.writeText(copyValue)}}
    >
      {displayValue}
    </div>
  );
}

export default function DetailsPanel({ alarm, muteAlarm, unmuteAlarm }) {

  const [timeout, setTimeout] = useState(initialState.timeout);
  const [muteSeverity, setMuteSeverity] = useState(initialState.muteSeverity);

  const sevUpdate = alarm.timestampSeverityOldest * 1000;
  const maxSevUpdate = alarm.timestampMaxSeverity * 1000;
  const lastUpdate = alarm.timestampSeverityNewest * 1000;

  const acked = alarm.acknowledged;
  // const acknowledgedBy = acked ? alarm.acknowledgedBy : 'Not acknowledged';
  const acknowledgedBy = !acked ? 'Not acknowledged' : (alarm.acknowledgedBy ? alarm.acknowledgedBy : 'Nobody');
  const ackTimeTitle = acked ? 'Acknowledged at:' : 'Un-acknowledged at:';
  const ackTime = alarm.timestampAcknowledged * 1000;
  const willAutoAckTime = alarm.timestampAutoAcknowledge * 1000;

  const escalated = alarm.escalated;
  const escalatedToTitle = escalated ? 'Escalated to:' : 'Will escalate to:';
  const escalatedTo = alarm.escalatedTo ? alarm.escalatedTo : 'Nobody';
  const escalatedTimeTitle = escalated ? 'Escalated at:' : 'Will escalate at:';
  const escalatedTime = alarm.timestampEscalate * 1000;

  const muted = alarm.mutedBy !== '';
  const mutedBy = alarm.mutedBy ? alarm.mutedBy : 'Not muted';
  const mutedSeverity = alarm.mutedSeverity ? severityToStatus[alarm.mutedSeverity].toUpperCase() : 'Not muted';
  const willUnmuteTime = alarm.timestampUnmute * 1000;

  return (
    <div className={styles.expandedColumn}>

      <div>
        <div className={styles.dataTable}>
          <div className={styles.title}> Severity update: </div>
          <TstampDisplay time={sevUpdate}/>

          <div className={styles.title}> Max sev. update: </div>
          <TstampDisplay time={maxSevUpdate} />

          <div className={styles.title}> Last update: </div>
          <TstampDisplay time={lastUpdate} />
        </div>

        <div className={styles.title}>Alarm reason:</div>
        <div>
          <p>{alarm.reason}</p>
        </div>
      </div>

      <div>
        <div className={styles.dataTable}>
          <div className={styles.title}> Acknowledged by: </div>
          <div className={styles.dataCell}> {acknowledgedBy} </div>

          <div className={styles.title}> {ackTimeTitle} </div>
          <TstampDisplay time={ackTime}/>

          <div className={styles.title}> Will auto-ack at: </div>
          <TstampDisplay time={willAutoAckTime} defValue="Already acknowledged"/>
        </div>

        <div className={styles.dataTable}>
          <div className={styles.title}> {escalatedToTitle} </div>
          <div className={styles.dataCell}> {escalatedTo} </div>

          <div className={styles.title}> {escalatedTimeTitle} </div>
          <TstampDisplay time={willAutoAckTime} defValue="Never"/>
        </div>
      </div>

      { muted ? (
        <div>
          <div>
            <div className={styles.dataTable}>
              <div className={styles.title}> Muted by: </div>
              <div className={styles.dataCell}> {mutedBy} </div>

              <div className={styles.title}> Will unmute at: </div>
              <TstampDisplay time={willUnmuteTime} defValue="Never"/>

              <div className={styles.title}> Muted severity: </div>
              <div className={styles.dataCell}> {mutedSeverity} </div>
            </div>
          </div>

          <Button
            title='unmute'
            status='primary'
            disabled={!muted}
            onClick={(event) => {unmuteAlarm(event)}}
          >
            UNMUTE
          </Button>
        </div>

      ) : (
        <div>
          <div className={styles.title}> Select the muting time range: </div>
          <Dropdown
            className={styles.dropDownClassName}
            controlClassName={styles.dropDownControlClassName}
            menuClassName={[styles.dropDownMenuClassName, alarm.acknowledged ? null : styles.unack].join(' ')}
            arrowClassName={styles.arrowClassName}
            options={timeoutOptions}
            onChange={(option) => setTimeout(option)}
            value={timeout}
            placeholder="Select an option"
          />

          <div className={styles.title}> Select the muting severity: </div>
            <Dropdown
              className={styles.dropDownClassName}
              controlClassName={styles.dropDownControlClassName}
              menuClassName={[styles.dropDownMenuClassName, alarm.acknowledged ? null : styles.unack].join(' ')}
              arrowClassName={styles.arrowClassName}
              options={severityOptions}
              onChange={(option) => setMuteSeverity(option)}
              value={muteSeverity}
              placeholder="Select an option"
            />

          <Button
            title='mute'
            status='info'
            disabled={muted}
            onClick={(event) => {muteAlarm(event, timeout.value, muteSeverity.value)}}
          >
            MUTE
          </Button>
        </div>
      )}
    </div>
  );
}
