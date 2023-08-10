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
import styles from './Moon.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import MoonCartoon from '../../SkyElements/MoonCartoon/MoonCartoon';
import { fixedFloat } from 'Utils';

export default class Moon extends Component {
  render() {
    const { moonRa, moonDec, moonAlt, moonAz, moonDistance, moonPhase } = this.props;
    const phase = moonPhase * 100;
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Moon</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(moonAlt, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(moonAz, 2)} °`}</Value>
            <Label>Ra</Label>
            <Value>{`${fixedFloat(moonRa, 2)} °`}</Value>
            <Label>Dec</Label>
            <Value>{`${fixedFloat(moonDec, 2)} °`}</Value>
            <Label>Distance</Label>
            <Value>{`${fixedFloat(moonDistance, 2)} °`}</Value>
          </SummaryPanel>
          <div className={styles.divMoonCartoon}>
            <MoonCartoon ilumination={phase} />
            <span>{`${phase} %`}</span>
          </div>
        </div>
      </div>
    );
  }
}
