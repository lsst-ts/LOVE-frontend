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
      alarms: [],
    };
  }
  render() {

    return (
      <div className={styles.content}>

        <div className={styles.leftMenu}>

          <div className={styles.cscMenu}>
            <h3 className={styles.h3}>CSC</h3>
            <div className={styles.section}>
              <div>
                HVAC
              </div>
              <div>
                eye
              </div>
            </div>
            <div>Power</div>
          </div>
          <div>
            Legend
          </div>
        </div>

        <Map />

      </div>
    );
  }
}
