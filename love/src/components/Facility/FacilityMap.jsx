import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import { M1M3ActuatorPositions } from 'Config';
import styles from './FacilityMap.module.css';
import Badge from '../GeneralPurpose/Badge/Badge';
import Map from './Map/Map.jsx'


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
          <div>
            Legend
          </div>
        </div>

        <Map

        hideHVAC={showHVAC}

        />

      </div>
    );
  }
}
