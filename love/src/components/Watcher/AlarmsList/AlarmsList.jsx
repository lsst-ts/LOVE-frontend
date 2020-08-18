import React from 'react';
import PropTypes from 'prop-types';
import { relativeTime } from '../../../Utils';
import CompactAlarm from './CompactAlarm/CompactAlarm';
import styles from './AlarmsList.module.css';

AlarmList.propTypes = {
  /** Name of the current user */
  user: PropTypes.string,
  /** Number of seconds to add to a TAI timestamp to convert it in UTC */
  taiToUtc: PropTypes.number,
  /** List of alarms that are displayed. See examples below */
  alarms: PropTypes.array,
  /** Function to dispatch an alarm acknowledgement */
  ackAlarm: PropTypes.func,
};

export default function AlarmList({ alarms, taiToUtc, ackAlarm, user }) {
  return (
    <div className={styles.alarmsContainer} title="Alarms">
      {alarms.length < 1 ? (
        <div className={styles.alarmsTitle}>No active alarms</div>
      ) : (
        <>
          <div className={styles.alarmsTitle}>Active alarms</div>
          {alarms
            .sort((a, b) => (a.severity.value > b.severity.value ? -1 : 1))
            .map((alarm) => {
              const timestamp = alarm.timestampSeverityOldest.value * 1000;
              const severityUpdateTimestamp = relativeTime(timestamp, taiToUtc);
              const alarmProps = {
                user: user,
                name: alarm.name?.value,
                severity: alarm.severity?.value,
                maxSeverity: alarm.maxSeverity?.value,
                acknowledged: alarm.acknowledged?.value,
                muted: alarm.muted?.value,
                severityUpdateTimestamp,
                reason: alarm.reason?.value,
                ackAlarm: ackAlarm,
              };

              return <CompactAlarm key={alarm.name?.value} {...alarmProps}></CompactAlarm>;
            })}
        </>
      )}
    </div>
  );
}
