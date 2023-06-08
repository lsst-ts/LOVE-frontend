import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LogMessageDisplay from 'components/GeneralPurpose/LogMessageDisplay/LogMessageDisplay';
import Button from 'components/GeneralPurpose/Button/Button';
import ManagerInterface, { parseToSALFormat } from 'Utils';
import styles from './FinishedScript.module.css';
import scriptStyles from '../Scripts.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import { getStatusStyle } from '../Scripts';
import RequeueIcon from '../../../icons/ScriptQueue/RequeueIcon/RequeueIcon';
import ScriptDetails from '../ScriptDetails';

export default class FinishedScript extends PureComponent {
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
    this.setState((state) => ({ expanded: !state.expanded }));
    this.props.onClick();
  };

  toggleLogs = () => {
    this.setState((state) => ({ showLogs: !state.showLogs }));
  };

  queryLogs = (scriptIndex, start, end) => {
    const efdInstance = this.props.efdConfig?.defaultEfdInstance ?? 'summit_efd';
    const cscs = {
      Script: {
        [scriptIndex]: {
          logevent_logMessage: ['private_rcvStamp', 'level', 'message', 'traceback'],
        },
      },
    };
    const startDateIso = new Date(start * 1000).toISOString();
    const endDateIso = new Date(end * 1000).toISOString();
    ManagerInterface.getEFDLogs(startDateIso, endDateIso, cscs, efdInstance).then((res) => {
      this.setState({
        logs: res[`Script-${scriptIndex}-logevent_logMessage`].map(parseToSALFormat),
      });
    });
  };

  clearLogs = () => {
    this.setState({
      logs: [],
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
            <Button
              onClick={() => {
                if (!this.state.showLogs) {
                  this.queryLogs(this.props.index, this.props.timestampProcessStart, this.props.timestampProcessEnd);
                }
                this.toggleLogs();
              }}
            >
              Toggle logs
            </Button>
          </div>
          {this.state.showLogs && (
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
