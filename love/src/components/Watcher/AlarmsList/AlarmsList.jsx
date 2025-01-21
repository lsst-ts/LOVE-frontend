/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
  /** Function to dispatch an alarm logging */
  logAlarm: PropTypes.func,
};

export default function AlarmList({ alarms, taiToUtc, ackAlarm, logAlarm, user }) {
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
                logAlarm: logAlarm,
              };

              return <CompactAlarm key={alarm.name?.value} {...alarmProps}></CompactAlarm>;
            })}
        </>
      )}
    </div>
  );
}
