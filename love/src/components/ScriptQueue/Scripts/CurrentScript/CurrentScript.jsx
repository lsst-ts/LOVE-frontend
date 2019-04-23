import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import LoadingBar from './LoadingBar/LoadingBar';
import styles from './CurrentScript.module.css';
import scriptStyles from '../Scripts.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import { getStatusStyle } from '../Scripts';
import HeartbeatIcon from '../../../icons/HeartbeatIcon/HeartbeatIcon';

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
    /** Estimated execution time */
    elapsedTime: PropTypes.number,
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
  };

  static defaultProps = {
    index: undefined,
    isStandard: undefined,
    path: 'None',
    timestamp: 0,
    scriptState: 'Unknown',
    processState: 'Unknown',
    estimatedTime: 0,
    elapsedTime: 0,
    heartbeatData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  onClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    const { path } = this.props;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName =
      path.lastIndexOf('.') > -1
        ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        : path.substring(path.lastIndexOf('/'));
    const fileExtension = path.lastIndexOf('.') > -1 ? path.substring(path.lastIndexOf('.')) : '';

    let percentage = 100;
    const estimatedTime = Math.trunc(this.props.estimatedTime);
    const elapsedTime = Math.trunc(this.props.elapsedTime);
    if (estimatedTime > 0) {
      percentage = Math.min((100 * elapsedTime) / estimatedTime, 100);
      percentage = Math.trunc(percentage);
    }
    if (path === 'None') percentage = 0;
    const isValid = this.props.path !== 'None';
    const typeTag = this.props.isStandard ? '[STANDARD]' : '[EXTERNAL]';
    const visibilityClass = !isValid ? styles.hidden : '';

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
      <div className={scriptStyles.scriptContainer}>
        <div className={styles.currentScriptContainer} onClick={this.onClick}>
          <div className={styles.topContainer}>
            <div>
              <div className={[scriptStyles.externalContainer, visibilityClass].join(' ')}>
                <span className={scriptStyles.externalText}>{typeTag}</span>
              </div>
              {this.props.index !== undefined && (
                <div className={styles.indexContainer}>
                  <span className={styles.indexLabel}>Index: </span>
                  <span className={[styles.indexValue, scriptStyles.highlighted].join(' ')}>{this.props.index}</span>
                </div>
              )}
              <div className={scriptStyles.pathTextContainer}>
                <span className={scriptStyles.pathText}>{fileFolder}</span>
                <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
                <span className={scriptStyles.pathText}>{fileExtension}</span>
              </div>
            </div>
            <div className={[scriptStyles.scriptStatusContainer, visibilityClass].join(' ')}>
              <div className={scriptStyles.heartBeatContainer}>
                <HeartbeatIcon
                  status={heartbeatStatus}
                  title={`Lost: ${lost} heartbeats \nLast seen: ${timeDiffText}`}
                />
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
          <div className={styles.loadingBarContainer}>
            <LoadingBar percentage={percentage} />
          </div>
          <div className={styles.timeContainer}>
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
        <div className={[styles.expandedSectionWrapper, this.state.expanded && isValid ? '' : styles.hidden].join(' ')}>
          <div className={[styles.expandedSection].join(' ')}>
            <div className={scriptStyles.expandedTopRow}>
              <p>Script config</p>
              <div className={scriptStyles.uploadButtonWrapper} />
            </div>
            <JSONPretty
              data={{}}
              theme={{
                main:
                  'line-height:1.3;color:#66d9ef;background:var(--secondary-background-dimmed-color);overflow:auto;',
                key: 'color:#f92672;',
                string: 'color:#fd971f;',
                value: 'color:#a6e22e;',
                boolean: 'color:#ac81fe;',
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
