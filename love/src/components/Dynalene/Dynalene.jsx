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

import styles from './Dynalene.module.css';
import Summary from './Summary/Summary';
import DynaleneCartoon from './DynaleneCartoon/DynaleneCartoon';
import TemperatureGradient from './TemperatureGradient/TemperatureGradient';
import Mixing from './Mixing/Mixing';
import SimpleTable from '../GeneralPurpose/SimpleTable/SimpleTable';
import { fixedFloat } from 'Utils';

export default class Dynalene extends Component {
  static propTypes = {
    /** True if the pump can be started */
    ready: PropTypes.bool,
    /** True if the pump is running */
    running: PropTypes.bool,
    /** True if pump motor is commanded to run forward, false for backward command */
    forwardCommanded: PropTypes.bool,
    /** True if pump motor is rotating forward, false for backward rotation. */
    forwardRotating: PropTypes.bool,
    /** True if motor is accelerating */
    accelerating: PropTypes.bool,
    /** True if motor is decelerating */
    decelerating: PropTypes.bool,
    /** True if motor faulted */
    faulted: PropTypes.bool,
    /** True if main frequency is controlled by the active communication. */
    mainFrequencyControlled: PropTypes.bool,
    /** True if pump motor operation is controlled by the active communication. */
    operationCommandControlled: PropTypes.bool,
    /** True if pump motor parameters are locked. */
    parametersLocked: PropTypes.bool,
    /** Motor controller error code. Please see VFD documentation for details. */
    errorCode: PropTypes.number,

    /** Air temperature measured above mirror level by sensor TS1-A */
    aboveMirrorTemperature: PropTypes.number,
    /** Cell temperature measured inside mirror cell by sensor TS2-MC */
    insideCellTemperature1: PropTypes.number,
    /** Cell temperature measured inside mirror cell by sensor TS3-MC */
    insideCellTemperature2: PropTypes.number,
    /** Cell temperature measured inside mirror cell by sensor TS4-MC */
    insideCellTemperature3: PropTypes.number,
    /** Temperature of input glycol (flowing from telescope/chillers), sensor TS5-G */
    telescopeCoolantSupplyTemperature: PropTypes.number,
    /** Temperature of returned glycol (returning to chillers), sensor TS6-G */
    telescopeCoolantReturnTemperature: PropTypes.number,
    /** Temperature of mirror glycol loop supply (measured after mixing valve), sensor TS7-G */
    mirrorCoolantSupplyTemperature: PropTypes.number,
    /** Temperature of mirror glycol loop return (measured before mixing valve), sensor TS8-G */
    mirrorCoolantReturnTemperature: PropTypes.number,

    /** Mixing valve measured position */
    valvePosition: PropTypes.number,
  };

