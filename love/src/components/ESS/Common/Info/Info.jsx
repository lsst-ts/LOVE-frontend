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
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import { fixedFloat } from 'Utils';
import styles from './Info.module.css';

function Info({ sensor }) {
  return (
    <SummaryPanel className={styles.summaryPanel}>
      <Title>Sensor {sensor.sensorId ? String(sensor.sensorId).padStart(3, '0') : ''}</Title>
      <div></div>

      <Label>Name</Label>
      <Value>
        <a target="_blank" href={sensor.configURL}>
          {sensor.name ?? '-'}
        </a>
      </Value>

      <Label>Host</Label>
      <Value>{sensor.host ?? '-'}</Value>

      <Label>Location</Label>
      <Value>{sensor.location ?? '-'}</Value>

      <Label>Position (x, y, z)</Label>
      <Value>{sensor.position ? `(${sensor.position[0]}, ${sensor.position[1]}, ${sensor.position[2]})` : '-'}</Value>

      {/* <Label>Telemetry</Label>
      <Value>{sensor.telemetry ?? '-'}</Value>

      <Label>Reading</Label>
      <Value>{sensor.payload ?? '-'}</Value> */}

      {/* {sensor.numChannels ? (
        <>
          <Label>NumChannels</Label>
          <Value>{fixedFloat(sensor.numChannels, 0)}</Value>
        </>
      ) : (
        <></>
      )}

      {sensor.indexArr !== undefined ? (
        <>
          <Label>Index</Label>
          <Value>{fixedFloat(sensor.indexArr, 0)}</Value>
        </>
      ) : (
        <></>
      )} */}
    </SummaryPanel>
  );
}

Info.propTypes = {
  sensor: PropTypes.shape({
    /** The ID of the sensor */
    sensorId: PropTypes.number,
    /** The name of the sensor */
    name: PropTypes.string,
    /** The location of the sensor */
    location: PropTypes.string,
    /** The position of the sensor
     * In the form [x, y, z]
     */
    position: PropTypes.arrayOf(PropTypes.number),
    /** The telemetry of the sensor
     * E,.g. ESS-121-telemetry-temperature-temperatureItem-6
     */
    telemetry: PropTypes.string,
    /** The reading of the sensor
     * E.g. { value: 23.5, units: 'C' }
     */
    payload: PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      units: PropTypes.string,
    }),
  }),
};

export default Info;
