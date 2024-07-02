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
  };

  static defaultProps = {
    name: '',
    group: '',
    onCSCClick: () => {},
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
    embedded: false,
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
    if (hasHeartbeat === false) {
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
    let stateClass = heartbeatStatus === 'alert' ? styles.alert : summaryState.class;
    if (heartbeatStatus === 'unknown') stateClass = CSCDetail.states[0].class;
    if (summaryState.name === 'UNKNOWN') stateClass = CSCDetail.states[0].class;
    return (
      <div
        onClick={() => onCSCClick({ group: group, csc: name, salindex: salindex })}
        className={[styles.CSCDetailContainer, embedded ? styles.minWidth : ''].join(' ')}
      >
        <div className={[styles.summaryStateSection, summaryState.class].join(' ')}>
          <span className={styles.summaryState} title={summaryState.userReadable}>
            {summaryState.char}
          </span>
        </div>
        <div className={[styles.heartbeatSection, stateClass].join(' ')}>
          <div
            className={[
              styles.heartbeatIconWrapper,
              heartbeatStatus === 'ok' && hasHeartbeat !== false ? styles.hidden : '',
            ].join(' ')}
          >
            <HeartbeatIcon
              status={heartbeatStatus === 'alert' || hasHeartbeat === false ? 'unknown' : heartbeatStatus}
              title={title}
            />
          </div>
        </div>

        <div className={[styles.nameSection, stateClass].join(' ')} title={name + '.' + salindex}>
          {cscText(name, salindex)}
        </div>

        <div className={[styles.warningIconSection, stateClass].join(' ')}>
          <div className={[styles.warningIconWrapper, withWarning !== true ? styles.hidden : ''].join(' ')}>
            <WarningIcon title="warning" />
          </div>
        </div>
      </div>
    );
  }
}
