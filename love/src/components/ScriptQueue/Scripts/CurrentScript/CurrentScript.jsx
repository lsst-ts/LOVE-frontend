import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingBar from './LoadingBar/LoadingBar';
import styles from './CurrentScript.module.css';
import scriptStyles from '../Scripts.module.css';

export default class CurrentScript extends Component {
  static propTypes = {
    salIndex: PropTypes.number,
    isStandard: PropTypes.bool,
    path: PropTypes.string,
    estimatedTime: PropTypes.number,
    elapsedTime: PropTypes.number,
    state: PropTypes.string,
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
            <span className={styles.estimatedTimeLabel}>Estimated time:</span>
            <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>{this.props.estimatedTime}</span>
          </div>
          <div className={styles.elapsedTimeContainer}>
            <span className={styles.elapsedTimeLabel}>Elapsed time:</span>
            <span className={[styles.elapsedTimeValue, scriptStyles.highlighted].join(' ')}>{this.props.elapsedTime}</span>
          </div>
        </div>
      </div>
    );
  }
}
