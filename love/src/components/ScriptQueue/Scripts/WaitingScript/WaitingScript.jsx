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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './WaitingScript.module.css';
import scriptStyles from '../Scripts.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import { getStatusStyle } from '../Scripts';
import { hasCommandPrivileges } from '../../../../Config';
import HeartbeatIcon from '../../../icons/HeartbeatIcon/HeartbeatIcon';
import StopIcon from '../../../icons/ScriptQueue/StopIcon/StopIcon';
import MoveUpIcon from '../../../icons/ScriptQueue/MoveUpIcon/MoveUpIcon';
import MoveDownIcon from '../../../icons/ScriptQueue/MoveDownIcon/MoveDownIcon';
import ScriptDetails from '../ScriptDetails';

export default class WaitingScript extends PureComponent {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    index: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    script_state: PropTypes.string,
    /** SAL property: State of the process; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    process_state: PropTypes.string,
    /** Timestamp of script creation */
    timestamp: PropTypes.number,
    /** Heartbeat data with number of consecutive lost heartbeats and last received timestamp */
    heartbeatData: PropTypes.object,
    /** Function called to stop a script */
    stopScript: PropTypes.func,
    /** Function called to move a script */
    moveScript: PropTypes.func,
    /** Function called when the context menu button is clicked */
    onClickContextMenu: PropTypes.func,
    /** Function called to move the script up in the waiting queue */
    moveScriptUp: PropTypes.func,
    /** Function called to move the script down in the waiting queue */
    moveScriptDown: PropTypes.func,
  };

  static defaultProps = {
    index: -1,
    isStandard: undefined,
    path: 'Unknown',
    estimatedTime: 0,
    script_state: 'Unknown',
    process_state: 'Unknown',
    isCompact: false,
    heartbeatData: {},
    stopScript: () => 0,
    moveScript: () => 0,
    moveScriptUp: () => 0,
    moveScriptDown: () => 0,
    onClickContextMenu: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  onClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
    this.props.onClick();
  };

  moveToFirst = (index) => {
    this.props.moveScript(index, 0);
  };

  moveToLast = (index) => {
    this.props.moveScript(index, 0);
  };

  render() {
    const { path } = this.props;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName =
      path.lastIndexOf('.') > -1
        ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        : path.substring(path.lastIndexOf('/') + 1);
    const fileExtension = path.lastIndexOf('.') > -1 ? path.substring(path.lastIndexOf('.')) : '';

    let typeTag = '';
    if (this.props.isStandard !== undefined) {
      typeTag = this.props.isStandard ? 'Standard' : 'External';
    }

    const isHearbeatAvailable = Object.keys(this.props.heartbeatData).length > 0;
    let heartbeatStatus = 'unknown';
    let { lost } = this.props.heartbeatData;
    if (lost === undefined) lost = 0;
    let timeDiff = -1;
    if (isHearbeatAvailable) {
      heartbeatStatus = this.props.heartbeatData.lost > 0 ? 'alert' : 'ok';
      if (this.props.heartbeatData.lastHeartbeatTimestamp < 0) timeDiff = -1;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - this.props.heartbeatData.lastHeartbeatTimestamp);
    }
    const timeDiffText =
      this.props.heartbeatData.lastHeartbeatTimestamp <= 0 || timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;

    return (
      <div className={scriptStyles.scriptContainer}>
        <div>
          <div className={styles.waitingScriptContainer} onClick={this.onClick}>
            <div>
              <div className={scriptStyles.scriptInfoContainer}>
                <div className={scriptStyles.heartBeatContainer}>
                  <HeartbeatIcon
                    className={styles.heartbeatIcon}
                    status={heartbeatStatus}
                    title={`Lost: ${lost} heartbeats \nLast seen: ${timeDiffText}`}
                  />
                </div>
                <span className={scriptStyles.externalText} title={`SAL index ${this.props.index}`}>
                  {this.props.index}
                </span>
                {typeTag !== '' && (
                  <>
                    <span className={scriptStyles.externalSeparator}>{' - '}</span>
                    <span className={scriptStyles.externalText} title={`${typeTag} script`}>
                      {`[${typeTag.toUpperCase()}]`}
                    </span>
                  </>
                )}
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
              <div className={styles.estimatedTimeContainer}>
                <span className={styles.estimatedTimeLabel}>Estimated time: </span>
                <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>
                  {this.props.estimatedTime.toFixed(2)} s
                </span>
              </div>
            </div>
            <div className={scriptStyles.scriptStatusContainer}>
              {this.props.commandExecutePermission && (
                <div className={scriptStyles.buttonsContainer}>
                  <div
                    className={scriptStyles.buttonContainer}
                    onClick={(e) => {
                      this.props.moveScriptUp(this.props.index);
                      e.stopPropagation();
                    }}
                  >
                    <div className={[scriptStyles.commandButton, scriptStyles.compact].join(' ')}>
                      <div>
                        <MoveUpIcon />
                      </div>
                      {/* <div className={scriptStyles.commandButtonText}>{this.props.isCompact ? '' : 'Move up'}</div> */}
                    </div>
                  </div>
                  <div
                    className={scriptStyles.buttonContainer}
                    onClick={(e) => {
                      this.props.moveScriptDown(this.props.index);
                      e.stopPropagation();
                    }}
                  >
                    <div className={[scriptStyles.commandButton, scriptStyles.compact].join(' ')}>
                      <div>
                        <MoveDownIcon />
                      </div>
                      {/* <div className={scriptStyles.commandButtonText}>{this.props.isCompact ? '' : 'Move down'}</div> */}
                    </div>
                  </div>
                  <div
                    className={scriptStyles.buttonContainer}
                    onClick={(e) => {
                      this.props.stopScript(this.props.index);
                      e.stopPropagation();
                    }}
                  >
                    <div className={[scriptStyles.commandButton, scriptStyles.compact].join(' ')}>
                      <div>
                        <StopIcon />
                      </div>
                      {/* <div className={scriptStyles.commandButtonText}>{this.props.isCompact ? '' : 'Stop'}</div> */}
                    </div>
                  </div>
                  <div
                    className={[scriptStyles.buttonContainer, scriptStyles.noBackgroundButton].join(' ')}
                    onClick={(e) => this.props.onClickContextMenu(e, this.props.index)}
                  >
                    <span style={{ width: '100%' }}>&#8943;</span>
                  </div>
                </div>
              )}
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
          <div
            className={[scriptStyles.expandedSectionWrapper, this.state.expanded ? '' : scriptStyles.hidden].join(' ')}
          >
            <ScriptDetails {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}
