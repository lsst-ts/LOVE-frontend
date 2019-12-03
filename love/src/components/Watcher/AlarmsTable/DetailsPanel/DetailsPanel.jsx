import React from 'react';
import Button from '../../../GeneralPurpose/Button/Button';
import styles from './DetailsPanel.module.css';

export default function DetailsPanel({ alarm, muteAlarm, unmuteAlarm }) {

  const acknowledgedBy = alarm.acknowledgedBy ? alarm.acknowledgedBy : 'Not acknowledged';
  const mutedBy = alarm.mutedBy ? alarm.mutedBy : 'Not muted';
  const muted = alarm.mutedBy !== '';

  return (
    <div className={styles.expandedColumn}>
      <div>
        <div className={styles.title}>Acknowledged by:</div>
        <div>
          <p>{acknowledgedBy}</p>
        </div>

        <div className={styles.title}>Alarm reason:</div>
        <div>
          <p>{alarm.reason}</p>
        </div>
      </div>

      { muted ? (
        <div>
          <div className={styles.title}> Muted for: </div>
          <div>
            <p>{acknowledgedBy}</p>
          </div>
          <div className={styles.title}> Time remaining: </div>
          <div>
            <p>{acknowledgedBy}</p>
          </div>
          <div className={styles.title}> Muted by: </div>
          <div>
            <p>{mutedBy}</p>
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
          <div>
            <div className={styles.title}> Select the muting time range: </div>
          </div>
          <Button
            title='mute'
            status='info'
            disabled={muted}
            onClick={(event) => {muteAlarm(event, 'duration')}}
          >
            MUTE
          </Button>
        </div>
      )}
    </div>
  );
}
