import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import { defaultNumberFormatter } from 'Utils';
import styles from './Mixing.module.css';
import message from 'components/ScriptQueue/QueueMessage';

export default class Mixing extends Component {
  static propTypes = {
    /** Value of valve position for see in progress bar. */
    value: PropTypes.number,
  };
  static defaultProps = {
    value: 0,
  };

  render() {
    const { value } = this.props;
    return (
      <>
        <div className={styles.containerTop}>
          <span className={styles.title}>Mixing Value</span>
        </div>
        <div>
          <ProgressBar completed={value} height={36} hideCompleted={true} />
        </div>
        <div className={styles.containerBottom}>
          <span className={styles.labelValue} style={{ left: 0 }}>
            <span className={styles.label}>Valve Position </span>
            <span className={styles.value}>{`${defaultNumberFormatter(value, 1)}%`}</span>
          </span>
        </div>
      </>
    );
  }
}
