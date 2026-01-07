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

import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import { fixedFloat } from 'Utils';

function Info(props) {
  const { sensor } = props;

  return (
    <>
      <SummaryPanel>
        <>
          <Title>Sensor {sensor.sensorId ? String(sensor.sensorId).padStart(3, '0') : ''}</Title>
          <div></div>

          <Label>Telemetry</Label>
          <Value>{sensor.telemetry}</Value>

          <Label>Name</Label>
          <Value>{sensor.sensorName}</Value>

          <Label>Location</Label>
          <Value>{sensor.location}</Value>

          <Label>Position X</Label>
          <Value>{sensor.position?.x}</Value>

          <Label>Position Y</Label>
          <Value>{sensor.position?.y}</Value>

          <Label>Position Z</Label>
          <Value>{sensor.position?.z}</Value>

          {sensor.numChannels ? (
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
          )}
        </>
      </SummaryPanel>
    </>
  );
}

const comparator = (prevProps, nextProps) => {
  return isEqual(nextProps.sensor, prevProps.sensor);
};

Info.propTypes = {
  sensor: PropTypes.shape({
    sensorId: PropTypes.number,
    sensorName: PropTypes.string,
    temperature: PropTypes.number,
    location: PropTypes.string,
    numChannels: PropTypes.number,
    telemetry: PropTypes.string,
  }),
};

Info.defaultProps = {
  sensor: {
    sensorId: 0,
    sensorName: '',
    temperature: 0,
    location: '',
    numChannels: 0,
    telemetry: '',
  },
};

export default React.memo(Info, comparator);
