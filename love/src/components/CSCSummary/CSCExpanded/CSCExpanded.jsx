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
import HeartbeatIcon from 'components/icons/HeartbeatIcon/HeartbeatIcon';
import BackArrowIcon from 'components/icons/BackArrowIcon/BackArrowIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import LogMessageDisplay from 'components/GeneralPurpose/LogMessageDisplay/LogMessageDisplay';
import Select from 'components/GeneralPurpose/Select/Select';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import { cscText, formatTimestamp } from 'Utils';
import styles from './CSCExpanded.module.css';

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
    /** Name of the CSC */
    name: PropTypes.string,
    /** Index of the CSC */
    salindex: PropTypes.number,
    /** Belonging group of the CSC */
    group: PropTypes.string,
    /** Function to execute when the CSC is clicked
     * It will be called with an object containing the following keys:
     * - group: The group of the CSC
     * - csc: The name of the CSC
     * - salindex: The index of the CSC
     */
    onCSCClick: PropTypes.func,
    /** Function to clear the error codes */
    clearCSCErrorCodes: PropTypes.func,
    /** Function to clear the log messages */
    clearCSCLogMessages: PropTypes.func,
    /** Function to send SAL commands */
    requestSALCommand: PropTypes.func,
    /** Summary State stream */
    summaryStateData: PropTypes.object,
    /** Log Messages array */
    logMessageData: PropTypes.array,
    /** Error code array */
    errorCodeData: PropTypes.array,
    /** Software versions stream */
    softwareVersions: PropTypes.object,
    /** Configuration applied stream */
    configurationsAvailable: PropTypes.object,
    /** CSC Log Level stream */
    cscLogLevelData: PropTypes.object,
    /** Simulation Mode stream */
    simulationMode: PropTypes.object,
    /** Function to subscribe to streams */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams */
    unsubscribeToStreams: PropTypes.func,
    /** Whether to display the summary state */
    displaySummaryState: PropTypes.bool,
    /** Whether to display the title of  */
    hideTitle: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    salindex: undefined,
    group: '',
    onCSCClick: () => {},
    clearCSCErrorCodes: () => {},
    clearCSCLogMessages: () => {},
    requestSALCommand: () => {},
    logMessageData: [],
    errorCodeData: [],
  };

  componentDidMount = () => {
    const { name, salindex, subscribeToStreams } = this.props;
    subscribeToStreams(name, salindex);
  };

  componentWillUnmount = () => {
    const { name, salindex, unsubscribeToStreams } = this.props;
    unsubscribeToStreams(name, salindex);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { name, salindex, subscribeToStreams, unsubscribeToStreams } = this.props;
    if (prevProps.name !== name || prevProps.salindex !== salindex) {
      unsubscribeToStreams(prevProps.name, prevProps.salindex);
      subscribeToStreams(name, salindex);
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

  static bigCameraOfflineDetailedStates = {
    0: {
      name: 'UNKNOWN',
      userReadable: 'Unknown',
      char: 'U',
      class: styles.unknown,
    },
    1: {
      name: 'AVAILABLE',
      userReadable: 'Offline Available',
      char: 'A',
      class: styles.ok,
    },
    2: {
      name: 'PUBLISH_ONLY',
      userReadable: 'Offline Publish Only',
      char: 'P',
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
    enterControl: 'OFFLINE',
    start: 'STANDBY',
    enable: 'DISABLED',
    disable: 'ENABLED',
    standby: 'DISABLED or FAULT',
    exitControl: 'STANDBY',
  };

  setListOfStateTransitionCommands(name) {
    let commands = ['start', 'enable', 'disable', 'standby', 'exitControl'];
    if (name.search(/[A-Z]{2}Camera/) != -1) {
      commands.unshift('enterControl');
    }
    return commands;
  }

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
    const { name, salindex, requestSALCommand } = this.props;
    const { summaryStateCommand, configurationOverride } = this.state;
    requestSALCommand({
      cmd: `cmd_${summaryStateCommand}`,
      csc: name,
      salindex: salindex,
      params: summaryStateCommand === 'start' ? { configurationOverride } : {},
    });
  }

  sendSetLogLevel(event) {
    const { name, salindex, requestSALCommand } = this.props;
    const { logLevel } = this.state;
    requestSALCommand({
      cmd: 'cmd_setLogLevel',
      csc: name,
      salindex: salindex,
      params: { level: logLevel },
    });
  }

  render() {
    const {
      group,
      name,
      salindex,
      summaryStateData,
      offlineDetailedStateData,
      softwareVersions,
      configurationsAvailable: configurationsAvailableData,
      configurationApplied: configurationAppliedData,
      cscLogLevelData,
      simulationMode,
      heartbeatData,
      logMessageData,
      errorCodeData,
      onCSCClick,
      clearCSCErrorCodes,
      clearCSCLogMessages,
      displaySummaryState,
      hideTitle,
    } = this.props;
    const { summaryStateCommand } = this.state;

    const summaryStateValue = summaryStateData ? summaryStateData.summaryState.value : 0;
    const cscVersion = softwareVersions ? softwareVersions.cscVersion.value : 'Unknown';
    const xmlVersion = softwareVersions ? softwareVersions.xmlVersion.value : 'Unknown';
    const salVersion = softwareVersions ? softwareVersions.salVersion.value : 'Unknown';
    const configurationsAvailable = configurationsAvailableData
      ? configurationsAvailableData.overrides.value.split(',')
      : null;
    const summaryState = CSCExpanded.states[summaryStateValue];
    const cscLogLevel = cscLogLevelData ? cscLogLevelData.level.value : null;

    const configurationApplied = configurationAppliedData?.configurations.value;
    const configurationVersion = configurationAppliedData?.version.value;
    const configurationUrl = configurationAppliedData?.url.value;
    const configurationSchemaVersion = configurationAppliedData?.schemaVersion.value;

    const configurationsAvailableMenuOptions =
      configurationsAvailable?.length > 0 ? ['', ...configurationsAvailable] : null;

    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = -1;
    if (heartbeatData) {
      nLost = heartbeatData.lost;
      if (heartbeatData.last_heartbeat_timestamp < 0) timeDiff = -1;
      if (heartbeatData.last_heartbeat_timestamp === -2) timeDiff = -2;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - heartbeatData.last_heartbeat_timestamp);
      heartbeatStatus = heartbeatData.lost > 0 || timeDiff < 0 ? 'alert' : 'ok';
    }

    let timeDiffText = 'Unknown';
    if (timeDiff === -2) {
      timeDiffText = 'No heartbeat event in Remote.';
    } else if (timeDiff === -1) {
      timeDiffText = 'XXX - Never';
    } else if (timeDiff >= 0) {
      timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;
    }

    let heartbeatTitle = `${cscText(name, salindex)} heartbeat\nLost: ${nLost}\n`;
    if (timeDiff === -2) {
      heartbeatTitle += `${timeDiffText}`;
    } else {
      heartbeatTitle += `Last seen: ${timeDiffText}`;
    }

    const isBigCamera = name.search(/[A-Z]{2}Camera/) != -1;
    const offlineDetailedStateValue = offlineDetailedStateData ? offlineDetailedStateData.substate.value : 0;
    const isOffline = summaryState.name === 'OFFLINE';
    const bigCameraOfflineDetailedState = CSCExpanded.bigCameraOfflineDetailedStates[offlineDetailedStateValue];

    const isSimulated = simulationMode?.mode.value > 0;

    return (
      <div className={styles.CSCGroupContainer}>
        <div className={styles.CSCExpandedContainer}>
          <div className={styles.topBarContainerWrapper}>
            <div className={styles.topBarContainer}>
              <div className={styles.breadcrumContainer}>
                {group && (
                  <>
                    <div className={styles.backArrowIconWrapper} onClick={() => onCSCClick({ group: group })}>
                      <BackArrowIcon />
                    </div>
                    <span className={styles.breadcrumbGroup} onClick={() => onCSCClick({ group: group, csc: 'all' })}>
                      {group}
                    </span>
                    <span> &#62; </span>
                  </>
                )}
                {!hideTitle && (
                  <>
                    <span>{cscText(name, salindex)}</span>
                    {isSimulated ? <span className={styles.simulatedLabel}> (SIMULATED)</span> : ''}
                  </>
                )}
              </div>
              {displaySummaryState && (
                <div className={[styles.stateContainer].join(' ')}>
                  <div>
                    <span
                      className={[styles.summaryState, summaryState.class].join(' ')}
                      title={summaryState.userReadable}
                    >
                      {summaryState.name}
                    </span>
                  </div>
                  {isBigCamera && isOffline && (
                    <div>
                      <span
                        className={[styles.summaryState, bigCameraOfflineDetailedState.class].join(' ')}
                        title={bigCameraOfflineDetailedState.userReadable}
                      >
                        {bigCameraOfflineDetailedState.name}
                      </span>
                    </div>
                  )}
                  <div className={styles.heartbeatIconWrapper}>
                    <HeartbeatIcon className={styles.heartbeatIcon} status={heartbeatStatus} title={heartbeatTitle} />
                  </div>
                </div>
              )}
            </div>
          </div>
          {name !== 'Script' && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>
                    Software Versions: csc={cscVersion}, xml={xmlVersion}, sal={salVersion}
                  </div>
                </div>
              </div>
            </div>
          )}
          {name !== 'Script' && configurationApplied && (
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
                </div>
              </div>
            </div>
          )}
          {name !== 'Script' && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>Select State transition Command:</div>
                  <Select
                    options={this.setListOfStateTransitionCommands(name)}
                    onChange={(option) => this.setSummaryStateCommand(option.value)}
                    value=""
                    placeholder="Select state"
                  />
                </div>
                {configurationsAvailableMenuOptions !== null && summaryStateCommand === 'start' && (
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
                    disabled={summaryStateCommand === null}
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

          {summaryStateCommand !== null && (
            <div className={styles.topBarContainerWrapper}>
              <div className={styles.topBarContainer}>
                <div className={styles.breadcrumContainer}>
                  <div className={styles.titlePadding}>
                    <span className={styles.warningText}>
                      <span className={styles.warningIcon}>
                        <WarningIcon></WarningIcon>
                      </span>
                      <span>CSC must be in {CSCExpanded.validState[summaryStateCommand]}.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(cscLogLevel !== null || name === 'Script') && (
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

          {errorCodeData.length > 0 && (
            <div className={[styles.logContainer, styles.errorCodeContainer].join(' ')}>
              <div className={styles.logContainerTopBar}>
                <div>ERROR CODE</div>
                <div>
                  <Button size="extra-small" onClick={() => clearCSCErrorCodes(name, salindex)}>
                    CLEAR
                  </Button>
                </div>
              </div>
              <div className={[styles.log, styles.messageLogContent].join(' ')}>
                {errorCodeData.map((msg, index) => {
                  return (
                    <div key={`${msg[TOPIC_TIMESTAMP_ATTRIBUTE].value}-${index}`} className={styles.logMessage}>
                      <div className={styles.errorCode} title={`Error code ${msg.errorCode.value}`}>
                        {msg.errorCode.value}
                      </div>
                      <div className={styles.messageTextContainer}>
                        <div className={styles.timestamp} title={TOPIC_TIMESTAMP_ATTRIBUTE}>
                          {formatTimestamp(msg[TOPIC_TIMESTAMP_ATTRIBUTE].value * 1000)}
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
            logMessageData={logMessageData}
            clearCSCLogMessages={() => clearCSCLogMessages(name, salindex)}
          />
        </div>
      </div>
    );
  }
}
