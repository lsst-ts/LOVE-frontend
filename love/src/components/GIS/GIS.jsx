/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { signals, effects, alertSignalIndexes, signalBypassIndexes } from '../../Config';
import GISContainerSignals from './GISContainerDetectionSignals';
import GISContainerEffects from './GISContainerEffectsActuation';
import isEqual from 'lodash/isEqual';
export default class GIS extends Component {
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

  signalOnEnter = (effects) => {
    this.setState({ activeEffects: effects });
  };

  signalOnLeave = () => {
    this.setState({ activeEffects: [] });
  };

  updateInterlockStatuses = () => {
    const { interlocksStatus } = this.props;
    const systemsSignals = Object.entries(signals);
    const rawStatus = interlocksStatus.replace(/\s/g, '').match(/.{1,16}/g);
    const alertEffects = [];
    const alertSignals = [];
    const bypassedAlerts = [];
    systemsSignals.forEach(([system, systemSignals]) => {
      const sSignals = Object.keys(systemSignals);
      sSignals.forEach((signal) => {
        const effects = systemSignals[signal];

        const [systemIndex, bitIndex] = alertSignalIndexes[signal];
        const bitArray = rawStatus[systemIndex].padEnd(16, '0');
        const activeAlert = bitArray[bitIndex] === '1';

        const [bypassSystemIndex, bypassBitIndex] = signalBypassIndexes[signal];
        const bypassBitArray = rawStatus[bypassSystemIndex].padEnd(16, '0');
        const bypassedAlert = bypassBitArray[bypassBitIndex] === '1';

        if (bypassedAlert) {
          bypassedAlerts.push(signal);
        }

        if (activeAlert && !bypassedAlert) {
          alertEffects.push(...effects);
          alertSignals.push(signal);
        }
      });
    });

    this.setState({ alertEffects, alertSignals, bypassedAlerts });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.interlocksStatus && prevProps.interlocksStatus !== this.props.interlocksStatus) {
      this.updateInterlockStatuses();
    }
  };

  componentDidMount = () => {
    this.props.subscribeToStream();
    this.updateInterlockStatuses();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const { activeEffects, alertEffects, alertSignals, bypassedAlerts } = this.state;
    const flattenedSignals = Object.entries(signals);
    const effectsArray = Object.entries(effects);

    return (
      <div className={styles.div}>
        <GISContainerSignals
          signals={flattenedSignals}
          alertSignals={alertSignals}
          bypassedAlerts={bypassedAlerts}
          onHoverIn={(effects) => this.signalOnEnter(effects)}
          onHoverOut={() => this.signalOnLeave()}
        />
        <div className={styles.separator}></div>
        <GISContainerEffects effects={effectsArray} activeEffects={activeEffects} alertEffects={alertEffects} />
      </div>
    );
  }
}
