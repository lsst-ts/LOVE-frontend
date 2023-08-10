/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
    const { auxtelTrackingState, auxtelAltitude, auxtelAzimuth, auxtelRotator, auxtelDomeAlt, auxtelDomeAz } =
      this.props;
    const auxtelTracking = schedulerTrackingStateToMap[auxtelTrackingState];
    return (
      <div className={styles.container}>
        <SummaryPanel className={[styles.summaryPanel, styles.telescope].join(' ')}>
          <Title>Auxiliary Telescope</Title>
          <Value>
            <StatusText status={schedulerTrackingStateToStyle[auxtelTracking]}>{auxtelTracking}</StatusText>
          </Value>
        </SummaryPanel>
        <div className={styles.mountDomeDiv}>
          <SummaryPanel className={[styles.summaryPanel, styles.telescope].join(' ')}>
            <Title>Mount</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(auxtelAltitude, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(auxtelAzimuth, 2)} °`}</Value>
            <Label>Rotator</Label>
            <Value>{`${fixedFloat(auxtelRotator, 2)} °`}</Value>
          </SummaryPanel>
          <SummaryPanel className={[styles.summaryPanel, styles.telescope].join(' ')}>
            <Title>Dome</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(auxtelDomeAlt, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(auxtelDomeAz, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
