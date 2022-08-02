import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { signals, effects, alertSignalIndexes } from '../../Config';
import GISContainerSignals from './GISContainerDetectionSignals';
import GISContainerEffects from './GISContainerEffectsActuation';
import isEqual from 'lodash/isEqual';
export default class GIS extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      activeEffects: [],
      redEffects: [],
      alertSignals: [],
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!isEqual(prevProps.interlocksStatus, this.props.interlocksStatus)) {
      // console.log("ENTRA!");
      const systemsSignals = Object.entries(signals);
      const rawStatus = this.props.interlocksStatus;
      const redEffects = [];
      const alertSignals = [];
      systemsSignals.forEach(([system, systemSignals]) => {
        const sSignals = Object.keys(systemSignals);
        sSignals.forEach((signal) => {
          const effects = systemSignals[signal];

          const systemIndex = alertSignalIndexes[signal][0];
          const bitIndex = alertSignalIndexes[signal][1];
          const bitArray = rawStatus[systemIndex].toString(2); // tema cantidad de bits !recordar
          const activeAlert = bitArray[bitIndex] === '1';

          if (activeAlert) {
            redEffects.push(...effects);
            alertSignals.push(signal);
          }
        });
      });

      this.setState({ redEffects, alertSignals });
    }
  };

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  signalOnEnter = (effects) => {
    // console.log(effects);
    this.setState({ activeEffects: effects });
  };

  signalOnLeave = () => {
    this.setState({ activeEffects: [] });
  };

  render() {
    const rawStatus = this.props.interlocksStatus;
    const { activeEffects, redEffects, alertSignals } = this.state;
    // const flattenedSignals = Object.values(signals).map((signals) => Object.values(signals)).flat();
    const flattenedSignals = Object.entries(signals);
    const effectsArray = Object.entries(effects);

    // console.log(redEffects);
    console.log(alertSignals);
    return (
      <div className={styles.div}>
        <GISContainerSignals
          signals={flattenedSignals}
          alertSignalIndexes={alertSignalIndexes}
          rawStatus={rawStatus}
          alertSignals={alertSignals}
          onHoverIn={(effects) => this.signalOnEnter(effects)}
          onHoverOut={() => this.signalOnLeave()}
        />
        {/* <div className={styles.separator}></div> */}
        <GISContainerEffects effects={effectsArray} activeEffects={activeEffects} redEffects={redEffects} />
      </div>
    );
  }
}
