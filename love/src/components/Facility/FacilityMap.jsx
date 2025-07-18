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
    coldWaterPump01: PropTypes.object,
    chiller01P01: PropTypes.object,
    chiller02P01: PropTypes.object,
    chiller03P01: PropTypes.object,
    generalP01: PropTypes.object,
    valveP01: PropTypes.object,
    airInletFan01P01: PropTypes.object,
    centrifugalExtractionFan01P01: PropTypes.object,
    centrifugalSupplyFan01P01: PropTypes.object,

    /** HVAC Level 02 telemetry */
    crac01P02: PropTypes.object,
    crac02P02: PropTypes.object,
    fancoil01P02: PropTypes.object,
    fancoil02P02: PropTypes.object,
    fancoil03P02: PropTypes.object,
    fancoil04P02: PropTypes.object,
    fancoil05P02: PropTypes.object,
    fancoil06P02: PropTypes.object,
    fancoil07P02: PropTypes.object,
    fancoil08P02: PropTypes.object,
    fancoil09P02: PropTypes.object,
    fancoil10P02: PropTypes.object,
    fancoil11P02: PropTypes.object,
    fancoil12P02: PropTypes.object,

    /** HVAC Level 04 telemetry */
    whiteRoomAHU01P05: PropTypes.object,
    cleanRoomAHU01P05: PropTypes.object,
    lowerDamperFan03P04: PropTypes.object,
    loadingBayFan04P04: PropTypes.object,

    /** HVAC Level 05 telemetry */
    dynaleneP05: PropTypes.object,
    lowerAHU01P05: PropTypes.object,
    lowerAHU02P05: PropTypes.object,
    lowerAHU03P05: PropTypes.object,
    lowerAHU04P05: PropTypes.object,
    airInletFan01P05: PropTypes.object,
    airInletFan08P05: PropTypes.object,
    airInletFan09P05: PropTypes.object,
    airInletFan10P05: PropTypes.object,
    airInletFan11P05: PropTypes.object,
    airInletFan12P05: PropTypes.object,
    airInletFan13P05: PropTypes.object,
    airInletFan14P05: PropTypes.object,
    airInletFan15P05: PropTypes.object,
    airInletFan16P05: PropTypes.object,
    airInletFan17P05: PropTypes.object,
  };

  static defaultProps = {
    showHVAC: true,
    showPower: true,
    showMenu: true,
    arrowDirection: 'right',
    coldWaterPump01: {},
    chiller01P01: {},
    chiller02P01: {},
    chiller03P01: {},
    generalP01: {},
    valveP01: {},
    airInletFan01P01: {},
    centrifugalExtractionFan01P01: {},
    centrifugalSupplyFan01P01: {},
    crac01P02: {},
    crac02P02: {},
    fancoil01P02: {},
    fancoil02P02: {},
    fancoil03P02: {},
    fancoil04P02: {},
    fancoil05P02: {},
    fancoil06P02: {},
    fancoil07P02: {},
    fancoil08P02: {},
    fancoil09P02: {},
    fancoil10P02: {},
    fancoil11P02: {},
    fancoil12P02: {},
    whiteRoomAHU01P05: {},
    cleanRoomAHU01P05: {},
    lowerDamperFan03P04: {},
    loadingBayFan04P04: {},
    dynaleneP05: {},
    lowerAHU01P05: {},
    lowerAHU02P05: {},
    lowerAHU03P05: {},
    lowerAHU04P05: {},
    airInletFan01P05: {},
    airInletFan08P05: {},
    airInletFan09P05: {},
    airInletFan10P05: {},
    airInletFan11P05: {},
    airInletFan12P05: {},
    airInletFan13P05: {},
    airInletFan14P05: {},
    airInletFan15P05: {},
    airInletFan16P05: {},
    airInletFan17P05: {},
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
      compressorInfo1: this.checkArray(this.props.compressorInfo1),
      connectionStatus1: this.checkArray(this.props.connectionStatus1),
      errors1: this.checkArray(this.props.errors1),
      status1: this.checkArray(this.props.status1),
      timerInfo1: this.checkArray(this.props.timerInfo1),
      warnings1: this.checkArray(this.props.warnings1),
      analogData1: this.checkArray(this.props.analogData1),

      compressorInfo2: this.checkArray(this.props.compressorInfo2),
      connectionStatus2: this.checkArray(this.props.connectionStatus2),
      errors2: this.checkArray(this.props.errors2),
      status2: this.checkArray(this.props.status2),
      timerInfo2: this.checkArray(this.props.timerInfo2),
      warnings2: this.checkArray(this.props.warnings2),
      analogData2: this.checkArray(this.props.analogData2),

      coldWaterPump01: this.props.coldWaterPump01,
      chiller01P01: this.props.chiller01P01,
      chiller02P01: this.props.chiller02P01,
      chiller03P01: this.props.chiller03P01,
      generalP01: this.props.generalP01,
      valveP01: this.props.valveP01,
      airInletFan01P01: this.props.airInletFan01P01,
      centrifugalExtractionFan01P01: this.props.centrifugalExtractionFan01P01,
      centrifugalSupplyFan01P01: this.props.centrifugalSupplyFan01P01,
    };

    const HVACDataLevel2 = {
      crac01P02: this.props.crac01P02,
      crac02P02: this.props.crac02P02,
      fancoil01P02: this.props.fancoil01P02,
      fancoil02P02: this.props.fancoil02P02,
      fancoil03P02: this.props.fancoil03P02,
      fancoil04P02: this.props.fancoil04P02,
      fancoil05P02: this.props.fancoil05P02,
      fancoil06P02: this.props.fancoil06P02,
      fancoil07P02: this.props.fancoil07P02,
      fancoil08P02: this.props.fancoil08P02,
      fancoil09P02: this.props.fancoil09P02,
      fancoil10P02: this.props.fancoil10P02,
      fancoil11P02: this.props.fancoil11P02,
      fancoil12P02: this.props.fancoil12P02,
    };

    const HVACDataLevel4 = {
      whiteRoomAHU01P05: this.props.whiteRoomAHU01P05,
      cleanRoomAHU01P05: this.props.cleanRoomAHU01P05,
      lowerDamperFan03P04: this.props.lowerDamperFan03P04,
      loadingBayFan04P04: this.props.loadingBayFan04P04,
    };

    const HVACDataLevel5 = {
      dynaleneP05Events: {
        dynMainGridAlarm: this.props.dynMainGridAlarm,
        dynMainGridFailureFlag: this.props.dynMainGridFailureFlag,
        dynSafetyResetFlag: this.props.dynSafetyResetFlag,
        dynTAalarm: this.props.dynTAalarm,
        dynTMAalarm: this.props.dynTMAalarm,
        dynaleneState: this.props.dynaleneState,
        dynaleneTankLevel: this.props.dynaleneTankLevel,
      },
      dynaleneP05: this.props.dynaleneP05,
      lowerAHU01P05: this.props.lowerAHU01P05,
      lowerAHU02P05: this.props.lowerAHU02P05,
      lowerAHU03P05: this.props.lowerAHU03P05,
      lowerAHU04P05: this.props.lowerAHU04P05,
      airInletFan01P05: this.props.airInletFan01P05,
      airInletFan08P05: this.props.airInletFan08P05,
      airInletFan09P05: this.props.airInletFan09P05,
      airInletFan10P05: this.props.airInletFan10P05,
      airInletFan11P05: this.props.airInletFan11P05,
      airInletFan12P05: this.props.airInletFan12P05,
      airInletFan13P05: this.props.airInletFan13P05,
      airInletFan14P05: this.props.airInletFan14P05,
      airInletFan15P05: this.props.airInletFan15P05,
      airInletFan16P05: this.props.airInletFan16P05,
      airInletFan17P05: this.props.airInletFan17P05,
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
