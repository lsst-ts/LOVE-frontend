import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import { defaultNumberFormatter } from 'Utils';
import styles from './Mixing.module.css';
import message from 'components/ScriptQueue/QueueMessage';

export default class Mixing extends Component {
  static propTypes = {
    commanded: PropTypes.number,
    measured: PropTypes.number,
  };
  static defaultProps = {
    commanded: 85.5,
    measured: 30.6,
  };

  render() {
    const {commanded, measured} = this.props;
    return (
      <>
      <div className={styles.containerTop}>
        <span className={styles.title}>Mixing Value</span>
      </div>
      <div>
        <ProgressBar
          targetValue={commanded}
          completed={measured}
          height={36}
          hideCompleted={true}
        />
      </div>
      <div className={styles.containerBottom}>
        <span className={styles.labelValue } style={{ left: 0 }}>
          <span className={styles.label}>Commanded </span>
          <span className={styles.value}>{`${defaultNumberFormatter(commanded, 1)}%`}</span>
        </span>
        <span className={styles.labelValue } style={{ right: 0 }}>
          <span className={styles.label}>Measured </span>
          <span className={styles.value}>{`${defaultNumberFormatter(measured, 1)}%`}</span>
        </span>

      </div>
      </>
    )
  }
}
