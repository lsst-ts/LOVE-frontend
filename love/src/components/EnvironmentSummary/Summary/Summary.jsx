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
import styles from './Summary.module.css';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import TemperaturesSummary from '../SummaryInformation/TemperaturesSummary';

export default class Summary extends Component {
  render() {
    const {
      windDirection,
      windSpeed,
      degradation,
      atmosphericTrans,
      airTemp,
      pressure,
      humidity,
      seeing,
      numChannels,
      temperature,
      location,
    } = this.props;

    const temperatures = temperature.slice(0, numChannels);
    const locations = location ? location.split(',') : [];

    return (
      <div className={styles.container}>
        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Env. Degradation</Label>
          <Value>{degradation}</Value>
          <Label>Atm. Transmition</Label>
          <Value>{atmosphericTrans}</Value>
          <Label>Air Temperature</Label>
          <Value>{airTemp}</Value>
          <Label>Pressure</Label>
          <Value>{pressure}</Value>
        </SummaryPanel>

        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Humidity</Label>
          <Value>{humidity}</Value>
          <Label>Wind Speed</Label>
          <Value>{windSpeed}</Value>
          <Label>Wind Direction</Label>
          <Value>{windDirection}</Value>
          <Label>Seeing</Label>
          <Value>{seeing}</Value>
        </SummaryPanel>

        <div className={[styles.pt].join(' ')}>
          <TemperaturesSummary numChannels={numChannels} temperature={temperature} location={location} />
        </div>
      </div>
    );
  }
}
