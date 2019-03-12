import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCDetail.module.css';

export default class CSCDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    data: {},
  };

  static states = {
    0: {
      name: 'UNKNOWN',
      userReadable: 'Unknown',
      char: 'U',
      class: styles.disabled,
    },
    1: {
      name: 'DISABLED',
      userReadable: 'Disabled',
      char: 'D',
      class: styles.disabled,
    },
    2: {
      name: 'ENABLED',
      userReadable: 'Enabled',
      char: 'E',
      class: styles.ok,
    },
    3: {
      name: 'FAULT',
      userReadable: 'Fault',
      char: 'F',
      class: styles.alert,
    },
    4: {
      name: 'OFFLINE',
      userReadable: 'Offline',
      char: 'O',
      class: styles.disabled,
    },
    5: {
      name: 'STANDBY',
      userReadable: 'Standby',
      char: 'S',
      class: styles.warning,
    },
  };

  constructor(props) {
    super(props);
  }

  render() {
    const selfData = this.props.data[this.props.name];
    const summaryStateValue = selfData ? selfData.summaryState : 0;
    // const summaryStateValue = Math.random();
    const summaryState = CSCDetail.states[summaryStateValue];
    return (
      <div className={styles.CSCDetailContainer}>
        <div className={[styles.leftSection, summaryState.class].join(' ')}>
          <span className={styles.summaryState} title={summaryState.userReadable}>
            {summaryState.char}
          </span>
          <span className={styles.summaryState} title={summaryState.userReadable}>
            ?
          </span>
        </div>
        <div className={styles.rightSection}>{this.props.name}</div>
      </div>
    );
  }
}
