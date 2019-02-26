import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './WaitingScript.module.css';
import scriptStyles from '../Scripts.module.css';

export default class WaitingScript extends Component {
  static propTypes = {
    salIndex: PropTypes.number,
    isStandard: PropTypes.bool,
    path: PropTypes.string,
    estimatedTime: PropTypes.number,
    state: PropTypes.string,
    isCompact: PropTypes.bool,
  };
  static defaultProps = {
    salIndex: 0,
    isStandard: true,
    path: 'auxtel/at_calsys_takedata.py',
    estimatedTime: 0,
    state: 'Unknown',
    isCompact: false,
  };

  render() {
    const path = this.props.path;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    const fileExtension = path.substring(path.lastIndexOf('.'));
    return (
      <div className={scriptStyles.scriptContainer}>
        <div className={scriptStyles.pathTextContainer}>
          {!this.props.isCompact ? <span className={scriptStyles.pathText}>{fileFolder}</span> : null}
          <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
          {!this.props.isCompact ? <span className={scriptStyles.pathText}>{fileExtension}</span> : null}
        </div>
        <div className={styles.estimatedTimeContainer}>
          <span className={styles.estimatedTimeLabel}>Estimated time: </span>
          <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>{this.props.estimatedTime}</span>
        </div>
      </div>
    );
  }
}
