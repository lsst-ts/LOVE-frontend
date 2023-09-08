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
import { cscText } from 'Utils';
import HeartbeatIcon from 'components/icons/HeartbeatIcon/HeartbeatIcon';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import styles from './CSCDetail.module.css';

export default class CSCDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    salindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    heartbeatData: PropTypes.object,
    summaryStateData: PropTypes.object,
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    embedded: PropTypes.bool,
    /* Whether the component should subscribe to streams*/
    shouldSubscribe: PropTypes.bool,
    isRaw: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    group: '',
    data: {},
    onCSCClick: () => 0,
    heartbeatData: null,
    summaryStateData: undefined,
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
    embedded: false,
    shouldSubscribe: true,
    isRaw: false,
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
    this.props.subscribeToStreams(this.props.name, this.props.salindex);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams(this.props.name, this.props.salindex);
  };

  render() {
    const { props } = this;
    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = null;
    let timeDiffText = 'No heartbeat from producer.';

    if (this.props.heartbeatData) {
      nLost = this.props.heartbeatData.lost;
      if (this.props.heartbeatData.last_heartbeat_timestamp === -1) timeDiff = -1;
      else timeDiff = Math.ceil(props.serverTime.tai * 1000 - this.props.heartbeatData.last_heartbeat_timestamp);
      heartbeatStatus = this.props.heartbeatData.lost > 0 || timeDiff < 0 ? 'alert' : 'ok';
    }
    if (props.hasHeartbeat === false) {
      heartbeatStatus = 'ok';
    }

    if (timeDiff === -1) {
      timeDiffText = 'Never';
    } else if (timeDiff !== null) {
      timeDiffText = timeDiff < 0 ? 'Stale' : `${timeDiff} seconds ago`;
    }

    let title = `${cscText(this.props.name, this.props.salindex)} heartbeat\nLost: ${nLost}\n`;

    if (timeDiff === null) {
      title += `${timeDiffText}`;
    } else {
      title += timeDiff < 0 ? `Last seen: ${timeDiffText}` : `${timeDiffText}`;
    }
    const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value : 0;
    const summaryState = CSCDetail.states[summaryStateValue];
    let stateClass = heartbeatStatus === 'alert' ? styles.alert : summaryState.class;
    if (heartbeatStatus === 'unknown') stateClass = CSCDetail.states[0].class;
    if (summaryState.name === 'UNKNOWN') stateClass = CSCDetail.states[0].class;
    return (
      <div
        onClick={() => this.props.onCSCClick({ group: props.group, csc: props.name, salindex: props.salindex })}
        className={[styles.CSCDetailContainer, this.props.embedded ? styles.minWidth : ''].join(' ')}
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
              heartbeatStatus === 'ok' && props.hasHeartbeat !== false ? styles.hidden : '',
            ].join(' ')}
          >
            <HeartbeatIcon
              status={heartbeatStatus === 'alert' || props.hasHeartbeat === false ? 'unknown' : heartbeatStatus}
              title={title}
            />
          </div>
        </div>

        <div className={[styles.nameSection, stateClass].join(' ')} title={this.props.name + '.' + this.props.salindex}>
          {cscText(this.props.name, this.props.salindex)}
        </div>

        <div className={[styles.warningIconSection, stateClass].join(' ')}>
          <div className={[styles.warningIconWrapper, props.withWarning !== true ? styles.hidden : ''].join(' ')}>
            <WarningIcon title="warning" />
          </div>
        </div>
      </div>
    );
  }
}
