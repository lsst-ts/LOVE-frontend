import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCExpanded.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import InfoIcon from '../../icons/InfoIcon/InfoIcon';
import WarningIcon from '../../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../../icons/ErrorIcon/ErrorIcon';
import Button from '../../GeneralPurpose/Button/Button';
import LogMessageDisplay from '../../GeneralPurpose/LogMessageDisplay/LogMessageDisplay';

export default class CSCExpanded extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    salindex: PropTypes.number,
    group: PropTypes.string,
    realm: PropTypes.string,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    summaryStateData: PropTypes.object,
    logMessageData: PropTypes.array,
    errorCodeData: PropTypes.array,
  };

  static defaultProps = {
    name: '',
    salindex: undefined,
    group: '',
    realm: '',
    onCSCClick: () => 0,
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    summaryStateData: undefined,
    logMessageData: [],
    errorCodeData: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      messageFilters: {
        10: { value: true, name: 'Debug' },
        20: { value: true, name: 'Info' },
        30: { value: true, name: 'Warning' },
        40: { value: true, name: 'Error' },
      },
    };
  }

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

  updateFilter = (key, value) => {
    const filters = this.state.messageFilters;
    filters[key].value = value;
    this.setState({
      messageFilters: { ...filters },
    });
  };

  render() {
    const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value : 0;
    const summaryState = CSCExpanded.states[summaryStateValue];
    const { props } = this;

    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = -1;
    if (this.props.heartbeatData) {
      nLost = this.props.heartbeatData.lost;
      if (this.props.heartbeatData.last_heartbeat_timestamp < 0) timeDiff = -1;
      if (this.props.heartbeatData.last_heartbeat_timestamp == -2) timeDiff = -2;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - this.props.heartbeatData.last_heartbeat_timestamp);
      heartbeatStatus = this.props.heartbeatData.lost > 0 || timeDiff < 0 ? 'alert' : 'ok';
    }

    let timeDiffText = 'Unknown';

    if (timeDiff == -2) {
      timeDiffText = 'No heartbeat event in Remote.';
    } else if (timeDiff == -1) {
      timeDiffText = 'Never';
    } else if (timeDiff >= 0) {
      timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;
    }

    let heartbeatTitle = `${this.props.name +
      '-' +
      this.props.salindex} heartbeat\nLost: ${nLost}\nLast seen: ${timeDiffText}`;
    if (timeDiff == -2) {
      heartbeatTitle = `${this.props.name + '-' + this.props.salindex} heartbeat\n${timeDiffText}`;
    }

    return (
      <div className={styles.CSCExpandedContainer}>
        <div className={styles.topBarContainerWrapper}>
          <div className={styles.topBarContainer}>
            <div className={styles.breadcrumContainer}>
              <div
                className={styles.backArrowIconWrapper}
                onClick={() =>
                  this.props.onCSCClick(this.props.realm, this.props.group, this.props.name, this.props.salindex)
                }
              >
                <BackArrowIcon />
              </div>
              <span
                className={styles.breadcrumbGroup}
                onClick={() => this.props.onCSCClick(this.props.realm, this.props.group, 'all')}
              >
                {props.group}{' '}
              </span>
              <span>&#62; </span>
              <span>
                {props.name}-{props.salindex}
              </span>
            </div>
            <div className={[styles.stateContainer].join(' ')}>
              <div>
                <span className={[styles.summaryState, summaryState.class].join(' ')} title={summaryState.userReadable}>
                  {summaryState.name}
                </span>
              </div>
              <div className={styles.heartbeatIconWrapper}>
                <HeartbeatIcon status={heartbeatStatus} title={heartbeatTitle} />
              </div>
            </div>
          </div>
        </div>
        {this.props.errorCodeData.length > 0 ? (
          <div className={[styles.logContainer, styles.errorCodeContainer].join(' ')}>
            <div className={styles.logContainerTopBar}>
              <div>ERROR CODE</div>
              <div>
                <Button
                  size="extra-small"
                  onClick={() => this.props.clearCSCErrorCodes(this.props.name, this.props.salindex)}
                >
                  CLEAR
                </Button>
              </div>
            </div>
            <div className={[styles.log, styles.messageLogContent].join(' ')}>
              {this.props.errorCodeData.map((msg) => {
                return (
                  <div key={msg.private_rcvStamp.value} className={styles.logMessage}>
                    <div className={styles.errorCode} title={`Error code ${msg.errorCode.value}`}>
                      {msg.errorCode.value}
                    </div>
                    <div className={styles.messageTextContainer}>
                      <div className={styles.timestamp} title="private_rcvStamp">
                        {new Date(msg.private_rcvStamp.value * 1000).toUTCString()}
                      </div>
                      <div className={styles.messageText}>{msg.errorReport.value}</div>
                      <div className={styles.messageTraceback}>{msg.traceback.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <LogMessageDisplay
          logMessageData={this.props.logMessageData}
          clearCSCLogMessages={() => this.props.clearCSCLogMessages(this.props.name, this.props.salindex)}
        />
      </div>
    );
  }
}
