/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import styles from './Alarm.module.css';
import StatusText from '../../GeneralPurpose/AlarmLabelText/AlarmLabelText';
import Button from '../../GeneralPurpose/Button/Button';
import { severityToStatus } from '../../../Config';

export default function Alarm({ severity, ackButtonLocation, acknowledged, muted, ackAlarm }) {
  const status = severityToStatus[severity];
  const ackButton = !acknowledged ? (
    <Button
      title="ack"
      status="info"
      disabled={acknowledged}
      onClick={(event) => {
        ackAlarm(event);
      }}
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
          ackButtonLocation === 'left' ? styles.leftAckButton : '',
          ackButtonLocation === 'right' ? styles.rightAckButton : '',
        ].join(' ')}
      >
        {ackButtonLocation === 'left' ? ackButton : null}
        <StatusText status={status}>{status}</StatusText>
        {ackButtonLocation === 'right' ? ackButton : null}
      </div>
    </>
  );
}
