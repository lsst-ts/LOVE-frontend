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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCExpanded.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import Button from '../../GeneralPurpose/Button/Button';
import LogMessageDisplay from '../../GeneralPurpose/LogMessageDisplay/LogMessageDisplay';
import Select from '../../GeneralPurpose/Select/Select';
import WarningIcon from '../../icons/WarningIcon/WarningIcon';
import { cscText, formatTimestamp } from '../../../Utils';

export default class CSCExpanded extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      summaryStateCommand: null,
      configurationOverride: '',
      logLevel: 20,
    };
  }

  static propTypes = {
    name: PropTypes.string,
    salindex: PropTypes.number,
    group: PropTypes.string,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    requestSALCommand: PropTypes.func,
    summaryStateData: PropTypes.object,
    logMessageData: PropTypes.array,
    errorCodeData: PropTypes.array,
    softwareVersions: PropTypes.object,
    configurationsAvailable: PropTypes.object,
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    summaryStateCommand: PropTypes.string,
    cscLogLevelData: PropTypes.number,
  };

  static defaultProps = {
    name: '',
    salindex: undefined,
    group: '',
    onCSCClick: () => 0,
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    requestSALCommand: () => 0,
    summaryStateData: undefined,
    softwareVersions: undefined,
    configurationsAvailable: undefined,
    logMessageData: [],
    errorCodeData: [],
    summaryStateCommand: undefined,
    cscLogLevelData: undefined,
  };

  componentDidMount = () => {
    this.props.subscribeToStreams(this.props.name, this.props.salindex);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams(this.props.name, this.props.salindex);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.name !== this.props.name || prevProps.salindex !== this.props.salindex) {
      this.props.unsubscribeToStreams(prevProps.name, prevProps.salindex);
      this.props.subscribeToStreams(this.props.name, this.props.salindex);
    }
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

  static validLogLevel = {
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50,
  };

  static logLevelNames = {
    10: 'DEBUG',
    20: 'INFO',
    30: 'WARNING',
    40: 'ERROR',
    50: 'CRITICAL',
  };

  static validState = {
    start: 'STANDBY',
    enable: 'DISABLED',
    disable: 'ENABLED',
    standby: 'DISABLED or FAULT',
  };

  setSummaryStateCommand(option) {
    const { configurationOverride } = this.state;
    this.setState({
      summaryStateCommand: option,
      configurationOverride: configurationOverride,
    });
  }

  setLogLevel(option) {
    this.setState({
      logLevel: CSCExpanded.validLogLevel[option],
    });
  }

  setConfigurationOverride(option) {
    const { summaryStateCommand } = this.state;
    this.setState({
      summaryStateCommand: summaryStateCommand,
      configurationOverride: option,
    });
  }

  sendSummaryStateCommand(event) {
    this.props.requestSALCommand({
      cmd: `cmd_${this.state.summaryStateCommand}`,
      csc: this.props.name,
      salindex: this.props.salindex,
      params:
        this.state.summaryStateCommand === 'start'
          ? {
              configurationOverride: this.state.configurationOverride,
            }
          : {},
    });
  }

  sendSetLogLevel(event) {
    this.props.requestSALCommand({
      cmd: 'cmd_setLogLevel',
      csc: this.props.name,
      salindex: this.props.salindex,
      params: {
        level: this.state.logLevel,
      },
    });
  }

  render() {
    const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value : 0;
    const cscVersion = this.props.softwareVersions ? this.props.softwareVersions.cscVersion.value : 'Unknown';
    const xmlVersion = this.props.softwareVersions ? this.props.softwareVersions.xmlVersion.value : 'Unknown';
    const salVersion = this.props.softwareVersions ? this.props.softwareVersions.salVersion.value : 'Unknown';
    const openSpliceVersion = this.props.softwareVersions
      ? this.props.softwareVersions.openSpliceVersion.value
      : 'Unknown';
    const configurationsAvailable = this.props.configurationsAvailable
      ? this.props.configurationsAvailable.overrides.value.split(',')
      : null;
    const summaryState = CSCExpanded.states[summaryStateValue];
    const cscLogLevel = this.props.cscLogLevelData ? this.props.cscLogLevelData.level.value : null;

    const configurationApplied = this.props.configurationApplied?.configurations.value;
    const configurationVersion = this.props.configurationApplied?.version.value;
    const configurationUrl = this.props.configurationApplied?.url.value;
    const configurationSchemaVersion = this.props.configurationApplied?.schemaVersion.value;
    const configurationOtherInfo = this.props.configurationApplied?.otherInfo.value.replaceAll(',', ', ');

    const configurationsAvailableMenuOptions =
      configurationsAvailable !== null && configurationsAvailable.length > 0
        ? [...[''], ...configurationsAvailable]
        : null;

    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = -1;
    if (this.props.heartbeatData) {
      nLost = this.props.heartbeatData.lost;
      if (this.props.heartbeatData.last_heartbeat_timestamp < 0) timeDiff = -1;
      if (this.props.heartbeatData.last_heartbeat_timestamp === -2) timeDiff = -2;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - this.props.heartbeatData.last_heartbeat_timestamp);
      heartbeatStatus = this.props.heartbeatData.lost > 0 || timeDiff < 0 ? 'alert' : 'ok';
    }

    let timeDiffText = 'Unknown';

    if (timeDiff === -2) {
      timeDiffText = 'No heartbeat event in Remote.';
    } else if (timeDiff === -1) {
      timeDiffText = 'XXX - Never';
    } else if (timeDiff >= 0) {
      timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;
    }

    let heartbeatTitle = `${cscText(this.props.name, this.props.salindex)} heartbeat\nLost: ${nLost}\n`;

    if (timeDiff === -2) {
      heartbeatTitle += `${timeDiffText}`;
    } else {
      heartbeatTitle += `Last seen: ${timeDiffText}`;
    }

    return (
      <div className={styles.CSCGroupContainer}>
        <div className={styles.CSCExpandedContainer}>
          <div className={styles.topBarContainerWrapper}>
            <div className={styles.topBarContainer}>
              <div className={styles.breadcrumContainer}>
                {this.props.group && (
                  <>
                    <div
                      className={styles.backArrowIconWrapper}
                      onClick={() => this.props.onCSCClick({ group: this.props.group })}
                    >
                      <BackArrowIcon />
                    </div>
                    <span
                      className={styles.breadcrumbGroup}
                      onClick={() => this.props.onCSCClick({ group: this.props.group, csc: 'all' })}
                    >
                      {this.props.group}
                    </span>
                    <span> &#62; </span>
                  </>
                )}
                {!this.props.hideTitle && <span>{cscText(this.props.name, this.props.salindex)}</span>}
              </div>
              {this.props.displaySummaryState && (
                <div className={[styles.stateContainer].join(' ')}>
                  <div>
                    <span
                      className={[styles.summaryState, summaryState.class].join(' ')}
                      title={summaryState.userReadable}
                    >
                      {summaryState.name}
                    </span>
                  </div>
                  <div className={styles.heartbeatIconWrapper}>
                    <HeartbeatIcon className={styles.heartbeatIcon} status={heartbeatStatus} title={heartbeatTitle} />
                  </div>
                </div>
              )}
            </div>
          </div>
          {this.props.name !== 'Script' && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>
                    Software Versions: csc={cscVersion}, xml={xmlVersion}, sal={salVersion}, openSplice=
                    {openSpliceVersion}
                  </div>
                </div>
              </div>
            </div>
          )}
          {this.props.name !== 'Script' && this.props.configurationApplied && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>
                    Configurations applied: configuration={configurationApplied}, version={configurationVersion},
                    schema={configurationSchemaVersion}, url=
                    <a target="_blank" href={configurationUrl}>
                      {configurationUrl}
                    </a>
                  </div>
                  {/* <div className={styles.titlePadding}>
                    Configurations applied other info: {configurationOtherInfo}
                  </div> */}
                </div>
              </div>
            </div>
          )}
          {this.props.name !== 'Script' && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>Select State transition Command:</div>
                  <Select
                    options={['start', 'enable', 'disable', 'standby']}
                    onChange={(option) => this.setSummaryStateCommand(option.value)}
                    value=""
                    placeholder="Select state"
                  />
                </div>
                {configurationsAvailableMenuOptions !== null && this.state.summaryStateCommand === 'start' && (
                  <div className={styles.breadcrumContainer}>
                    <div className={styles.titlePadding}>Configurations available:</div>
                    <Select
                      options={configurationsAvailableMenuOptions}
                      onChange={(option) => this.setConfigurationOverride(option.value)}
                      value=""
                      placeholder="Select override"
                    />
                  </div>
                )}
                <div>
                  <br />
                  <Button
                    title="set state"
                    status="info"
                    shape="rounder"
                    padding="30px"
                    disabled={this.state.summaryStateCommand === null}
                    onClick={(event) => {
                      this.sendSummaryStateCommand(event);
                    }}
                    command
                  >
                    SEND
                  </Button>
                </div>
              </div>
            </div>
          )}

          {this.state.summaryStateCommand !== null && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>
                    <span className={styles.warningText}>
                      <span className={styles.warningIcon}>
                        <WarningIcon></WarningIcon>
                      </span>
                      <span>CSC must be in {CSCExpanded.validState[this.state.summaryStateCommand]}.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(cscLogLevel !== null || this.props.name === 'Script') && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>Set Log Level:</div>
                  <Select
                    options={['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']}
                    onChange={(option) => this.setLogLevel(option.value)}
                    value={cscLogLevel ? CSCExpanded.logLevelNames[cscLogLevel] : 'INFO'}
                    placeholder="Select log Level"
                  />
                </div>
                {cscLogLevel !== null && (
                  <div className={styles.breadcrumContainer}>
                    <div className={styles.titlePadding}>
                      Current log level: {CSCExpanded.logLevelNames[cscLogLevel]}
                    </div>
                  </div>
                )}
                <div>
                  <br />
                  <Button
                    title="set log level"
                    status="info"
                    shape="rounder"
                    padding="30px"
                    disabled={false}
                    onClick={(event) => {
                      this.sendSetLogLevel(event);
                    }}
                    command
                  >
                    SEND
                  </Button>
                </div>
              </div>
            </div>
          )}

          {this.props.errorCodeData.length > 0 && (
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
                {this.props.errorCodeData.map((msg, index) => {
                  return (
                    <div key={`${msg.private_rcvStamp.value}-${index}`} className={styles.logMessage}>
                      <div className={styles.errorCode} title={`Error code ${msg.errorCode.value}`}>
                        {msg.errorCode.value}
                      </div>
                      <div className={styles.messageTextContainer}>
                        <div className={styles.timestamp} title="private_rcvStamp">
                          {formatTimestamp(msg.private_rcvStamp.value * 1000)}
                        </div>
                        <pre className={styles.preText}>{msg.errorReport.value}</pre>
                        <pre className={styles.preText}>{msg.traceback.value}</pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <LogMessageDisplay
            logMessageData={this.props.logMessageData}
            clearCSCLogMessages={() => this.props.clearCSCLogMessages(this.props.name, this.props.salindex)}
          />
        </div>
      </div>
    );
  }
}
