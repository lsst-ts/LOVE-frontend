import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
import Button from '../../../GeneralPurpose/Button/Button';
import { severityToStatus } from '../../Alarm/Alarm';
import { relativeTime } from '../../../../Utils';
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

export default function DetailsPanel({ alarm, muteAlarm, unmuteAlarm }) {

  const [timeout, setTimeout] = useState(initialState.timeout);
  const [muteSeverity, setMuteSeverity] = useState(initialState.muteSeverity);

  const sevUpdate = relativeTime(alarm.timestampSeverityOldest * 1000);
  const maxSevUpdate = relativeTime(alarm.timestampMaxSeverity * 1000);
  const lastUpdate = relativeTime(alarm.timestampSeverityNewest * 1000);

  const acked = alarm.acknowledged;
  const acknowledgedBy = acked ? alarm.acknowledgedBy : 'Not acknowledged';
  const ackTimeTitle = acked ? 'Acknowledged at:' : 'Un-acknowledged at:';
  const ackTime = relativeTime(alarm.timestampAcknowledged * 1000);
  const willAutoAckTime = acked? relativeTime(alarm.timestampAutoAcknowledge * 1000) : 'Already acknowledged';

  const escalated = alarm.escalated;
  const escalatedToTitle = escalated ? 'Escalated to:' : 'Will escalate to:';
  const escalatedTo = alarm.escalatedTo ? alarm.escalatedTo : 'Nobody';
  const escalatedTimeTitle = escalated ? 'Escalated at:' : 'Will escalate at:';
  const escalatedTime = relativeTime(alarm.timestampEscalate * 1000);

  const muted = alarm.mutedBy !== '';
  const mutedBy = alarm.mutedBy ? alarm.mutedBy : 'Not muted';
  const mutedSeverity = alarm.mutedSeverity ? severityToStatus[alarm.mutedSeverity].toUpperCase() : 'Not muted';
  const willUnmuteTime = relativeTime(alarm.timestampUnmute * 1000);

  return (
    <div className={styles.expandedColumn}>

      <div>
        <div className={styles.dataTable}>
          <div className={styles.title}> Severity update: </div>
          <div className={styles.dataCell}> {acknowledgedBy} </div>

          <div className={styles.title}> Max sev. update: </div>
          <div className={styles.dataCell}> {maxSevUpdate} </div>

          <div className={styles.title}> Last update: </div>
          <div className={styles.dataCell}> {lastUpdate} </div>
        </div>

        <div className={styles.title}>Alarm reason:</div>
        <div>
          <p>{alarm.reason}</p>
        </div>
      </div>

      <div>
        <div className={styles.dataTable}>
          <div className={styles.title}> Acknowledged by: </div>
          <div className={styles.dataCell}> {sevUpdate} </div>

          <div className={styles.title}> {ackTimeTitle} </div>
          <div className={styles.dataCell}> {ackTime} </div>

          <div className={styles.title}> Will auto-ack at: </div>
          <div className={styles.dataCell}> {willUnmuteTime} </div>
        </div>

        <div className={styles.dataTable}>
          <div className={styles.title}> {escalatedToTitle} </div>
          <div className={styles.dataCell}> {escalatedTo} </div>

          <div className={styles.title}> {escalatedTimeTitle} </div>
          <div className={styles.dataCell}> {escalatedTime} </div>
        </div>
      </div>

      { muted ? (
        <div>
          <div>
            <div className={styles.dataTable}>
              <div className={styles.title}> Muted by: </div>
              <div className={styles.dataCell}> {mutedBy} </div>

              <div className={styles.title}> Will unmute at: </div>
              <div className={styles.dataCell}> {willUnmuteTime} </div>

              <div className={styles.title}> Muted severity: </div>
              <div className={styles.dataCell}> {mutedSeverity} </div>
            </div>

            <div className={styles.dataTable}>
              <div className={styles.title}> {escalatedToTitle} </div>
              <div className={styles.dataCell}> {escalatedTo} </div>

              <div className={styles.title}> {escalatedTimeTitle} </div>
              <div className={styles.dataCell}> {escalatedTime} </div>
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
