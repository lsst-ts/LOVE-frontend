import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import styles from './AvailableScript.module.css';
import UploadButton from '../../../HealthStatusSummary/Button/UploadButton';
import scriptStyles from '../Scripts.module.css';
import { hasCommandPrivileges } from '../../../../Config';
import LaunchScriptIcon from '../../../icons/ScriptQueue/LaunchScriptIcon';

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
    onScriptConfigLaunch: PropTypes.func,
  };

  static defaultProps = {
    index: -1,
    isStandard: true,
    path: 'Unknown',
    estimatedTime: 0,
    state: 'Unknown',
    onLaunch: () => 0,
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
            <div className={scriptStyles.pathTextContainer}>
              <span className={scriptStyles.pathText}>{fileFolder}</span>
              <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
              <span className={scriptStyles.pathText}>{fileExtension}</span>
            </div>
            <div className={styles.estimatedTimeContainer}>
              <span className={styles.estimatedTimeLabel}>Estimated time:</span>
              <span className={styles.estimatedTimeValue}>{this.props.estimatedTime}</span>
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
          </div>
        </div>
        <div className={scriptStyles.mainScriptButton} onClick={(e) => this.props.onScriptConfigLaunch(e, {name: fileName, ...this.props.script})}>
          <span className={scriptStyles.launchIconWrapper}>
            <LaunchScriptIcon title="Launch script: Configure" />
          </span>
        </div>
      </div>
    );
  }
}
