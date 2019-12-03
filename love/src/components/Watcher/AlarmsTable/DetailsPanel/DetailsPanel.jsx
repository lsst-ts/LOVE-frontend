import React from 'react';
import styles from './DetailsPanel.module.css';

export default function DetailsPanel({ alarm }) {

  const acknowledgedBy = alarm.acknowledgedBy ? alarm.acknowledgedBy : 'Not acknowledged';
  const mutedBy = alarm.mutedBy ? alarm.mutedBy : 'Not muted';

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

      {alarm.mutedBy !== '' ? (
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
        </div>
      ) : (
        <div>
          <div className={styles.title}> Select the muting time range: </div>
        </div>
      )}
    </div>
  );
}
