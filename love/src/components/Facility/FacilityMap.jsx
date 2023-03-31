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

  getEyeIcon = (active) => {
    return <EyeIcon active={!active} />;
  };

  hideHVAC = () => {
    this.setState((prevState) => ({
      showHVAC: !prevState.showHVAC,
    }));
    console.log('Show HVAC? ' + this.state.showHVAC);
  };

  toggleLeftMenu = () => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
    this.state.arrowDirection === 'right'
      ? (this.state.arrowDirection = 'left')
      : (this.state.arrowDirection = 'right');
    console.log(this.state.arrowDirection);
  };

  hidePower = () => {
    /*
    this.setState(prevState => ({
      showPower: !prevState.showPower
    }));*/
    console.log('Show Power? ' + this.state.showPower);
  };

  render() {
    const showHVAC = this.state.showHVAC;
    const showPower = this.state.showPower;

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

            <div className={styles.section}>
              <div>Power</div>
              <div className={styles.iconWrapper} onClick={() => this.hidePower()}>
                {this.getEyeIcon(showPower)}
              </div>
            </div>
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

        <Map hideHVAC={showHVAC} />
      </div>
    );
  }
}
