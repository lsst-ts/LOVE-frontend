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
import PropTypes from 'prop-types';
import styles from './CameraHexapod.module.css';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import {
  hexapodCommandableByDDSStateMap,
  hexapodCommandableByDDSStatetoStyle,
  hexapodCompensationModeStateMap,
  hexapodCompensationModeStatetoStyle,
  hexapodInterlockStateMap,
  hexapodControllerStateMap,
  hexapodControllerStateEnabledSubstateMap,
  hexapodMTInPositionStateMap,
  hexapodMTInPositionStatetoStyle,
  hexapodConnectedStateMap,
  hexapodConnectedStatetoStyle,
  hexapodControllerStatetoStyle,
} from 'Config';

class CameraHexapod extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** State of if the CSC can control the MTHexapod */
    hexapodCommandableByDDS: PropTypes.bool,
    /** Enable or disable automatic compensation? */
    hexapodCompensationMode: PropTypes.bool,
    /** Is the socket connected (true=yes, false=no)? */
    hexapodConnected: PropTypes.bool,
    /** State reported by the controller */
    hexapodControllerState: PropTypes.number,
    /** Substate in ENABLED mode, an EnabledSubstate enumeration value */
    hexapodConstrollerStateEnabledSubstate: PropTypes.number,
    /** Application status. A bitmask of ApplicationStatus enumeration values */
    hexapodControllerStateApplicationStatus: PropTypes.number,
    /** If all actuators have reached their commanded position o not */
    hexapodInPosition: PropTypes.bool,
    /** Safety interlock engaged (preventing motion) or disengaged */
    hexapodInterlock: PropTypes.bool,
    /** High level state machine state identifier */
    hexapodSummaryState: PropTypes.number,
    /** Linear encoder readings from each MTHexapod actuator in microns */
    hexapodActuatorsCalibrated: PropTypes.array,
    /** Linear encoder readings from each MTHexapod actuator in counts */
    hexapodActuatorsRaw: PropTypes.array,
    /** Time at which encoders were read (TAI unix seconds) */
    hexapodActuatorsTimestamp: PropTypes.number,
    /** Commanded MTHexapod position in order (X, Y, Z, U, V, W) */
    hexapodApplicationDemand: PropTypes.array,
    /** Actual MTHexapod position, in order (X, Y, Z, U, V, W) */
    hexapodApplicationPosition: PropTypes.array,
    /** Position error (position - demand), in order (X, Y, Z, U, V, W) */
    hexapodApplicationError: PropTypes.array,
    /** Elevation on which the compensation was based */
    hexapodCompensationOffsetElevation: PropTypes.number,
    /** Azimuth on which the compensation was based */
    hexapodCompensationOffsetAzimuth: PropTypes.number,
    /** Camera rotator angle */
    hexapodCompensationOffsetRotation: PropTypes.number,
    /** Temperature on which the compensation was based */
    hexapodCompensationOffsetTemperature: PropTypes.number,
    /** compensated - uncompensated x */
    hexapodCompensationOffsetX: PropTypes.number,
    /** compensated - uncompensated y */
    hexapodCompensationOffsetY: PropTypes.number,
    /** compensated - uncompensated z */
    hexapodCompensationOffsetZ: PropTypes.number,
    /** compensated - uncompensated u */
    hexapodCompensationOffsetU: PropTypes.number,
    /** compensated - uncompensated v */
    hexapodCompensationOffsetV: PropTypes.number,
    /** compensated - uncompensated w */
    hexapodCompensationOffsetW: PropTypes.number,
  };

  static defaultProps = {
    hexapodCommandableByDDS: false,
    hexapodCompensationMode: false,
    hexapodConnected: false,
    hexapodControllerState: 0,
    hexapodConstrollerStateEnabledSubstate: 0,
    hexapodControllerStateApplicationStatus: 0,
    hexapodInPosition: false,
    hexapodInterlock: false,
    hexapodSummaryState: 0,
    hexapodActuatorsCalibrated: [],
    hexapodActuatorsRaw: [],
    hexapodActuatorsTimestamp: 0,
    hexapodApplicationDemand: [],
    hexapodApplicationPosition: [],
    hexapodApplicationError: [],
    hexapodCompensationOffsetElevation: 0,
    hexapodCompensationOffsetAzimuth: 0,
    hexapodCompensationOffsetRotation: 0,
    hexapodCompensationOffsetTemperature: 0,
    hexapodCompensationOffsetX: 0,
    hexapodCompensationOffsetY: 0,
    hexapodCompensationOffsetZ: 0,
    hexapodCompensationOffsetU: 0,
    hexapodCompensationOffsetV: 0,
    hexapodCompensationOffsetW: 0,
  };

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  HEADERS_HEXAPOD = [
    {
      field: 'hexapodApplication',
      title: 'Hexapod Position',
      className: styles.firstColumn,
    },
    {
      field: 'x',
      title: 'x',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'y',
      title: 'y',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'z',
      title: 'z',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'u',
      title: 'u',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'v',
      title: 'v',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'w',
      title: 'w',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
  ];

  HEADERS_STRUT = [
    {
      field: 'strutLength',
      title: 'Strut Length',
      className: styles.firstColumn,
    },
    {
      field: '1',
      title: '1',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: '2',
      title: '2',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: '3',
      title: '3',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: '4',
      title: '4',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: '5',
      title: '5',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: '6',
      title: '6',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
  ];

  render() {
    // Hexapod Position Table
    const defaultValues = { x: 0, y: 0, z: 0, u: 0, v: 0, w: 0 };
    const dataHexapod = [
      { hexapodApplication: 'Commanded [um, deg]', ...defaultValues },
      { hexapodApplication: 'Actual[um, deg]', ...defaultValues },
      { hexapodApplication: 'Compensation Offset[um, deg]', ...defaultValues },
    ];

    for (let i = 0; i < this.props.hexapodApplicationDemand.length; i++) {
      const axis = ['x', 'y', 'z', 'u', 'v', 'w'];
      dataHexapod[0][axis[i]] = this.props.hexapodApplicationDemand[i];
    }

    for (let i = 0; i < this.props.hexapodApplicationPosition.length; i++) {
      const axis = ['x', 'y', 'z', 'u', 'v', 'w'];
      dataHexapod[1][axis[i]] = this.props.hexapodApplicationPosition[i];
    }

    dataHexapod[2].x = this.props.hexapodCompensationOffsetX;
    dataHexapod[2].y = this.props.hexapodCompensationOffsetY;
    dataHexapod[2].z = this.props.hexapodCompensationOffsetZ;
    dataHexapod[2].u = this.props.hexapodCompensationOffsetU;
    dataHexapod[2].v = this.props.hexapodCompensationOffsetV;
    dataHexapod[2].w = this.props.hexapodCompensationOffsetW;

    const compensation = this.props.hexapodCompensationMode;
    const newDataHexapod = dataHexapod.filter((val, index) => index !== 2 || (index === 2 && compensation === true));

    // Strut Length Table
    const defaultsValues = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dataStrut = [{ strutLength: 'Actual [um]', ...defaultsValues }];

    for (let i = 0; i < this.props.hexapodActuatorsCalibrated.length; i++) {
      const axis = ['1', '2', '3', '4', '5', '6'];
      dataStrut[0][axis[i]] = this.props.hexapodActuatorsCalibrated[i];
    }

    // Hexapod status and Readiness summary
    const hexapodStatus = CSCDetail.states[this.props.hexapodSummaryState];
    const compensationStatus = hexapodCompensationModeStateMap[this.props.hexapodCompensationMode];
    const controllerState = hexapodControllerStateMap[this.props.hexapodControllerState];
    const interlockState = hexapodInterlockStateMap[this.props.hexapodInterlock];

    const commandableByDDS = hexapodCommandableByDDSStateMap[this.props.hexapodCommandableByDDS];

    // controllerState
    let controllerSubstate = '';
    if (controllerState === 'Enabled') {
      controllerSubstate = hexapodControllerStateEnabledSubstateMap[this.props.hexapodConstrollerStateEnabledSubstate];
    } else {
      controllerSubstate = 'Offline';
    }

    const inPosition = hexapodMTInPositionStateMap[this.props.hexapodInPosition];
    const connected = hexapodConnectedStateMap[this.props.hexapodConnected];

    return (
      <div>
        <div className={styles.hexapodContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title wide>Hexapod Status</Title>
            <Label>Hexapod Status</Label>
            <Value>
              <span className={[hexapodStatus.class, styles.summaryState].join(' ')}>{hexapodStatus.name}</span>
            </Value>
            <Label>Compensation</Label>
            <Value>
              <StatusText status={hexapodCompensationModeStatetoStyle[compensationStatus]}>
                {compensationStatus}
              </StatusText>
            </Value>
            <Label>ControllerSubstate</Label>
            <Value>
              <span className={styles.transformText}>{controllerSubstate}</span>
            </Value>
            <Label>Interlock state</Label>
            <Value>
              <span className={styles.transformText}>{interlockState}</span>
            </Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title wide className={styles.titles}>
              Readiness Summary
            </Title>
            <Label>Connected</Label>
            <Value>
              <StatusText status={hexapodConnectedStatetoStyle[connected]}>{connected}</StatusText>
            </Value>
            <Label>Commandable By DDS</Label>
            <Value>
              <StatusText status={hexapodCommandableByDDSStatetoStyle[commandableByDDS]}>{commandableByDDS}</StatusText>
            </Value>
            <Label>ControllerState</Label>
            <Value>
              <StatusText status={hexapodControllerStatetoStyle[controllerState]}>{controllerState}</StatusText>
            </Value>
            <Label>Hexapod in Position</Label>
            <Value>
              <StatusText status={hexapodMTInPositionStatetoStyle[inPosition]}>{inPosition}</StatusText>
            </Value>
          </SummaryPanel>
        </div>
        <div className={styles.divTables}>
          <SimpleTable headers={this.HEADERS_HEXAPOD} data={newDataHexapod} />
          <SimpleTable headers={this.HEADERS_STRUT} data={dataStrut} />
        </div>
      </div>
    );
  }
}

export default CameraHexapod;
