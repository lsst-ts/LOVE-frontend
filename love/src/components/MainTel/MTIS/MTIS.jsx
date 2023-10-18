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
import styles from './MTIS.module.css';
export default class MTIS extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** The raw status of the interlock
     * It is a string of bit arrays of length 8 separated by spaces. There are 29 bit arrays in total. */
    interlocksStatus: PropTypes.string,
  };

  static defaultProps = {
    interlocksData: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      activeEffects: [],
      alertEffects: [],
      alertSignals: [],
      bypassedAlerts: [],
    };
  }

  flattenMtDome = () => {
    const { mtDome } = this.props;
    //const mtDome = '0010011000001101';
    //const mtDomeSignals = Object.entries();
    //const mtDomeArray = mtDome[0].split("");
    const mtDomeArray = Array.from(String(mtDome), Number);
    return mtDomeArray;
  };

  componentDidUpdate = (prevProps, prevState) => {};

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const {
      mtMountSubcausesEmergencyStop,
      mtMountSubcausesLimitSwitch,
      mtMountSubcausesDeployablePlatform,
      mtMountSubcausesDoorHatchLadder,
      mtMountSubcausesMirrorCover,
      mtMountSubcausesLockingPin,
      mtMountSubcausesCapacitorDoor,
      mtMountSubcausesBrakesFailed,
      mtM1m3HeartbeatStateOutputMismatch,
      mtM1m3AuxPowerNetworksOff,
      mtM1m3ThermalEquipmentOff,
      mtM1m3AirSupplyOff,
      mtM1m3TmaMotionStop,
      mtM1m3GisHeartbeatLost,
      mtM1m3CabinetDoorOpen,
    } = this.props;

    const mtDome = this.flattenMtDome();

    return (
      <div className={styles.h3}>
        <h3>Simonyi Interlock Signals</h3>
        <div className={styles.div2}>
          <div className={styles.system}>
            <h3>MTMount</h3>
            <div className={[styles.signal, mtMountSubcausesEmergencyStop ? styles.alert : ''].join(' ')}>
              Emergency Stop Buttons
            </div>
            <div className={[styles.signal, mtMountSubcausesLimitSwitch ? styles.alert : ''].join(' ')}>
              Limit Switches
            </div>
            <div className={[styles.signal, mtMountSubcausesDeployablePlatform ? styles.alert : ''].join(' ')}>
              Platform Switches
            </div>
            <div className={[styles.signal, mtMountSubcausesDoorHatchLadder ? styles.alert : ''].join(' ')}>
              Door, Hatch, and Ladder status
            </div>
            <div className={[styles.signal, mtMountSubcausesMirrorCover ? styles.alert : ''].join(' ')}>
              Mirror Cover Power off switches
            </div>
            <div className={[styles.signal, mtMountSubcausesLockingPin ? styles.alert : ''].join(' ')}>
              Locking Pin Positions
            </div>
            <div className={[styles.signal, mtMountSubcausesCapacitorDoor ? styles.alert : ''].join(' ')}>
              Phase Capacitator bank doors
            </div>
            <div className={[styles.signal, mtMountSubcausesBrakesFailed ? styles.alert : ''].join(' ')}>
              Brakes that failed
            </div>
          </div>
          <div className={styles.system}>
            <h3>MTDome</h3>
            {Object.keys(mtDome).map((mtDomeSignal) => {
              return (
                <div className={[styles.signal, mtDome[mtDomeSignal] ? styles.alert : ''].join(' ')}>
                  {'Signal ' + mtDomeSignal}
                </div>
              );
            })}
          </div>
          <div className={styles.system}>
            <h3>MTM1M3</h3>
            <div className={[styles.signal, mtM1m3HeartbeatStateOutputMismatch ? styles.alert : ''].join(' ')}>
              Heartbeat Output Mismatch
            </div>
            <div className={[styles.signal, mtM1m3AuxPowerNetworksOff ? styles.alert : ''].join(' ')}>
              Aux Power Networks Off
            </div>
            <div className={[styles.signal, mtM1m3ThermalEquipmentOff ? styles.alert : ''].join(' ')}>
              Thermal Equimpent Off
            </div>
            <div className={[styles.signal, mtM1m3AirSupplyOff ? styles.alert : ''].join(' ')}>Air Supply Off</div>
            <div className={[styles.signal, mtM1m3TmaMotionStop ? styles.alert : ''].join(' ')}>TMA Motion Stop</div>
            <div className={[styles.signal, mtM1m3GisHeartbeatLost ? styles.alert : ''].join(' ')}>
              GIS Heartbeat Lost
            </div>
            <div className={[styles.signal, mtM1m3CabinetDoorOpen ? styles.alert : ''].join(' ')}>
              Cabinet Door Open
            </div>
          </div>
        </div>
      </div>
    );
  }
}
