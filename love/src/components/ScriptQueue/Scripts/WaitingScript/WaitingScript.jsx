import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import styles from './WaitingScript.module.css';
import scriptStyles from '../Scripts.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import { getStatusStyle } from '../Scripts';
import UploadButton from '../../../HealthStatusSummary/Button/UploadButton';
import Button from '../../../GeneralPurpose/Button/Button';
import { hasCommandPrivileges } from '../../../../Config';
import HeartbeatIcon from '../../../icons/HeartbeatIcon/HeartbeatIcon';

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
    const timeDiffText = this.props.heartbeatData.lastHeartbeatTimestamp <= 0 || timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;

    return (
      <div className={scriptStyles.scriptContainer}>
        <div className={styles.waitingScriptContainer} onClick={this.onClick}>
          <div>
            <div className={scriptStyles.externalContainer}>
              <span className={scriptStyles.externalText} title={`SAL index ${this.props.index}`}>
                {this.props.index}
              </span>
              {typeTag !== '' && (
                <span className={scriptStyles.externalText} title={`${typeTag} script`}>
                  {' - '}
                  {`[${typeTag.toUpperCase()}]`}
                </span>
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
            <div className={scriptStyles.heartBeatContainer}>
              <HeartbeatIcon status={heartbeatStatus} title={`Lost: ${lost} heartbeats \nLast seen: ${timeDiffText}`} />
            </div>
            <div className={scriptStyles.scriptStateContainer} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ScriptStatus isCompact={this.props.isCompact} status={getStatusStyle(this.props.script_state)}>
                {this.props.script_state}
              </ScriptStatus>
            </div>
            <div className={scriptStyles.scriptStateContainer} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        <div className={[styles.expandedSectionWrapper, this.state.expanded ? '' : styles.hidden].join(' ')}>
          <div className={[styles.expandedSection].join(' ')}>
            <div className={scriptStyles.expandedTopRow}>
              <p>Script config</p>
              {hasCommandPrivileges ? (
                <div className={scriptStyles.uploadButtonWrapper}>
                  <UploadButton
                    className={scriptStyles.uploadConfigButton}
                    labelClassName={scriptStyles.uploadButtonLabel}
                    iconClassName={scriptStyles.uploadIcon}
                  />
                </div>
              ) : null}
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
          {hasCommandPrivileges ? (
            <div className={[styles.expandedSection].join(' ')}>
              <div className={scriptStyles.expandedTopRow}>
                <p>Remove script</p>
                <div className={scriptStyles.uploadButtonWrapper}>
                  <Button className={scriptStyles.uploadConfigButton}>Remove</Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
