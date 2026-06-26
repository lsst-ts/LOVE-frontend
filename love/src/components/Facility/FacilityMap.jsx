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
import { isArray } from 'lodash';

import styles from './FacilityMap.module.css';
import Map from './Map/Map.jsx';
import EyeIcon from '../icons/EyeIcon/EyeIcon';
import SimpleArrowIcon from '../icons/SimpleArrowIcon/SimpleArrowIcon';
import { thresholdScott } from 'd3';

export default class FacilityMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHVAC: false,
      showPower: true,
      showMenu: true,
      arrowDirection: 'right',
    };
  }

  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,

    /** Are HVAC devices showing */
    showHVAC: PropTypes.bool,

    /** Is Power Information showing */
    showPower: PropTypes.bool,

    /** Is the LeftMenu showing*/
    showMenu: PropTypes.bool,

    /** Current direction the left menu arrow is pointing */
    arrowDirection: PropTypes.string,

    /** HVAC Level 01 telemetry */
    glycolChiller03BoosterPump: PropTypes.object,
    coldGlycolChiller01: PropTypes.object,
    coldGlycolChiller02: PropTypes.object,
    comfortGlycolChiller03: PropTypes.object,
    ambientFloor1: PropTypes.object,
    glycolChiller03SwitchValves: PropTypes.object,
    airCirculationFan01ElectricalRoom: PropTypes.object,
    airExtractionFan01MRCR: PropTypes.object,
    airIntakeFan01MainBuilding: PropTypes.object,

    /** HVAC Level 02 telemetry */
    crac01: PropTypes.object,
    crac02: PropTypes.object,
    fancoilUnit01ITOffice: PropTypes.object,
    fancoilUnit02BreakRoom: PropTypes.object,
    fancoilUnit03ControlRoom: PropTypes.object,
    fancoilUnit04ControlRoom: PropTypes.object,
    fancoilUnit05ControlRoom: PropTypes.object,
    fancoilUnit06ManagersOffice: PropTypes.object,
    fancoilUnit07SafetyOffice: PropTypes.object,
    fancoilUnit08ElectricalOffice: PropTypes.object,
    fancoilUnit09MeetingRoom: PropTypes.object,
    fancoilUnit10WorkRoom: PropTypes.object,
    fancoilUnit11WorkRoom: PropTypes.object,
    fancoilUnit12CoatingOffice: PropTypes.object,

    /** HVAC Level 04 telemetry */
    airHandlingUnit05WhiteRoom: PropTypes.object,
    airHandlingUnit06CleanRoom: PropTypes.object,
    airExtractionFan03HighBay: PropTypes.object,
    airExtractionFan04Dome: PropTypes.object,

    /** HVAC Level 05 telemetry */
    dynalene: PropTypes.object,
    airHandlingUnit01Dome: PropTypes.object,
    airHandlingUnit02Dome: PropTypes.object,
    airHandlingUnit03Dome: PropTypes.object,
    airHandlingUnit04Dome: PropTypes.object,
    airCirculationFan01Lab: PropTypes.object,
    airCirculationFan08Pier: PropTypes.object,
    airCirculationFan09Pier: PropTypes.object,
    airCirculationFan10Pier: PropTypes.object,
    airCirculationFan11Pier: PropTypes.object,
    airCirculationFan12Pier: PropTypes.object,
    airCirculationFan13Pier: PropTypes.object,
    airCirculationFan14Pier: PropTypes.object,
    airCirculationFan15Pier: PropTypes.object,
    airCirculationFan16Lab: PropTypes.object,
    airCirculationFan17Lab: PropTypes.object,
  };

  static defaultProps = {
    showHVAC: true,
    showPower: true,
    showMenu: true,
    arrowDirection: 'right',
    glycolChiller03BoosterPump: {},
    coldGlycolChiller01: {},
    coldGlycolChiller02: {},
    comfortGlycolChiller03: {},
    ambientFloor1: {},
    glycolChiller03SwitchValves: {},
    airCirculationFan01ElectricalRoom: {},
    airExtractionFan01MRCR: {},
    airIntakeFan01MainBuilding: {},
    crac01: {},
    crac02: {},
    fancoilUnit01ITOffice: {},
    fancoilUnit02BreakRoom: {},
    fancoilUnit03ControlRoom: {},
    fancoilUnit04ControlRoom: {},
    fancoilUnit05ControlRoom: {},
    fancoilUnit06ManagersOffice: {},
    fancoilUnit07SafetyOffice: {},
    fancoilUnit08ElectricalOffice: {},
    fancoilUnit09MeetingRoom: {},
    fancoilUnit10WorkRoom: {},
    fancoilUnit11WorkRoom: {},
    fancoilUnit12CoatingOffice: {},
    airHandlingUnit05WhiteRoom: {},
    airHandlingUnit06CleanRoom: {},
    airExtractionFan03HighBay: {},
    airExtractionFan04Dome: {},
    dynalene: {},
    airHandlingUnit01Dome: {},
    airHandlingUnit02Dome: {},
    airHandlingUnit03Dome: {},
    airHandlingUnit04Dome: {},
    airCirculationFan01Lab: {},
    airCirculationFan08Pier: {},
    airCirculationFan09Pier: {},
    airCirculationFan10Pier: {},
    airCirculationFan11Pier: {},
    airCirculationFan12Pier: {},
    airCirculationFan13Pier: {},
    airCirculationFan14Pier: {},
    airCirculationFan15Pier: {},
    airCirculationFan16Lab: {},
    airCirculationFan17Lab: {},
  };

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  getEyeIcon = (active) => {
    return <EyeIcon active={!active} />;
  };

  checkArray(ctx) {
    if (isArray(ctx)) {
      return ctx[0];
    } else {
      return ctx;
    }
  }

  hideHVAC = () => {
    this.setState((prevState) => ({
      showHVAC: !prevState.showHVAC,
    }));
  };

  toggleLeftMenu = () => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
    this.state.arrowDirection === 'right'
      ? (this.state.arrowDirection = 'left')
      : (this.state.arrowDirection = 'right');
  };

  hidePower = () => {
    /*
    this.setState(prevState => ({
      showPower: !prevState.showPower
    }));*/
  };

  render() {
    const { showHVAC, showPower } = this.state;
    const HVACDataLevel1 = {
      errors1: this.checkArray(this.props.errors1),
      status1: this.checkArray(this.props.status1),
      timerInfo1: this.checkArray(this.props.timerInfo1),
      warnings1: this.checkArray(this.props.warnings1),
      analogData1: this.checkArray(this.props.analogData1),

      errors2: this.checkArray(this.props.errors2),
      status2: this.checkArray(this.props.status2),
      timerInfo2: this.checkArray(this.props.timerInfo2),
      warnings2: this.checkArray(this.props.warnings2),
      analogData2: this.checkArray(this.props.analogData2),

      glycolChiller03BoosterPump: this.props.glycolChiller03BoosterPump,
      coldGlycolChiller01: this.props.coldGlycolChiller01,
      coldGlycolChiller02: this.props.coldGlycolChiller02,
      comfortGlycolChiller03: this.props.comfortGlycolChiller03,
      ambientFloor1: this.props.ambientFloor1,
      glycolChiller03SwitchValves: this.props.glycolChiller03SwitchValves,
      airCirculationFan01ElectricalRoom: this.props.airCirculationFan01ElectricalRoom,
      airExtractionFan01MRCR: this.props.airExtractionFan01MRCR,
      airIntakeFan01MainBuilding: this.props.airIntakeFan01MainBuilding,
    };

    const HVACDataLevel2 = {
      crac01: this.props.crac01,
      crac02: this.props.crac02,
      fancoilUnit01ITOffice: this.props.fancoilUnit01ITOffice,
      fancoilUnit02BreakRoom: this.props.fancoilUnit02BreakRoom,
      fancoilUnit03ControlRoom: this.props.fancoilUnit03ControlRoom,
      fancoilUnit04ControlRoom: this.props.fancoilUnit04ControlRoom,
      fancoilUnit05ControlRoom: this.props.fancoilUnit05ControlRoom,
      fancoilUnit06ManagersOffice: this.props.fancoilUnit06ManagersOffice,
      fancoilUnit07SafetyOffice: this.props.fancoilUnit07SafetyOffice,
      fancoilUnit08ElectricalOffice: this.props.fancoilUnit08ElectricalOffice,
      fancoilUnit09MeetingRoom: this.props.fancoilUnit09MeetingRoom,
      fancoilUnit10WorkRoom: this.props.fancoilUnit10WorkRoom,
      fancoilUnit11WorkRoom: this.props.fancoilUnit11WorkRoom,
      fancoilUnit12CoatingOffice: this.props.fancoilUnit12CoatingOffice,
    };

    const HVACDataLevel4 = {
      airHandlingUnit05WhiteRoom: this.props.airHandlingUnit05WhiteRoom,
      airHandlingUnit06CleanRoom: this.props.airHandlingUnit06CleanRoom,
      airExtractionFan03HighBay: this.props.airExtractionFan03HighBay,
      airExtractionFan04Dome: this.props.airExtractionFan04Dome,
    };

    const HVACDataLevel5 = {
      dynaleneEvents: {
        dynMainGridAlarm: this.props.dynaleneSafeties.dynMainGridAlarm,
        dynMainGridFailureFlag: this.props.dynaleneSafeties.dynMainGridFailureFlag,
        dynSafetyResetFlag: this.props.dynaleneSafeties.dynSafetyResetFlag,
        dynTAalarm: this.props.dynaleneSafeties.dynTAalarm,
        dynTMAalarm: this.props.dynaleneSafeties.dynTMAalarm,
        dynaleneTankLevelAlarm: this.props.dynaleneSafeties.dynTankLevelAlarm,
        dynaleneState: this.props.dynaleneState,
      },
      dynalene: this.props.dynalene,
      airHandlingUnit01Dome: this.props.airHandlingUnit01Dome,
      airHandlingUnit02Dome: this.props.airHandlingUnit02Dome,
      airHandlingUnit03Dome: this.props.airHandlingUnit03Dome,
      airHandlingUnit04Dome: this.props.airHandlingUnit04Dome,
      airCirculationFan01Lab: this.props.airCirculationFan01Lab,
      airCirculationFan08Pier: this.props.airCirculationFan08Pier,
      airCirculationFan09Pier: this.props.airCirculationFan09Pier,
      airCirculationFan10Pier: this.props.airCirculationFan10Pier,
      airCirculationFan11Pier: this.props.airCirculationFan11Pier,
      airCirculationFan12Pier: this.props.airCirculationFan12Pier,
      airCirculationFan13Pier: this.props.airCirculationFan13Pier,
      airCirculationFan14Pier: this.props.airCirculationFan14Pier,
      airCirculationFan15Pier: this.props.airCirculationFan15Pier,
      airCirculationFan16Lab: this.props.airCirculationFan16Lab,
      airCirculationFan17Lab: this.props.airCirculationFan17Lab,
    };

    return (
      <div className={styles.content}>
        {/** Left Menu **/}
        <div className={this.state.showMenu ? styles.leftMenu : [styles.leftMenu, styles.hideLeftMenu].join(' ')}>
          {/** CSC Section **/}
          <div className={styles.cscMenu}>
            <div className={styles.title}>Devices</div>

            <div className={styles.section}>
              <div>SHOW</div>
              <div className={styles.iconWrapper} onClick={() => this.hideHVAC()}>
                {this.getEyeIcon(showHVAC)}
              </div>
            </div>

            {/** 
            <div className={styles.section}>
              <div>Power</div>
              <div className={styles.iconWrapper} onClick={() => this.hidePower()}>
                {this.getEyeIcon(showPower)}
              </div>
            </div>
            **/}
          </div>

          {/** Legend Section **/}
          <div className={styles.legendMenu}>
            <div className={styles.title}>Legend</div>
            <div className={styles.legendContent}>
              <svg width="100" height="54" className={styles.device}>
                <g id="device">
                  <g id="TopBar">
                    <g id="TitleBar">
                      <rect className={styles.titleBg} width={100} height={20} />
                      <text className={styles.deviceTitle} transform={'translate(6 18)'}>
                        <tspan>{'Name'}</tspan>
                      </text>
                      <text className={styles.title} transform={'translate(' + (100 - 6) + ' 8)'} textAnchor="end">
                        <tspan>{''}</tspan>
                      </text>
                    </g>
                    <g transform={'translate(0 24)'}>
                      <rect className={styles.titleRow2} width={100} height={30} />
                      <g transform={'translate(6 7)'}>
                        <rect className={styles.statusOk} width={15} height={15} />
                        <rect className={styles.statusOk} width={15} height={15} transform={'translate(18 0)'} />
                        <rect className={styles.statusOk} width={15} height={15} transform={'translate(36 0)'} />
                        <rect className={styles.statusOk} width={15} height={15} transform={'translate(54 0)'} />
                      </g>
                      <g transform={'translate(11 20)'}>
                        <text className={styles.boxText}>
                          <tspan>{'1'}</tspan>
                        </text>
                        <text className={styles.boxText} transform={'translate(16 0)'}>
                          <tspan>{'2'}</tspan>
                        </text>
                        <text className={styles.boxText} transform={'translate(34 0)'}>
                          <tspan>{'3'}</tspan>
                        </text>
                        <text className={styles.boxText} transform={'translate(52 0)'}>
                          <tspan>{'4'}</tspan>
                        </text>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>

              <ol className={styles.stateList}>
                <li>Command started</li>
                <li>Working</li>
                <li>Unit state</li>
                <li>Switch state</li>
              </ol>
            </div>
          </div>
        </div>

        <div className={styles.arrow}>
          <div onClick={() => this.toggleLeftMenu()}>
            <SimpleArrowIcon direction={this.state.arrowDirection} />
          </div>
        </div>

        <Map
          hideHVAC={showHVAC}
          HVACDataLevel1={HVACDataLevel1}
          HVACDataLevel2={HVACDataLevel2}
          HVACDataLevel4={HVACDataLevel4}
          HVACDataLevel5={HVACDataLevel5}
        />
      </div>
    );
  }
}
