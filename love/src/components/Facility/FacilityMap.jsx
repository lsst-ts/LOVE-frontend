import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import { M1M3ActuatorPositions } from 'Config';
import styles from './FacilityMap.module.css';
import Badge from '../GeneralPurpose/Badge/Badge';
import Map from './Map/Map.jsx'
import Device from './Map/Device.jsx';


export default class FacilityMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHVAC: true,
      showPower: true,
      alarms: [],
    };
  }

  getEyeIcon = (style) => {
    return(
      <svg className={[styles.eye, style ? '' : styles.selected].join(' ')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.81 7.55">
        <path d="m12.25,2.21C9.3-.74,4.51-.74,1.56,2.21l-1.56,1.56,1.56,1.56c2.95,2.95,7.74,2.95,10.69,0l1.56-1.56-1.56-1.56Zm-5.34,4.06c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5,2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5Z"/>
      </svg>
    );
  };

  hideHVAC = () => {
    this.setState(prevState => ({
      showHVAC: !prevState.showHVAC
    }));
    console.log('Show HVAC? '+this.state.showHVAC);
  };

  hidePower = () => {
    /*
    this.setState(prevState => ({
      showPower: !prevState.showPower
    }));*/
    console.log('Show Power? '+this.state.showPower);
  };

  render() {
    const showHVAC = this.state.showHVAC;
    const showPower = this.state.showPower;

    return (
      <div className={styles.content}>

        <div className={styles.leftMenu}>


          {/** CSC Section **/}
          <div className={styles.cscMenu}>
            <div className={styles.title}>CSC</div>

            <div className={styles.section}>
              <div>HVAC</div>
              <div 
              className={styles.iconWrapper}
              onClick={() => this.hideHVAC()}
            >
                {this.getEyeIcon(showHVAC)}
              </div>
            </div>

            <div className={styles.section}>
              <div>Power</div>
              <div 
                className={styles.iconWrapper}
                onClick={() => this.hidePower()}
              >
                  {this.getEyeIcon(showPower)}
              </div>
            </div>
          </div>

        {/** Legend Section **/}
          <div className={styles.legendMenu}>
            <div className={styles.title}>Legend</div>
            <div className={styles.legendContent}>

            <svg width='100' height='54' className={styles.device}>
              <g id="device">
                <g id="TopBar">
                  <g id="TitleBar">
                    <rect className={styles.titleBg} width={100} height={20} />
                    <text className={styles.deviceTitle} transform={'translate(6 18)'}>
                      <tspan>{'Name'}</tspan>
                    </text>
                    <text className={styles.title} transform={'translate('+(100-6)+' 8)'} textAnchor='end'>
                      <tspan>{''}</tspan>
                    </text>
                  </g>
                  <g transform={'translate(0 24)'}>
                    <rect className={styles.titleRow2} width={100} height={30}/>
                      <g transform={'translate(6 7)'}>
                        <rect className={styles.statusOk} width={15} height={15} />
                        <rect className={styles.statusOk} width={15} height={15} transform={'translate(18 0)'}/>
                        <rect className={styles.statusOk} width={15} height={15} transform={'translate(36 0)'}/>
                        <rect className={styles.statusOk} width={15} height={15} transform={'translate(54 0)'}/>  
                      </g>
                      <g transform={'translate(11 20)'}>
                        <text className={styles.boxText} ><tspan>{'1'}</tspan></text>
                        <text className={styles.boxText} transform={'translate(16 0)'}><tspan>{'2'}</tspan></text>
                        <text className={styles.boxText} transform={'translate(34 0)'}><tspan>{'3'}</tspan></text>
                        <text className={styles.boxText} transform={'translate(52 0)'}><tspan>{'4'}</tspan></text>
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

        <Map
          hideHVAC={showHVAC}
        />

      </div>
    );
  }
}
