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

import React, { Component } from 'react';
import styles from './SummaryInformation.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import { schedulerTrackingStateToMap, schedulerTrackingStateToStyle } from 'Config';
import { fixedFloat } from 'Utils';

export default class Simonyi extends Component {
  render() {
    const { simonyiTrackingState, simonyiAltitude, simonyiAzimuth, simonyiRotator, simonyiDomeAlt, simonyiDomeAz } =
      this.props;
    const simonyiTracking = schedulerTrackingStateToMap[simonyiTrackingState];

    return (
      <div className={styles.container}>
        <SummaryPanel className={[styles.summaryPanel, styles.telescope].join(' ')}>
          <Title>Simonyi Enclosure</Title>
          <Value>
            <StatusText status={schedulerTrackingStateToStyle[simonyiTracking]}>{simonyiTracking}</StatusText>
          </Value>
        </SummaryPanel>
        <div className={styles.mountDomeDiv}>
          <SummaryPanel className={[styles.summaryPanel, styles.telescope].join(' ')}>
            <Title>Mount</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(simonyiAltitude, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(simonyiAzimuth, 2)} °`}</Value>
            <Label>Rotator</Label>
            <Value>{`${fixedFloat(simonyiRotator, 2)} °`}</Value>
          </SummaryPanel>
          <SummaryPanel className={[styles.summaryPanel, styles.telescope].join(' ')}>
            <Title>Dome</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(simonyiDomeAlt, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(simonyiDomeAz, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
