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
    /** Value of limit position for see in progress bar. (Not is using in this case). */
    limit: PropTypes.number,
  };
  static defaultProps = {
    value: 0.5,
    limit: 0.5,
  };

  render() {
    const {value, limit} = this.props;
    return (
      <>
      <div className={styles.containerTop}>
        <span className={styles.title}>Mixing Value</span>
      </div>
      <div>
        <ProgressBar
          /* targetValue={100} */
          completed={value}
          height={36}
          hideCompleted={true}
        />
      </div>
      <div className={styles.containerBottom}>
        <span className={styles.labelValue } style={{ left: 0 }}>
          <span className={styles.label}>Valve Position </span>
          <span className={styles.value}>{`${defaultNumberFormatter(value, 1)}%`}</span>
        </span>
        <span className={styles.labelValue } style={{ right: 0 }}>
        {/*   
          <span className={styles.label}>Measured </span>
          <span className={styles.value}>{`${defaultNumberFormatter(limit, 1)}%`}</span>
         */}
        </span>

      </div>
      </>
    )
  }
}
