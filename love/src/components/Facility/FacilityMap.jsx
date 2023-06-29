import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './FacilityMap.module.css';
import Badge from '../GeneralPurpose/Badge/Badge';
import Map from './Map/Map.jsx';
import Device from './Map/Device.jsx';
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
    bombaAguaFriaP01: PropTypes.object,
    chiller01P01: PropTypes.object,
    chiller02P01: PropTypes.object,
    chiller03P01: PropTypes.object,
    generalP01: PropTypes.object,
    valvulaP01: PropTypes.object,
    vea01P01: PropTypes.object,
    vec01P01: PropTypes.object,
    vin01P01: PropTypes.object,

    /** HVAC Level 02 telemetry */
    crack01P02: PropTypes.object,
    crack02P02: PropTypes.object,
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
    manejadoraSblancaP04: PropTypes.object,
    manejadoraSlimpiaP04: PropTypes.object,
    vex03LowerP04: PropTypes.object,
    vex04CargaP04: PropTypes.object,

    /** HVAC Level 05 telemetry */
    dynaleneP05: PropTypes.object,
    manejadoraLower01P05: PropTypes.object,
    manejadoraLower02P05: PropTypes.object,
    manejadoraLower03P05: PropTypes.object,
    manejadoraLower04P05: PropTypes.object,
    vea01P05: PropTypes.object,
    vea08P05: PropTypes.object,
    vea09P05: PropTypes.object,
    vea10P05: PropTypes.object,
    vea11P05: PropTypes.object,
    vea12P05: PropTypes.object,
    vea13P05: PropTypes.object,
    vea14P05: PropTypes.object,
    vea15P05: PropTypes.object,
    vea16P05: PropTypes.object,
    vea17P05: PropTypes.object,
  };

  static defaultProps = {
    showHVAC: true,
    showPower: true,
    showMenu: true,
    arrowDirection: 'right',
    bombaAguaFriaP01: {},
    chiller01P01: {},
    chiller02P01: {},
    chiller03P01: {},
    generalP01: {},
    valvulaP01: {},
    vea01P01: {},
    vec01P01: {},
    vin01P01: {},
    crack01P02: {},
    crack02P02: {},
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
    manejadoraSblancaP04: {},
    manejadoraSlimpiaP04: {},
    vex03LowerP04: {},
    vex04CargaP04: {},
    dynaleneP05: {},
    manejadoraLower01P05: {},
    manejadoraLower02P05: {},
    manejadoraLower03P05: {},
    manejadoraLower04P05: {},
    vea01P05: {},
    vea08P05: {},
    vea09P05: {},
    vea10P05: {},
    vea11P05: {},
    vea12P05: {},
    vea13P05: {},
    vea14P05: {},
    vea15P05: {},
    vea16P05: {},
    vea17P05: {},
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
      compressorInfo1: this.props.compressorInfo1,
      connectionStatus1: this.props.connectionStatus1,
      errors1: this.props.errors1,
      status1: this.props.status1,
      timerInfo1: this.props.timerInfo1,
      warnings1: this.props.warnings1,
      analogData1: this.props.analogData1,

      compressorInfo2: this.props.compressorInfo2,
      connectionStatus2: this.props.connectionStatus2,
      errors2: this.props.errors2,
      status2: this.props.status2,
      timerInfo2: this.props.timerInfo2,
      warnings2: this.props.warnings2,
      analogData2: this.props.analogData2,

      bombaAguaFriaP01: this.props.bombaAguaFriaP01,
      chiller01P01: this.props.chiller01P01,
      chiller02P01: this.props.chiller02P01,
      chiller03P01: this.props.chiller03P01,
      generalP01: this.props.generalP01,
      valvulaP01: this.props.valvulaP01,
      vea01P01: this.props.vea01P01,
      vec01P01: this.props.vec01P01,
      vin01P01: this.props.vin01P01,
    };

    const HVACDataLevel2 = {
      crack01P02: this.props.crack01P02,
      crack02P02: this.props.crack02P02,
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
      manejadoraSblancaP04: this.props.manejadoraSblancaP04,
      manejadoraSlimpiaP04: this.props.manejadoraSlimpiaP04,
      vex03LowerP04: this.props.vex03LowerP04,
      vex04CargaP04: this.props.vex04CargaP04,
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
      manejadoraLower01P05: this.props.manejadoraLower01P05,
      manejadoraLower02P05: this.props.manejadoraLower02P05,
      manejadoraLower03P05: this.props.manejadoraLower03P05,
      manejadoraLower04P05: this.props.manejadoraLower04P05,
      vea01P05: this.props.vea01P05,
      vea08P05: this.props.vea08P05,
      vea09P05: this.props.vea09P05,
      vea10P05: this.props.vea10P05,
      vea11P05: this.props.vea11P05,
      vea12P05: this.props.vea12P05,
      vea13P05: this.props.vea13P05,
      vea14P05: this.props.vea14P05,
      vea15P05: this.props.vea15P05,
      vea16P05: this.props.vea16P05,
      vea17P05: this.props.vea17P05,
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
