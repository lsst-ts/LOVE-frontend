import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCExpanded.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import InfoIcon from '../../icons/InfoIcon/InfoIcon';
import WarningIcon from '../../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../../icons/ErrorIcon/ErrorIcon';

export default class CSCExpanded extends Component {
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

  render() {
    const selfData = this.props.data[this.props.name];
    const summaryStateValue = selfData ? selfData.summaryState : 0;
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
                {' '}
                <BackArrowIcon />
              </div>
              <span
                className={styles.breadcrumbGroup}
                onClick={() => this.props.onCSCClick(this.props.realm, this.props.group, this.props.name)}
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
                <HeartbeatIcon status="alert" />
              </div>
            </div>
          </div>
        </div>
        <div className={[styles.logContainer, styles.errorCodeContainer].join(' ')}>
          <details>
            <summary>ERROR CODE</summary>
            <div className={[styles.log, styles.errorCodeContent].join(' ')}>ERROR CODE</div>
          </details>
        </div>
        <div className={[styles.logContainer, styles.messageLogContainer].join(' ')}>
          <details open>
            <summary>MESSAGE LOG</summary>
            <div className={[styles.log, styles.messageLogContent].join(' ')}>
              {selfData && selfData.logMessage
                ? selfData.logMessage.map((msg) => {
                  let icon = '';
                  if (msg.level === 20) icon = <InfoIcon />;
                  if (msg.level === 30) icon = <WarningIcon />;
                  if (msg.level === 40) icon = <ErrorIcon />;
                  return (
                    <div key={msg.message} className={styles.logMessage}>
                      <div className={styles.messageIcon}>{icon}</div>
                      <div>
                        <div className={styles.messageText}>{msg.message}</div>
                        <div className={styles.messageTraceback}>{msg.traceback}</div>
                      </div>
                    </div>
                  );
                })
                : null}
            </div>
          </details>
        </div>
      </div>
    );
  }
}
