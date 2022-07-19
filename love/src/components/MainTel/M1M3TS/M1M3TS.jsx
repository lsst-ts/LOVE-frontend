import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Summary from'./Summary/Summary';
import Menu from'./Menu/Menu';
import Selector from'./Selector/Selector';
import Mixing from'./Mixing/Mixing';
import TemperatureGradiant from'./Temperature/TemperatureGradiant';
import Info from'./Info/Info';

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
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  }
  static defaultProps = {
    minTemperatureLimit: 0,
    maxTemperatureLimit: 1000,
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const { 
      minTemperatureLimit,
      maxTemperatureLimit,
    } = this.props;
    const { summaryState} = this.props;

    return (
      <div className={styles.container}>
        
        <div className={styles.summaryContainer}>
          <Summary />
        </div>

        <div className={styles.menuContainer}>
          <Menu />
        </div>

        <div className={styles.selectorContainer}>
          <Selector />
        </div>

        <div className={styles.mixingContainer}>
          <Mixing />
        </div>

        <div className={styles.temperatureContainer}>
          <TemperatureGradiant />
        </div>

        <div className={styles.infoContainer}>
          <Info />
        </div>

      </div>
    );
  }
}