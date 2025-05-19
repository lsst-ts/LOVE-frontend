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
import { cscText } from 'Utils';
import HeartbeatIcon from 'components/icons/HeartbeatIcon/HeartbeatIcon';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import styles from './CSCDetail.module.css';

export default class CSCDetail extends Component {
  static propTypes = {
    /** Name of the CSC */
    name: PropTypes.string,
    /** Belonging group of the CSC */
    group: PropTypes.string,
    /** Index of the CSC */
    salindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Function to execute when the CSC is clicked
     * It will be called with an object containing the following keys:
     * - group: The group of the CSC
     * - csc: The name of the CSC
     * - salindex: The index of the CSC
     */
    onCSCClick: PropTypes.func,
    /** Heartbeat stream */
    heartbeatData: PropTypes.object,
    /** Summary State stream */
    summaryStateData: PropTypes.object,
    /** Function to subscribe to streams */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams */
    unsubscribeToStreams: PropTypes.func,
    /** Whereas to apply a minWidth */
    embedded: PropTypes.bool,
    /** Make heartbeat display optional  */
    hasHeartbeat: PropTypes.bool,
    /** Whereas to show a warning icon */
    withWarning: PropTypes.bool,
    /** Server time object */
    serverTime: PropTypes.object,
    /** Simulation Mode stream */
    simulationMode: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    group: '',
    onCSCClick: () => {},
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
    embedded: false,
    hasHeartbeat: true,
    withWarning: false,
  };

  static states = {
    0: {
      name: 'UNKNOWN',
      userReadable: 'Unknown',
      char: 'U',
      class: styles.unknown,
    },
    1: {
      name: 'DISABLED',
      userReadable: 'Disabled',
      char: 'D',
      class: styles.disabled,
    },
    2: {
      name: 'ENABLED',
      userReadable: 'Enabled',
      char: 'E',
      class: styles.ok,
    },
    3: {
      name: 'FAULT',
      userReadable: 'Fault',
      char: 'F',
      class: styles.alert,
    },
    4: {
      name: 'OFFLINE',
      userReadable: 'Offline',
      char: 'O',
      class: styles.offline,
    },
    5: {
      name: 'STANDBY',
      userReadable: 'Standby',
      char: 'S',
      class: styles.warning,
    },
  };

  static bigCameraOfflineDetailedStates = {
    0: {
      name: 'UNKNOWN',
      userReadable: 'Unknown',
      char: 'U',
      class: styles.unknown,
    },
    1: {
      name: 'OFFLINE_AVAILABLE',
      userReadable: 'Available',
      char: 'A',
      class: styles.okNoBackground,
    },
    2: {
      name: 'OFFLINE_PUBLISH_ONLY',
      userReadable: 'Publish Only',
      char: 'P',
      class: styles.warningNoBackground,
    },
  };

  componentDidMount = () => {
    const { name, salindex, subscribeToStreams } = this.props;
    subscribeToStreams(name, salindex);
  };

  componentWillUnmount = () => {
    const { name, salindex, unsubscribeToStreams } = this.props;
    unsubscribeToStreams(name, salindex);
  };

  render() {
    const {
      group,
      name,
      salindex,
      summaryStateData,
      heartbeatData,
      onCSCClick,
      embedded,
      hasHeartbeat,
      withWarning,
      serverTime,
      simulationMode,
      offlineDetailedStateData,
    } = this.props;
    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = null;
    let timeDiffText = 'No heartbeat from producer.';

    if (heartbeatData) {
      nLost = heartbeatData.lost;
      if (heartbeatData.last_heartbeat_timestamp === -1) timeDiff = -1;
      else timeDiff = Math.ceil(serverTime.tai * 1000 - heartbeatData.last_heartbeat_timestamp);
      heartbeatStatus = heartbeatData.lost > 0 || timeDiff < 0 ? 'alert' : 'ok';
    }

    if (!hasHeartbeat) {
      heartbeatStatus = 'ok';
    }

    if (timeDiff === -1) {
      timeDiffText = 'Never';
    } else if (timeDiff !== null) {
      timeDiffText = timeDiff < 0 ? 'Stale' : `${timeDiff} seconds ago`;
    }

    let title = `${cscText(name, salindex)} heartbeat\nLost: ${nLost}\n`;
    if (timeDiff === null) {
      title += `${timeDiffText}`;
    } else {
      title += timeDiff < 0 ? `Last seen: ${timeDiffText}` : `${timeDiffText}`;
    }

    const summaryStateValue = summaryStateData ? summaryStateData.summaryState.value : 0;
    const summaryState = CSCDetail.states[summaryStateValue];

    const summaryStateIsUnknown = summaryState === 'UNKNOWN';
    let stateClass = summaryState.class;
    if (heartbeatStatus === 'alert' && !summaryStateIsUnknown) {
      stateClass = styles.alert;
    }
    if (heartbeatStatus === 'unknown' && !summaryStateIsUnknown) {
      stateClass = styles.unknown;
    }

    const isBigCamera = name.search(/[A-Z]{2}Camera/) != -1;
    const offlineDetailedStateValue = offlineDetailedStateData ? offlineDetailedStateData.substate.value : 0;
    const isOffline = summaryState.name === 'OFFLINE';
    const bigCameraOfflineDetailedState = CSCDetail.bigCameraOfflineDetailedStates[offlineDetailedStateValue];

    const heartbeatIsOk = heartbeatStatus === 'ok';
    const isSimulated = simulationMode?.mode.value > 0;
    return (
      <div
        onClick={() => onCSCClick({ group: group, csc: name, salindex: salindex })}
        className={[
          styles.CSCDetailContainer,
          embedded ? styles.minWidth : '',
          isSimulated ? styles.simulated : '',
        ].join(' ')}
      >
        <div className={[styles.summaryStateSection, summaryState.class].join(' ')}>
          <span
            className={styles.summaryState}
            title={[
              summaryState.userReadable,
              isBigCamera && isOffline ? `(${bigCameraOfflineDetailedState.userReadable})` : '',
            ].join(' ')}
          >
            {summaryState.char}
            {isBigCamera && isOffline ? (
              <sup className={[styles.superscript, bigCameraOfflineDetailedState.class].join(' ')}>
                {bigCameraOfflineDetailedState.char}
              </sup>
            ) : (
              ''
            )}
          </span>
        </div>
        <div className={[styles.heartbeatSection, stateClass].join(' ')}>
          <div className={[styles.heartbeatIconWrapper, !hasHeartbeat || heartbeatIsOk ? styles.hidden : ''].join(' ')}>
            <HeartbeatIcon status={heartbeatStatus} title={title} />
          </div>
        </div>

        <div
          className={[styles.nameSection, stateClass].join(' ')}
          title={name + '.' + salindex + (isSimulated ? ' (SIMULATED)' : '')}
        >
          {cscText(name, salindex)}
        </div>

        <div className={[styles.warningIconSection, stateClass].join(' ')}>
          <div className={[styles.warningIconWrapper, !withWarning ? styles.hidden : ''].join(' ')}>
            <WarningIcon title="warning" />
          </div>
        </div>
      </div>
    );
  }
}
