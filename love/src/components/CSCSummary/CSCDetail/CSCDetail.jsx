import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCDetail.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';

export default class CSCDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    realm: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    group: '',
    realm: '',
    data: {},
    onCSCClick: () => 0,
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

  shouldComponentUpdate = (nextProps) => {
    const selfData = nextProps.data[nextProps.name];
    const oldSelfData = this.props.data[this.props.name];
    const oldSummaryStateValue = oldSelfData && oldSelfData.summaryState ? oldSelfData.summaryState.summaryState : 0;
    const summaryStateValue = selfData && selfData.summaryState ? selfData.summaryState.summaryState : 0;

    const oldHeartbeatValue = oldSelfData && oldSelfData.heartbeat ? oldSelfData.heartbeat.lost : 0;
    const heartbeatValue = selfData && selfData.heartbeat ? selfData.heartbeat.lost : 0;
    return (
      this.props.name !== nextProps.name ||
      oldSummaryStateValue !== summaryStateValue ||
      oldHeartbeatValue !== heartbeatValue
    );
  };

  render() {
    const selfData = this.props.data[this.props.name];
    const summaryStateValue = selfData && selfData.summaryState ? selfData.summaryState.summaryState : 0;
    const summaryState = CSCDetail.states[summaryStateValue];
    const { props } = this;
    const hearbeatAvailable = selfData && selfData.heartbeat;
    let heartbeatStatus = 'unknown';
    let lost = 0;
    let timeDiff = -1;
    if (hearbeatAvailable) heartbeatStatus = selfData.heartbeat.lost > 0 ? 'alert' : 'ok';
    if (hearbeatAvailable) lost = selfData.heartbeat.lost;
    if (hearbeatAvailable) {
      if (selfData.heartbeat.last_heartbeat_timestamp < 0) timeDiff = -1;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - selfData.heartbeat.last_heartbeat_timestamp);
    }
    const timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;
    return (
      <div
        onClick={() => this.props.onCSCClick(props.realm, props.group, props.name)}
        className={styles.CSCDetailContainer}
      >
        <div className={[styles.leftSection, summaryState.class].join(' ')}>
          <span className={styles.summaryState} title={summaryState.userReadable}>
            {summaryState.char}
          </span>
        </div>
        <div className={styles.middleSection} title={this.props.name}>
          {this.props.name}
        </div>
        <div className={styles.rightSection}>
          <div className={styles.heartbeatIconWrapper}>
            <HeartbeatIcon
              status={heartbeatStatus}
              title={`${this.props.name} heartbeat\nLost: ${lost}\nLast seen: ${timeDiffText}`}
            />
          </div>
        </div>
      </div>
    );
  }
}
