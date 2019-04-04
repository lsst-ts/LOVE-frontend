import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import styles from './FinishedScript.module.css';
import scriptStyles from '../Scripts.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';
import { getStatusStyle } from '../Scripts';

export default class FinishedScript extends Component {
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
  };

  static defaultProps = {
    index: -1,
    isStandard: true,
    path: 'Unknown',
    estimatedTime: 0,
    elapsedTime: 0,
    script_state: 'Unknown',
    isCompact: false,
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
    return (
      <div className={scriptStyles.scriptContainer}>
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
                <ScriptStatus
                  isCompact={this.props.isCompact}
                  type="process"
                  status={getStatusStyle(this.props.process_state)}
                >
                  {this.props.process_state}
                </ScriptStatus>
              </div>
              <div
                className={scriptStyles.scriptStateContainer}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <ScriptStatus isCompact={this.props.isCompact} status={getStatusStyle(this.props.script_state)}>
                  {this.props.script_state}
                </ScriptStatus>
              </div>
            </div>
          </div>
          <div className={styles.timeContainer}>
            <div className={styles.estimatedTimeContainer}>
              <span className={styles.estimatedTimeLabel}>Estimated time: </span>
              <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>
                {this.props.estimatedTime >= 0 ? this.props.estimatedTime.toFixed(2) : '?'}
              </span>
            </div>
            <div className={styles.elapsedTimeContainer}>
              <span className={styles.elapsedTimeLabel}>Total time: </span>
              <span className={[styles.elapsedTimeValue, scriptStyles.highlighted].join(' ')}>
                {this.props.elapsedTime.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className={[styles.expandedSectionWrapper, this.state.expanded ? '' : styles.hidden].join(' ')}>
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
