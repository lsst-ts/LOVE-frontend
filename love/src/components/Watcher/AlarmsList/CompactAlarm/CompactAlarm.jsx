/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { useState } from 'react';
import Button from '../../../GeneralPurpose/Button/Button';
import styles from './CompactAlarm.module.css';
import StatusText from '../../../GeneralPurpose/AlarmLabelText/AlarmLabelText';
import { severityToStatus } from '../../../../Config';

export default function CompactAlarm({
  user,
  name,
  severity,
  maxSeverity,
  acknowledged,
  muted,
  reason,
  severityUpdateTimestamp,
  ackAlarm,
}) {
  const severityStatus = severityToStatus[severity];
  const maxSeverityStatus = severityToStatus[maxSeverity];
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.alarmContainer}>
      <div
        className={styles.alarmWrapper}
        onClick={(event) => {
          setExpanded(!expanded);
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
        }}
      >
        <span className={styles.name}>{name}</span>
        <span className={styles.labelWrapper}>
          <span className={styles.label}>SEVERITY: </span>
        </span>
        <div className={styles.statusContainer}>
          <StatusText status={severityStatus}>{severityStatus}</StatusText>
        </div>
        <span className={styles.timestampContainer}>
          <span className={styles.label}>Updated: </span>
          <span className={styles.timestamp}>{severityUpdateTimestamp}</span>
        </span>
        <span className={styles.labelWrapper}>
          <span className={styles.label}>MAX SEVERITY: </span>
        </span>
        <div className={styles.statusContainer}>
          <StatusText status={maxSeverityStatus}>{maxSeverityStatus}</StatusText>
        </div>
        <div className={[styles.separator, expanded ? '' : styles.hidden].join(' ')}></div>
      </div>
      <div
        className={[styles.expandedAlarm, expanded ? '' : styles.hidden].join(' ')}
        onClick={(event) => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
        }}
      >
        <span className={styles.label}>Reason:</span>
        <div className={styles.reason}>{reason}</div>
        <div className={styles.ackButtonContainer}>
          <Button
            title="Acknowledge"
            status="info"
            shape="rounder"
            onClick={(event) => {
              event.stopPropagation();
              ackAlarm(name, maxSeverity, user);
              event.nativeEvent.stopImmediatePropagation();
            }}
          >
            ACK
          </Button>
        </div>
      </div>
    </div>
  );
}
