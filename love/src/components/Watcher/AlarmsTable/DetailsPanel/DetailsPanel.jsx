import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Button from '../../../GeneralPurpose/Button/Button';
import TimestampDisplay from '../../../GeneralPurpose/TimestampDisplay/TimestampDisplay';
import { severityToStatus } from '../../../../Config';
import styles from './DetailsPanel.module.css';

const timeoutOptions = [
  { value: 900, label: '15 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 7200, label: '2 hours' },
];

const severityOptions = Object.keys(severityToStatus)
  .map((key) => {
    return { value: Number(key), label: severityToStatus[key].toUpperCase() };
  })
  .slice(2);

const initialState = {
  timeout: timeoutOptions[0],
  muteSeverity: severityOptions[0],
};

export default function DetailsPanel({ alarm, taiToUtc, muteAlarm, unmuteAlarm }) {
  const [timeout, setTimeout] = useState(initialState.timeout);
  const [muteSeverity, setMuteSeverity] = useState(initialState.muteSeverity);

  const sevUpdate = alarm.timestampSeverityOldest?.value;
  const maxSevUpdate = alarm.timestampMaxSeverity?.value;
  const lastUpdate = alarm.timestampSeverityNewest?.value;

  const acked = alarm.acknowledged?.value;
  const acknowledgedBy = !acked ? 'Not acknowledged' : alarm.acknowledgedBy?.value ? alarm.acknowledgedBy?.value : 'Nobody';
  const ackTimeTitle = acked ? 'Acknowledged at:' : 'Un-acknowledged at:';
  const ackTime = alarm.timestampAcknowledged?.value;
  const willAutoAckTime = alarm.timestampAutoAcknowledge?.value;

  const escalated = alarm.escalated?.value;
  const escalatedToTitle = escalated ? 'Escalated to:' : 'Will escalate to:';
  const escalatedTo = alarm.escalatedTo?.value ? alarm.escalatedTo?.value : 'Nobody';
  const escalatedTimeTitle = escalated ? 'Escalated at:' : 'Will escalate at:';
  const escalatedTime = alarm.timestampEscalate?.value;

  const muted = alarm.mutedBy?.value !== '';
  const mutedBy = alarm.mutedBy?.value ? alarm.mutedBy?.value : 'Not muted';
  const mutedSeverity = alarm.mutedSeverity?.value ? severityToStatus[alarm.mutedSeverity?.value].toUpperCase() : 'Not muted';
  const willUnmuteTime = alarm.timestampUnmute?.value;

  return (
    <>
    <div className={styles.expandedColumn}>

      {muted ? (
        <div className={styles.panel1}>
          <div>
            <div className={styles.dataTable}>
              <div className={styles.title}> Muted by: </div>
              <div className={styles.dataCell}> {mutedBy} </div>

              <div className={styles.title}> Will unmute at: </div>
              <TimestampDisplay taiToUtc={taiToUtc} timestamp={willUnmuteTime * 1000} defValue="Never" />

              <div className={styles.title}> Muted severity: </div>
              <div className={styles.dataCell}> {mutedSeverity} </div>
            </div>
          </div>

          <Button
            title="unmute"
            status="primary"
            disabled={!muted}
            shape="rounder"
            onClick={(event) => {
              unmuteAlarm(event);
            }}
          >
            UNMUTE
          </Button>
        </div>
      ) : (
        <div className={styles.panel1}>
          <div className={styles.title}> Select the muting time range: </div>
          <Dropdown
            className={styles.dropDownClassName}
            controlClassName={styles.dropDownControlClassName}
            menuClassName={[styles.dropDownMenuClassName, alarm.acknowledged?.value ? null : styles.unack].join(' ')}
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
            menuClassName={[styles.dropDownMenuClassName, alarm.acknowledged?.value ? null : styles.unack].join(' ')}
            arrowClassName={styles.arrowClassName}
            options={severityOptions}
            onChange={(option) => setMuteSeverity(option)}
            value={muteSeverity}
            placeholder="Select an option"
          />

          <Button
            title="mute"
            status="info"
            disabled={muted}
            shape="rounder"
            onClick={(event) => {
              muteAlarm(event, timeout.value, muteSeverity.value);
            }}
          >
            MUTE
          </Button>
        </div>
      )}

      <div className={styles.panel2}>
        <div className={styles.dataTable}>
          <div className={styles.title}> Acknowledged by: </div>
          <div className={styles.dataCell}> {acknowledgedBy} </div>

          <div className={styles.title}> {ackTimeTitle} </div>
          <TimestampDisplay taiToUtc={taiToUtc} timestamp={ackTime * 1000} defValue="Never" />

          <div className={styles.title}> Will auto-ack at: </div>
          <TimestampDisplay taiToUtc={taiToUtc} timestamp={willAutoAckTime * 1000} defValue="Already acknowledged" />

          <div>&nbsp;</div> <div>&nbsp;</div>
          <div className={styles.title}> {escalatedToTitle} </div>
          <div className={styles.dataCell}> {escalatedTo} </div>

          <div className={styles.title}> {escalatedTimeTitle} </div>
          <TimestampDisplay taiToUtc={taiToUtc} timestamp={escalatedTime * 1000} defValue="Never" />
        </div>
      </div>

      <div className={styles.panel3}>
        <div className={styles.dataTable}>
          <div className={styles.title}> Severity update: </div>
          <TimestampDisplay taiToUtc={taiToUtc} timestamp={sevUpdate * 1000} defValue="Never" />

          <div className={styles.title}> Max sev. update: </div>
          <TimestampDisplay taiToUtc={taiToUtc} timestamp={maxSevUpdate * 1000} defValue="Never" />

          <div className={styles.title}> Last update: </div>
          <TimestampDisplay taiToUtc={taiToUtc} timestamp={lastUpdate * 1000} defValue="Never" />
        </div>
      </div>

      <div className={styles.panel4}>
        <div className={styles.title}>Alarm reason:</div>
        <div className={styles.reason}>
          <p>{alarm.reason?.value}</p>
        </div>
      </div>
    </div>
    </>
  );
}
