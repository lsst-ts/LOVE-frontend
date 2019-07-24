import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCExpanded.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import InfoIcon from '../../icons/InfoIcon/InfoIcon';
import WarningIcon from '../../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../../icons/ErrorIcon/ErrorIcon';
import Button from '../../GeneralPurpose/Button/Button';

export default class CSCExpanded extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    realm: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    summaryStateData: PropTypes.object,
    logMessageData: PropTypes.array,
  };

  static defaultProps = {
    name: '',
    group: '',
    realm: '',
    data: {},
    onCSCClick: () => 0,
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    summaryStateData: undefined,
    logMessageData: [],
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
    const selfData = this.props.data[this.props.name];
    const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value : 0;
    const summaryState = CSCExpanded.states[summaryStateValue];
    const { props } = this;
    return (
      <div className={styles.CSCExpandedContainer}>
        <div className={styles.topBarContainerWrapper}>
          <div className={styles.topBarContainer}>
            <div className={styles.breadcrumContainer}>
              <div
                className={styles.backArrowIconWrapper}
                onClick={() => this.props.onCSCClick(this.props.realm, this.props.group, this.props.name)}
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
              <span>{props.name} </span>
            </div>
            <div className={[styles.stateContainer].join(' ')}>
              <div>
                <span className={[styles.summaryState, summaryState.class].join(' ')} title={summaryState.userReadable}>
                  {summaryState.name}
                </span>
              </div>
              <div className={styles.heartbeatIconWrapper}>
                <HeartbeatIcon title={`${this.props.name} heartbeat`} status="ok" />
              </div>
            </div>
          </div>
        </div>
        {selfData && selfData.errorCode ? (
          <div className={[styles.logContainer, styles.errorCodeContainer].join(' ')}>
            <div className={styles.logContainerTopBar}>
              <div>ERROR CODE</div>
              <div>
                <Button
                  size="extra-small"
                  onClick={() => this.props.clearCSCErrorCodes(this.props.realm, this.props.group, this.props.name)}
                >
                  CLEAR
                </Button>
              </div>
            </div>
            <div className={[styles.log, styles.messageLogContent].join(' ')}>
              {selfData.errorCode.map((msg) => {
                return (
                  <div key={msg.timestamp} className={styles.logMessage}>
                    <div className={styles.errorCode} title={`Error code ${msg.errorCode}`}>
                      {msg.errorCode}
                    </div>
                    <div className={styles.messageTextContainer}>
                      <div className={styles.timestamp}>{msg.timestamp}</div>
                      <div className={styles.messageText}>{msg.errorReport}</div>
                      <div className={styles.messageTraceback}>{msg.traceback}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className={[styles.logContainer, styles.messageLogContainer].join(' ')}>
          <div className={styles.logContainerTopBar}>
            <div>MESSAGE LOG</div>
            <div>
              <Button
                size="extra-small"
                onClick={() => this.props.clearCSCLogMessages(this.props.realm, this.props.group, this.props.name)}
              >
                CLEAR
              </Button>
            </div>
          </div>
          <div className={styles.filtersContainer}>
            {Object.keys(this.state.messageFilters).map((key) => {
              return (
                <div key={key}>
                  <label>
                    <input
                      onChange={(event) => this.updateFilter(key, event.target.checked)}
                      type="checkbox"
                      alt={`select ${key}`}
                      checked={this.state.messageFilters[key].value}
                    />
                    <span>{this.state.messageFilters[key].name}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <div className={[styles.log, styles.messageLogContent].join(' ')}>
            {this.props.logMessageData.length > 0
              ? this.props.logMessageData.map((msg) => {
                  const filter = this.state.messageFilters[msg.level.value];
                  if (filter && !filter.value) return null;
                  let icon = <span title="Debug">d</span>;
                  if (msg.level.value === 20) icon = <InfoIcon title="Information" />;
                  if (msg.level.value === 30) icon = <WarningIcon title="Warning" />;
                  if (msg.level.value === 40) icon = <ErrorIcon title="Error" />;
                  return (
                    <div key={`${msg.timestamp}-${msg.level.value}`} className={styles.logMessage}>
                      <div className={styles.messageIcon}>{icon}</div>
                      <div className={styles.messageTextContainer}>
                        <div className={styles.timestamp}>{msg.private_rcvStamp.value}</div>
                        <div className={styles.messageText}>{msg.message.value}</div>
                        <div className={styles.messageTraceback}>{msg.traceback.value}</div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
}
