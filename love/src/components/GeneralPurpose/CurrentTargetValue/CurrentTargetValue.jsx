import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CurrentTargetValue.module.css';
import RightArrowIcon from '../../icons/RightArrowIcon/RightArrowIcon';

export default class CurrentTargetValue extends Component {
  static propTypes = {
    /** Current value */
    currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Target value */
    targetValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Whether the value is still reaching the target value */
    isChanging: PropTypes.bool,
  };

  static defaultProps = {
    currentValue: 0,
    targetValue: 0,
  };

  render() {
    const isChanging = this.props.currentValue !== this.props.targetValue;
    return (
      <span className={styles.statusTextWrapper}>
        <span className={styles.telemetryValue}>{this.props.currentValue.toFixed ? this.props.targetValue.toFixed(3) : this.props.targetValue}º</span>
        {isChanging ? (
          <>
            <span className={styles.arrow}>
              <RightArrowIcon />
            </span>
            <span className={styles.telemetryValue}>
              {this.props.targetValue.toFixed ? this.props.targetValue.toFixed(3) : this.props.targetValue}º
            </span>
          </>
        ) : null}
      </span>
    );
  }
}
