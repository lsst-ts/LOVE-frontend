import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingBar from '../../../GeneralPurpose/LoadingBar/LoadingBar';
import scriptStyles from '../Scripts.module.css';
import styles from './CurrentScript.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import { getStatusStyle } from '../Scripts';
import HeartbeatIcon from '../../../icons/HeartbeatIcon/HeartbeatIcon';
import { hasCommandPrivileges } from '../../../../Config';
import StopIcon from '../../../icons/ScriptQueue/StopIcon/StopIcon';

export default class CurrentScript extends Component {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    index: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** Timestamp when the script started running as current script */
    timestampRunStart: PropTypes.number,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    scriptState: PropTypes.string,
    /** SAL property: State of the process; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    processState: PropTypes.string,
    /** Timestamp of script creation */
    timestamp: PropTypes.number,
    /** Heartbeat data with number of consecutive lost heartbeats and last received timestamp */
    heartbeatData: PropTypes.object,
    /** Function called to stop a script */
    stopScript: PropTypes.func,
    /** Function called when the context menu button is clicked */
    onClickContextMenu: PropTypes.func,
  };

  static defaultProps = {
    index: undefined,
    isStandard: undefined,
    path: 'None',
    timestamp: 0,
    scriptState: 'Unknown',
    processState: 'Unknown',
    estimatedTime: 0,
    timestampRunStart: 0,
    heartbeatData: {},
    stopScript: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      elapsedTime: 0,
    };
  }

  onClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  animateProgress = () => {
    if (this.props.index === undefined) return;

    if (this.props.timestampRunStart > 0) {
      this.setState({
        elapsedTime: new Date().getTime() / 1000.0 - this.props.timestampRunStart,
      });
    } else {
      this.setState({ elapsedTime: 0 });
    }

    requestAnimationFrame(this.animateProgress);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.index !== this.props.index && this.props.index !== undefined) {
      this.animateProgress();
    }
  };

  componentDidMount = () => {
    if (this.props.index !== undefined) {
      this.animateProgress();
    }
  };

  render() {
    const { path } = this.props;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName =
      path.lastIndexOf('.') > -1
        ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        : path.substring(path.lastIndexOf('/') + 1);
    const fileExtension = path.lastIndexOf('.') > -1 ? path.substring(path.lastIndexOf('.')) : '';

    let percentage = 100;
    const { estimatedTime } = this.props;
    const { elapsedTime } = this.state;
    if (estimatedTime > 0) {
      percentage = (100 * elapsedTime) / estimatedTime;
    }
    if (path === 'None') percentage = 0;
    const isValid = this.props.path !== 'None';
    const typeTag = this.props.isStandard ? 'STANDARD' : 'EXTERNAL';
    const visibilityClass = !isValid ? scriptStyles.hidden : '';

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
    const timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;

    return (
      <div className={[scriptStyles.scriptContainer, isValid ? '' : scriptStyles.scriptContainerOff].join(' ')}>
        <div>
          <div className={styles.currentScriptContainer} onClick={this.onClick}>
            <div className={styles.topContainer}>
              <div className={styles.topContainerLeft}>
                <div className={[scriptStyles.scriptInfoContainer, visibilityClass].join(' ')}>
                  <div className={scriptStyles.heartBeatContainer}>
                    <HeartbeatIcon
                      status={heartbeatStatus}
                      title={`Lost: ${lost} heartbeats \nLast seen: ${timeDiffText}`}
                    />
                  </div>
                  {this.props.index !== undefined && (
                    <div className={styles.indexContainer}>
                      <span className={scriptStyles.indexLabel}>salIndex: </span>
                      <span className={[styles.indexValue, scriptStyles.highlighted].join(' ')}>
                        {this.props.index}{' '}
                      </span>
                    </div>
                  )}
                  {typeTag !== '' && (
                    <>
                      <span className={scriptStyles.externalSeparator}>{' - '}</span>
                      <span className={scriptStyles.externalText} title={`${typeTag} script`}>
                        {`[${typeTag.toUpperCase()}]`}
                      </span>
                    </>
                  )}
                </div>

                <div className={[scriptStyles.pathTextContainer, styles.filenameContainer].join(' ')}>
                  <span className={scriptStyles.pathText}>{fileFolder}</span>
                  <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
                  <span className={scriptStyles.pathText}>{fileExtension}</span>
                </div>
              </div>
              <div className={[scriptStyles.scriptStatusContainer, visibilityClass].join(' ')}>
                <div className={scriptStyles.buttonsContainer}>
                  <div
                    className={scriptStyles.buttonContainer}
                    onClick={(e) => {
                      this.props.stopScript(this.props.index);
                      e.stopPropagation();
                    }}
                  >
                    <div className={scriptStyles.commandButton}>
                      <div>
                        <StopIcon />
                      </div>
                      <div className={scriptStyles.commandButtonText}>{this.props.isCompact ? '' : 'Stop'}</div>
                    </div>
                  </div>
                  <div
                    className={scriptStyles.buttonContainer}
                    onClick={(e) => this.props.onClickContextMenu(e, this.props.index, true)}
                  >
                    &#8943;
                  </div>
                </div>
                <div
                  className={scriptStyles.scriptStateContainer}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <ScriptStatus isCompact={this.props.isCompact} status={getStatusStyle(this.props.scriptState)}>
                    {this.props.scriptState}
                  </ScriptStatus>
                </div>
                <div
                  className={scriptStyles.scriptStateContainer}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <ScriptStatus
                    isCompact={this.props.isCompact}
                    type="process"
                    status={getStatusStyle(this.props.processState)}
                  >
                    {this.props.processState}
                  </ScriptStatus>
                </div>
              </div>
            </div>
            <div className={[styles.loadingBarContainer, visibilityClass].join(' ')}>
              <LoadingBar percentage={percentage} title={`Script completion: ${percentage}%`} />
            </div>
            <div className={[styles.checkpointContainer, visibilityClass].join(' ')}>
              <div className={styles.estimatedTimeContainer}>
                <span className={styles.estimatedTimeLabel}>Last checkpoint: </span>
                <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>
                  {this.props.last_checkpoint}
                </span>
              </div>
            </div>
            <div className={[styles.timeContainer, visibilityClass].join(' ')}>
              <div className={styles.estimatedTimeContainer}>
                <span className={styles.estimatedTimeLabel}>Estimated time: </span>
                <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>
                  {estimatedTime.toFixed(2)} s
                </span>
              </div>
              <div className={styles.elapsedTimeContainer}>
                <span className={styles.elapsedTimeLabel}>Elapsed time: </span>
                <span className={[styles.elapsedTimeValue, scriptStyles.highlighted].join(' ')}>
                  {elapsedTime.toFixed(2)} s
                </span>
              </div>
            </div>
          </div>
          <div
            className={[
              scriptStyles.expandedSectionWrapper,
              this.state.expanded && isValid ? '' : scriptStyles.hidden,
            ].join(' ')}
          >
            {hasCommandPrivileges ? (
              <div className={[scriptStyles.expandedSection].join(' ')}>
                <div className={scriptStyles.expandedSubSection}>
                  <div className={scriptStyles.subSectionTitle}>DESCRIPTION</div>
                  <div className={scriptStyles.subSectionRow}>
                    <span className={scriptStyles.subSectionLabel}>Classname:</span>
                    <span className={scriptStyles.subSectionValue}> {this.props.classname} </span>
                  </div>
                  <div className={scriptStyles.subSectionRow}>
                    <span className={scriptStyles.subSectionLabel}>Description:</span>
                    <span className={scriptStyles.subSectionValue}> {this.props.description} </span>
                  </div>
                  <div className={scriptStyles.subSectionRow}>
                    <span className={scriptStyles.subSectionLabel}>Remotes:</span>
                    <span className={scriptStyles.subSectionValue}> {this.props.remotes} </span>
                  </div>
                  {/* <div className={scriptStyles.subSectionTitle}>
                  SCHEMA
                </div> */}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
