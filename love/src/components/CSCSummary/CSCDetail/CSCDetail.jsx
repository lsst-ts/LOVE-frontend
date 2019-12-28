import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCDetail.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';
import { cscText } from '../../../Utils';

export default class CSCDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    realm: PropTypes.string,
    salindex: PropTypes.number,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    heartbeatData: PropTypes.object,
    summaryStateData: PropTypes.object,
    subscribeToStreams: PropTypes.func,
    embedded: PropTypes.bool,
    /* Whether the component should subscribe to streams*/
    shouldSubscribe: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    group: '',
    realm: '',
    data: {},
    onCSCClick: () => 0,
    heartbeatData: null,
    summaryStateData: undefined,
    subscribeToStreams: () => {},
    embedded: false,
    shouldSubscribe: true,
  };

  static states = {
    0: {
      name: 'UNKNOWN',
      userReadable: 'Unknown',
      char: 'U',
      class: styles.disabled,
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
      class: styles.disabled,
    },
    5: {
      name: 'STANDBY',
      userReadable: 'Standby',
      char: 'S',
      class: styles.warning,
    },
  };

  componentDidMount = () => {
    if (!this.props.shouldSubscribe) this.props.subscribeToStreams(this.props.name, this.props.salindex);
  };

  render() {
    const { props } = this;
    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = -1;
    if (this.props.heartbeatData) {
      nLost = this.props.heartbeatData.lost;
      if (this.props.heartbeatData.last_heartbeat_timestamp === -1) timeDiff = -1;
      if (this.props.heartbeatData.last_heartbeat_timestamp === -2) timeDiff = -2;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - this.props.heartbeatData.last_heartbeat_timestamp);
      heartbeatStatus = this.props.heartbeatData.lost > 0 || timeDiff < 0 ? 'alert' : 'ok';
    }

    let timeDiffText = 'Unknown';

    if (timeDiff === -2) {
      timeDiffText = 'No heartbeat event in Remote.';
    } else if (timeDiff === -1) {
      timeDiffText = 'Never';
    } else if (timeDiff >= 0) {
      timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;
    }

    let title = `$${cscText(this.props.name, this.props.salindex)} heartbeat\nLost: ${nLost}\n`;

    if (timeDiff === -2) {
      title += `${timeDiffText}`;
    } else {
      title += `Last seen: ${timeDiffText}`;
    }
    const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value : 0;
    const summaryState = CSCDetail.states[summaryStateValue];
    const stateClass = heartbeatStatus === 'alert' ? styles.alert : summaryState.class;
    return (
      <div
        onClick={() => this.props.onCSCClick(props.realm, props.group, props.name, props.salindex)}
        className={[styles.CSCDetailContainer, this.props.embedded ? styles.minWidth : ''].join(' ')}
      >
        <div className={[styles.summaryStateSection, stateClass].join(' ')}>
          <span className={styles.summaryState} title={summaryState.userReadable}>
            {summaryState.char}
          </span>
        </div>
        <div className={[styles.heartbeatSection, stateClass].join(' ')}>
          <div className={[styles.heartbeatIconWrapper, heartbeatStatus === 'ok' ? styles.hidden : ''].join(' ')}>
            <HeartbeatIcon status={heartbeatStatus === 'alert' ? 'unknown' : heartbeatStatus} title={title} />
          </div>
        </div>
        <div className={[styles.nameSection, stateClass].join(' ')} title={this.props.name + '.' + this.props.salindex}>
          {cscText(this.props.name, this.props.salindex)}
        </div>
      </div>
    );
  }
}
