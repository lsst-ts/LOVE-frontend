import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableScript.module.css';
import scriptStyles from '../Scripts.module.css';
import LaunchScriptIcon from '../../../icons/ScriptQueue/LaunchScriptIcon/LaunchScriptIcon';

export default class AvailableScript extends PureComponent {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    index: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    state: PropTypes.string,
    /** Function called when launching the script configuration panel */
    launchScriptConfig: PropTypes.func,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
  };

  static defaultProps = {
    index: -1,
    isStandard: true,
    path: 'Unknown',
    estimatedTime: 0,
    state: 'Unknown',
    onLaunch: () => 0,
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
        <div>
          <div className={styles.availableScriptContainer} onClick={this.onClick}>
            <div className={scriptStyles.externalContainer}>
              <span className={scriptStyles.externalText}>{this.props.isStandard ? '[STANDARD]' : '[EXTERNAL]'}</span>
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
              {/* <span className={scriptStyles.pathText}>{fileFolder}</span> */}
              <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
              <span className={scriptStyles.pathText}>{fileExtension}</span>
            </div>
            <div className={styles.estimatedTimeContainer}>
              <span className={styles.estimatedTimeLabel}>Estimated time:</span>
              <span className={styles.estimatedTimeValue}>{this.props.estimatedTime}</span>
            </div>
          </div>
          <div
            className={[scriptStyles.expandedSectionWrapper, this.state.expanded ? '' : scriptStyles.hidden].join(' ')}
          >
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
          </div>
        </div>
        {this.props.commandExecutePermission && (
          <div
            className={scriptStyles.mainScriptButton}
            onClick={(e) => this.props.launchScriptConfig(e, { name: fileName, ...this.props.script })}
          >
            <span className={scriptStyles.launchIconWrapper}>
              <LaunchScriptIcon title="Launch script: Configure" />
            </span>
          </div>
        )}
      </div>
    );
  }
}
