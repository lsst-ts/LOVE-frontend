/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import styles from './GIS.module.css';

export default class GISContainerDetectionSignals extends Component {
  static propTypes = {
    /** Array of signals to be rendered */
    signals: PropTypes.array,
    /** Array of triggered signals (alarms) */
    alertSignals: PropTypes.array,
    /** Callback for hover on specific signal */
    onHoverIn: PropTypes.func,
    /** Callback for hover out of any signal */
    onHoverOut: PropTypes.func,
  };

  render() {
    const { alertSignals, bypassedAlerts } = this.props;

    return (
      <div className={styles.div2}>
        <h3 className={styles.h3}>Detection Signals</h3>
        {this.props.signals.map(([system, signals]) => {
          const systemSignals = Object.keys(signals);
          return (
            <div
              key={`system-${system}`}
              className={[
                styles.system,
                systemSignals.some((signal) => alertSignals.includes(signal)) ? styles.alertSystem : '',
              ].join(' ')}
            >
              <h3>{system}</h3>
              {Object.keys(signals).map((signal) => {
                return (
                  <div
                    key={`signal-${signal}`}
                    onMouseEnter={() => this.props.onHoverIn(signals[signal])}
                    onMouseLeave={() => this.props.onHoverOut()}
                    className={[styles.signal, alertSignals.includes(signal) ? styles.alert : ''].join(' ')}
                  >
                    <div className={bypassedAlerts.includes(signal) ? styles.inactive : ''}>{signal}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
