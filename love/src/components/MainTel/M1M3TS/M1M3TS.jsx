import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './M1M3TS.module.css';

export default class M1M3TS extends Component {

  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,

    /** Current summary state of the CSC. High level state machine state identifier. */
    summaryState: PropTypes.number,

    /** Number of the minimum force limit, used for the gradiant color */
    minForceLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxForceLimit: PropTypes.number,
  }
  static defaultProps = {
    minForceLimit: 0,
    maxForceLimit: 1000,
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const { 
      minForceLimit,
      maxForceLimit,
    } = this.props;
    const { summaryState} = this.props;

    return (
      <div className={styles.container}>
      </div>
    );
  }
}