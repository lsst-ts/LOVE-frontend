import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import { M1M3ActuatorPositions } from 'Config';
import styles from './FacilityMap.module.css';
import Badge from '../GeneralPurpose/Badge/Badge';
import Map from './Map/Map.jsx';
import Device from './Map/Device.jsx';
import EyeIcon from '../icons/EyeIcon/EyeIcon';
import SimpleArrowIcon from '../icons/SimpleArrowIcon/SimpleArrowIcon';

export default class FacilityMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHVAC: true,
      showPower: true,
      showMenu: true,
      arrowDirection: 'right',
      alarms: [],
    };
  }

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
    const showHVAC = this.state.showHVAC;
    const showPower = this.state.showPower;

    const HVACDataLevel1 = {
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
            <div className={styles.title}>CSC</div>

            <div className={styles.section}>
              <div>HVAC</div>
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