  static defaultProps = {
    dynaleneState: 9,

    //Chiller 01
    dynCH01LS01: 0,
    dynCH01supFS01: 0,
    dynCH01supPS11: 0,
    dynCH01supTS05: 0,

    //Chiller 02
    dynCH02LS02: 0,
    dynCH02supFS02: 0,
    dynCH02supPS13: 0,
    dynCH02supTS07: 0,

    //Channel 01
    dynCH1CGLYtpd: 0,
    dynCH01retCGLYpres: 0,
    dynCH01retCGLYtemp: 0,
    dynCH01supCGLYpres: 0,
    dynCH01supCGLYtemp: 0,
    dynCH1supCGLYflow: 0,

    //Channel 02
    dynCH2GPGLYtpd: 0,
    dynCH02retGPGLYpres: 0,
    dynCH02retGPGLYtemp: 0,
    dynCH02supGPGLYpres: 0,
    dynCH02supGPGLYtemp: 0,
    dynCH2supGPGLYflow: 0,

    //Test Area
    dynTAtpd: 0,
    dynTAretPS04: 0,
    dynTAretTS04: 0,
    dynTAsupFS04: 0,
    dynTAsupPS03: 0,
    dynTAsupTS03: 0,

    //TMA
    dynTMAcmv01pos: 0,
    dynTMAcmv02pos: 0,
    dynTMAretPS02: 0,
    dynTMAretTS02: 0,
    dynTMAsupFS03: 0,
    dynTMAsupPS01: 0,
    dynTMAsupTS01: 0,
    dynTMAtpd: 0,

    //AvgAir
    exhAirAvrgTemp: 0,

    minTemp: -10,
    maxTemp: 10,
    width: 350,
    COLOURS: ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'],
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const {
      dynaleneState,
      dynAmbientDeltaModeStatus,
      dynExhaustAirBackupModeStatus,
      dynPierFansOnOff,
      dynRemoteLocalModeStatus,
      dynMainGridAlarm,
      dynMainGridFailureFlag,
      dynSafetyResetFlag,
      dynSysFault,
      dynSysWarning,
      dynTAalarm,
      dynTMAalarm,
      dynaleneTankLevel,
      dynCH01LS01,
      dynCH01supFS01,
      dynCH01supPS11,
      dynCH01supTS05,
      dynCH02LS02,
      dynCH02supFS02,
      dynCH02supPS13,
      dynCH02supTS07,
      dynCH1CGLYtpd,
      dynCH01retCGLYpres,
      dynCH01retCGLYtemp,
      dynCH01supCGLYpres,
      dynCH01supCGLYtemp,
      dynCH1supCGLYflow,
      dynCH2GPGLYtpd,
      dynCH02retGPGLYpres,
      dynCH02retGPGLYtemp,
      dynCH02supGPGLYpres,
      dynCH02supGPGLYtemp,
      dynCH2supGPGLYflow,
      dynTAtpd,
      dynTAretPS04,
      dynTAretTS04,
      dynTAsupFS04,
      dynTAsupPS03,
      dynTAsupTS03,
      dynTMAcmv01pos,
      dynTMAcmv02pos,
      dynTMAretPS02,
      dynTMAretTS02,
      dynTMAsupFS03,
      dynTMAsupPS01,
      dynTMAsupTS01,
      dynTMAtpd,
      exhAirAvrgTemp,
      width,
      COLOURS,
    } = this.props;

    const tempsArray = [
      dynCH01supTS05,
      dynTMAsupTS01,
      dynTMAretTS02,
      dynCH01supCGLYtemp,
      dynCH01retCGLYtemp,
      dynCH02supTS07,
      dynTAsupTS03,
      dynTAretTS04,
      dynCH02supGPGLYtemp,
      dynCH02retGPGLYtemp,
    ];

    const errorArray = [
      dynSysFault,
      dynSysWarning,
      dynTMAalarm,
      dynTAalarm,
      dynMainGridAlarm,
      dynMainGridFailureFlag,
      dynSafetyResetFlag,
    ];

    const faulted = errorArray.some((item) => item === true);

    const minTemp = Math.floor(Math.min(...tempsArray));
    const maxTemp = Math.ceil(Math.max(...tempsArray));

    const data = {
      s1: {
        section: '01',
        temp: this.props.dynCH01supTS05 ? dynCH01supTS05 : '-',
        pressure: this.props.dynCH01supPS11 ? dynCH01supPS11 : '-',
        flow: this.props.dynCH01supFS01 ? dynCH01supFS01 : '-',
        tpd: '-',
      },
      s2: {
        section: '02',
        temp: this.props.dynTMAsupTS01 ? dynTMAsupTS01 : '-',
        pressure: this.props.dynTMAsupPS01 ? dynTMAsupPS01 : '-',
        flow: this.props.dynTMAsupFS03 ? dynTMAsupFS03 : '-',
        tpd: this.props.dynTMAtpd ? dynTMAtpd : '-',
      },
      s3: {
        section: '03',
        temp: this.props.dynTMAretTS02 ? dynTMAretTS02 : '-',
        pressure: this.props.dynTMAretPS02 ? dynTMAretPS02 : '-',
        flow: '-',
        tpd: this.props.dynTMAtpd ? dynTMAtpd : '-',
      },
      s4: {
        section: '04',
        temp: '-',
        pressure: '-',
        flow: '-',
        tpd: '-',
      },
      s5: {
        section: '05',
        temp: this.props.dynCH01supCGLYtemp ? dynCH01supCGLYtemp : '-',
        pressure: this.props.dynCH01supCGLYpres ? dynCH01supCGLYpres : '-',
        flow: this.props.dynCH1supCGLYflow ? dynCH1supCGLYflow : '-',
        tpd: '-',
      },
      s6: {
        section: '06',
        temp: this.props.dynCH01retCGLYtemp ? dynCH01retCGLYtemp : '-',
        pressure: '-',
        flow: '-',
        tpd: this.props.dynCH1CGLYtpd ? dynCH1CGLYtpd : '-',
      },
      s7: {
        section: '07',
        temp: '-',
        pressure: '-',
        flow: '-',
        tpd: this.props.dynCH1CGLYtpd ? dynCH1CGLYtpd : '-',
      },
      s8: {
        section: '08',
        temp: '-',
        pressure: this.props.dynCH01retCGLYpres ? dynCH01retCGLYpres : '-',
        flow: '-',
        tpd: '-',
      },
      s9: {
        section: '09',
        temp: this.props.dynCH02supTS07 ? dynCH02supTS07 : '-',
        pressure: this.props.dynCH02supPS13 ? dynCH02supPS13 : '-',
        flow: this.props.dynCH02supFS02 ? dynCH02supFS02 : '-',
        tpd: '-',
      },
      s10: {
        section: '10',
        temp: this.props.dynTAsupTS03 ? dynTAsupTS03 : '-',
        pressure: this.props.dynTAsupPS03 ? dynTAsupPS03 : '-',
        flow: this.props.dynTAsupFS04 ? dynTAsupFS04 : '-',
        tpd: this.props.dynTAtpd ? dynTAtpd : '-',
      },
      s11: {
        section: '11',
        temp: this.props.dynTAretTS04 ? dynTAretTS04 : '-',
        pressure: this.props.dynTAretPS04 ? dynTAretPS04 : '-',
        flow: '-',
        tpd: this.props.dynTAtpd ? dynTAtpd : '-',
      },
      s12: {
        section: '12',
        temp: '-',
        pressure: this.props.dynCH01supTS05 ? dynCH01supTS05 : '-',
        flow: '-',
        tpd: '-',
      },
      s13: {
        section: '13',
        temp: this.props.dynCH02supGPGLYtemp ? dynCH02supGPGLYtemp : '-',
        pressure: this.props.dynCH02supGPGLYpres ? dynCH02supGPGLYpres : '-',
        flow: this.props.dynCH2supGPGLYflow ? dynCH2supGPGLYflow : '-',
        tpd: '-',
      },
      s14: {
        section: '14',
        temp: '-',
        pressure: this.props.dynCH01supTS05 ? dynCH01supTS05 : '-',
        flow: '-',
        tpd: this.props.dynCH2GPGLYtpd ? dynCH2GPGLYtpd : '-',
      },
      s15: {
        section: '15',
        temp: '-',
        pressure: this.props.dynCH01supTS05 ? dynCH01supTS05 : '-',
        flow: this.props.dynCH01supTS05 ? dynCH01supTS05 : '-',
        tpd: '-',
      },
      s16: {
        section: '16',
        temp: this.props.dynCH02retGPGLYtemp ? dynCH02retGPGLYtemp : '-',
        pressure: this.props.dynCH02retGPGLYpres ? dynCH02retGPGLYpres : '-',
        flow: '-',
        tpd: this.props.dynCH2GPGLYtpd ? dynCH2GPGLYtpd : '-',
      },
    };

    const simpleTableData = Object.values(data);

    const headers = [
      {
        field: 'section',
        title: 'Section',
      },
      {
        field: 'temp',
        title: (
          <>
            Temperature <span className={styles.units}>[ºC]</span>
          </>
        ),
        render: (value) => (isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(2)}ºC`),
      },
      {
        field: 'pressure',
        title: (
          <>
            Pressure <span className={styles.units}>[Pa]</span>
          </>
        ),
        render: (value) => (isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(2)} Pa`),
      },
      {
        field: 'flow',
        title: (
          <>
            Flowrate <span className={styles.units}>[l/min]</span>
          </>
        ),
        render: (value) => (isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(2)} l/min`),
      },
      {
        field: 'tpd',
        title: (
          <>
            Power Dissipation <span className={styles.units}>[kW]</span>
          </>
        ),
        render: (value) => (isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(2)} kW`),
      },
    ];

    return (
      <>
        <div className={styles.summaryContainer}>
          <Summary
            dynaleneState={dynaleneState}
            dynAmbientDeltaModeStatus={dynAmbientDeltaModeStatus}
            dynExhaustAirBackupModeStatus={dynExhaustAirBackupModeStatus}
            exhAirAvrgTemp={exhAirAvrgTemp}
            dynRemoteLocalModeStatus={dynRemoteLocalModeStatus}
            dynPierFansOnOff={dynPierFansOnOff}
            dynaleneTankLevel={dynaleneTankLevel}
            faulted={faulted}
            errorArray={errorArray}
          />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.cartoonContainer}>
            <DynaleneCartoon
              ts1={dynCH01supTS05}
              ts2={dynTMAsupTS01}
              ts3={dynTMAretTS02}
              ts4={dynTMAretTS02}
              ts5={dynCH01supCGLYtemp}
              ts6={dynCH01supCGLYtemp}
              ts7={dynCH01retCGLYtemp}
              ts8={dynCH01retCGLYtemp}
              ts9={dynCH02supTS07}
              ts10={dynTAsupTS03}
              ts11={dynTAretTS04}
              ts12={dynTAretTS04}
              ts13={dynCH02supGPGLYtemp}
              ts14={dynCH02supGPGLYtemp}
              ts15={dynCH02retGPGLYtemp}
              ts16={dynCH02retGPGLYtemp}
              chiller01={fixedFloat(dynCH01LS01, 2)}
              chiller02={fixedFloat(dynCH02LS02, 2)}
              minTemperatureLimit={minTemp}
              maxTemperatureLimit={maxTemp}
              colours={COLOURS}
              width={'100%'}
            />
          </div>
          <div>
            <div className={styles.rightRow}>
              <div className={styles.tempGradientContainer}>
                <TemperatureGradient minTemperatureLimit={minTemp} maxTemperatureLimit={maxTemp} width={width} />
              </div>
              <div className={styles.mixingContainer}>
                <Mixing title={'Mixing Valve 01'} value={dynTMAcmv01pos} />
                <Mixing title={'Mixing Valve 02'} value={dynTMAcmv02pos} />
              </div>
            </div>
          </div>
        </div>
        {this.props.tableVisible ? (
          <div className={styles.tableContainer}>
            <SimpleTable headers={headers} data={simpleTableData} />
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}
