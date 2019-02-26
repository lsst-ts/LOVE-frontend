import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingBar from './LoadingBar/LoadingBar';
import styles from './CurrentScript.module.css';
import scriptStyles from '../Scripts.module.css';

export default class CurrentScript extends Component {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    salIndex: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** Estimated execution time */
    elapsedTime: PropTypes.number,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    state: PropTypes.string,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
  };
  static defaultProps = {
    salIndex: 0,
    isStandard: true,
    path: 'auxtel/at_calsys_takedata.py',
    estimatedTime: 0,
    elapsedTime: 0,
    state: 'Unknown',
  };

  render() {
    const path = this.props.path;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    const fileExtension = path.substring(path.lastIndexOf('.'));
    return (
      <div className={scriptStyles.scriptContainer}>
        <div className={styles.indexContainer}>
          <span className={styles.indexLabel}>Index: </span>
          <span className={[styles.indexValue, scriptStyles.highlighted].join(' ')}>{this.props.salIndex}</span>
        </div>
        <div className={scriptStyles.pathTextContainer}>
          <span className={scriptStyles.pathText}>{fileFolder}</span>
          <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
          <span className={scriptStyles.pathText}>{fileExtension}</span>
        </div>
        <div className={styles.loadingBarContainer}>
          <LoadingBar percentage={40} />
        </div>
        <div className={styles.timeContainer}>
          <div className={styles.estimatedTimeContainer}>
            <span className={styles.estimatedTimeLabel}>Estimated time: </span>
            <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>{this.props.estimatedTime}</span>
          </div>
          <div className={styles.elapsedTimeContainer}>
            <span className={styles.elapsedTimeLabel}>Elapsed time: </span>
            <span className={[styles.elapsedTimeValue, scriptStyles.highlighted].join(' ')}>{this.props.elapsedTime}</span>
          </div>
        </div>
      </div>
    );
  }
}
