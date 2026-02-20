/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { Component } from 'react';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import { fixedFloat } from 'Utils';
import TemperaturesSummary from '../SummaryInformation/TemperaturesSummary';
import styles from './Summary.module.css';

export default class Summary extends Component {
  render() {
    const {
      windDirection,
      windSpeed,
      degradation,
      atmosphericTrans,
      pressure,
      humidity,
      seeing,
      numChannels,
      temperature,
      location,
    } = this.props;

    return (
      <div className={styles.container}>
        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Env. Degradation</Label>
          <Value>{degradation}</Value>
          <Label>Atm. Transmition</Label>
          <Value>{atmosphericTrans}</Value>
          <Label>Pressure</Label>
          <Value>{`${fixedFloat(pressure[0], 2)} Pa`}</Value>
        </SummaryPanel>

        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Humidity</Label>
          <Value>{`${fixedFloat(humidity, 2)} %`}</Value>
          <Label>Wind Speed</Label>
          <Value>{`${fixedFloat(windSpeed, 2)} m/s`}</Value>
          <Label>Wind Direction</Label>
          <Value>{`${fixedFloat(windDirection, 2)} °`}</Value>
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
