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

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import LogMessageDisplay from 'components/GeneralPurpose/LogMessageDisplay/LogMessageDisplay';
import Button from 'components/GeneralPurpose/Button/Button';
import RequeueIcon from 'components/icons/ScriptQueue/RequeueIcon/RequeueIcon';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import ManagerInterface, { parseToSALFormat, getEFDInstanceForHost } from 'Utils';
import { getStatusStyle } from '../Scripts';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import ScriptDetails from '../ScriptDetails';
import ScriptConfig from '../ScriptConfig/ScriptConfig';
import styles from './FinishedScript.module.css';
import scriptStyles from '../Scripts.module.css';

class FinishedScript extends React.Component {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    index: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** Estimated execution time */
    elapsedTime: PropTypes.number,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    script_state: PropTypes.string,
    /** SAL property: State of the process; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    process_state: PropTypes.string,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
    /** Function called to requeue a script */
    requeueScript: PropTypes.func,
  };

  static defaultProps = {
    index: -1,
    isStandard: true,
    path: 'Unknown',
    estimatedTime: 0,
    elapsedTime: 0,
    script_state: 'Unknown',
    isCompact: false,
    requeueScript: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showLogs: false,
      logs: [],
    };
  }

  onClick = () => {
    this.setState(
      (state) => ({ expanded: !state.expanded }),
      () => {
        if (this.state.expanded) {
          this.queryLogs();
        }
      },
    );
    this.props.onClick();
  };

  toggleLogs = () => {
    this.setState((state) => ({ showLogs: !state.showLogs }));
  };

  clearLogs = () => {
    this.setState({
      logs: [],
    });
  };

  queryLogs = () => {
    const { index: scriptIndex, timestampProcessStart, timestampProcessEnd } = this.props;

    const efdInstance = getEFDInstanceForHost();
    if (!efdInstance) {
      return;
    }

    const cscs = {
      Script: {
        [scriptIndex]: {
          logevent_logMessage: [TOPIC_TIMESTAMP_ATTRIBUTE, 'level', 'message', 'traceback'],
        },
      },
    };

    // Convert to ISO format and remove Z at the end
    const startDateIso = new Date(timestampProcessStart * 1000).toISOString().slice(0, -1);
    const endDateIso = new Date(timestampProcessEnd * 1000).toISOString().slice(0, -1);
    ManagerInterface.getEFDLogs(startDateIso, endDateIso, cscs, efdInstance, 'tai').then((res) => {
      if (res) {
        const logs = res[`Script-${scriptIndex}-logevent_logMessage`].map(parseToSALFormat);
        logs.sort((a, b) => {
          return a[TOPIC_TIMESTAMP_ATTRIBUTE].value > b[TOPIC_TIMESTAMP_ATTRIBUTE].value ? -1 : 1;
        });
        this.setState({ logs });
      }
    });
  };

  render() {
    const { path } = this.props;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName =
      path.lastIndexOf('.') > -1
        ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        : path.substring(path.lastIndexOf('/') + 1);
    const fileExtension = path.lastIndexOf('.') > -1 ? path.substring(path.lastIndexOf('.')) : '';

    const dateScriptFinished =
      this.props.timestampProcessEnd > 0 ? new Date(this.props.timestampProcessEnd * 1000) : null;

    return (
      <div className={scriptStyles.scriptContainer}>
        <div>
          <div className={styles.finishedScriptContainer} onClick={this.onClick}>
            <div className={styles.topContainer}>
              <div>
                <div className={scriptStyles.externalContainer}>
                  <span className={scriptStyles.externalText} title={`SAL index ${this.props.index}`}>
                    {this.props.index}
                  </span>
                  <span> - </span>
                  <span
                    className={scriptStyles.externalText}
                    title={this.props.isStandard ? 'Standard script' : 'External script'}
                  >
                    {this.props.isStandard ? '[STANDARD]' : '[EXTERNAL]'}
                  </span>
                  <span> - </span>
                  <span className={scriptStyles.externalText} title="timestampProcessEnd">
                    {dateScriptFinished?.toISOString()}
                  </span>
                </div>
                <div className={scriptStyles.pathTextContainer} title={path}>
                  {(() => {
                    if (!this.props.isCompact) {
                      return <span className={scriptStyles.pathText}>{fileFolder}</span>;
                    }
                    if (fileFolder !== '') {
                      return <span className={scriptStyles.pathText}>.../</span>;
                    }
                    return null;
                  })()}
                  <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
                  {!this.props.isCompact ? <span className={scriptStyles.pathText}>{fileExtension}</span> : null}
                </div>
              </div>
              <div className={scriptStyles.scriptStatusContainer}>
                <div
                  className={scriptStyles.scriptStateContainer}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <ScriptStatus isCompact={this.props.isCompact} status={getStatusStyle(this.props.script_state)}>
                    {this.props.script_state}
                  </ScriptStatus>
                </div>
                <div
                  className={scriptStyles.scriptStateContainer}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <ScriptStatus
                    isCompact={this.props.isCompact}
                    type="process"
                    status={getStatusStyle(this.props.process_state)}
                  >
                    {this.props.process_state}
                  </ScriptStatus>
                </div>
              </div>
            </div>
            <div className={styles.timeContainer}>
              <div className={styles.estimatedTimeContainer}>
                <span className={styles.estimatedTimeLabel}>Estimated time: </span>
                <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>
                  {this.props.estimatedTime >= 0 ? this.props.estimatedTime.toFixed(2) : '?'} s
                </span>
              </div>
              <div className={styles.elapsedTimeContainer}>
                <span className={styles.elapsedTimeLabel}>Total time: </span>
                <span className={[styles.elapsedTimeValue, scriptStyles.highlighted].join(' ')}>
                  {this.props.elapsedTime.toFixed(2)} s
                </span>
              </div>
            </div>
          </div>
          <div
            className={[scriptStyles.expandedSectionWrapper, this.state.expanded ? '' : scriptStyles.hidden].join(' ')}
          >
            <ScriptDetails {...this.props} />
            {this.props.timestampConfigureEnd > 0 && this.state.expanded && <ScriptConfig {...this.props} />}
            {this.state.logs.length > 0 && (
              <div className={styles.logsContainer}>
                <div>LOGS</div>
                <Button onClick={this.toggleLogs}>Toggle logs</Button>
              </div>
            )}
          </div>
          {this.state.showLogs && this.state.expanded && (
            <div>
              <LogMessageDisplay logMessageData={this.state.logs} clearCSCLogMessages={this.clearLogs} />
            </div>
          )}
        </div>
        {this.props.commandExecutePermission && (
          <div className={scriptStyles.mainScriptButton} onClick={(e) => this.props.requeueScript(this.props.index)}>
            <span className={scriptStyles.requeueIconWrapper}>
              <RequeueIcon title="Launch script: Requeue" />
            </span>
          </div>
        )}
      </div>
    );
  }
}

function areEqualProps(prevProps, nextProps) {
  return (
    prevProps.index === nextProps.index &&
    prevProps.isStandard === nextProps.isStandard &&
    prevProps.path === nextProps.path &&
    prevProps.estimatedTime === nextProps.estimatedTime &&
    prevProps.elapsedTime === nextProps.elapsedTime &&
    prevProps.script_state === nextProps.script_state &&
    prevProps.process_state === nextProps.process_state &&
    prevProps.isCompact === nextProps.isCompact
  );
}

export default memo(FinishedScript, areEqualProps);
