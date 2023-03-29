import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { signals, effects, alertSignalIndexes, signalBypassIndexes } from '../../Config';
import GISContainerSignals from './GISContainerDetectionSignals';
import GISContainerEffects from './GISContainerEffectsActuation';
import isEqual from 'lodash/isEqual';
export default class GIS extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** The raw status of the interlock */
    interlocksStatus: PropTypes.array,
  };

  static defaultProps = {
    interlocksData: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      activeEffects: [],
      alertEffects: [],
      alertSignals: [],
    };
  }

  signalOnEnter = (effects) => {
    this.setState({ activeEffects: effects });
  };

  signalOnLeave = () => {
    this.setState({ activeEffects: [] });
  };

  updateInterlockStatuses = () => {
    const { interlocksStatus } = this.props;
    const systemsSignals = Object.entries(signals);
    const rawStatus = interlocksStatus.match(/.{1,16}/g);
    const alertEffects = [];
    const alertSignals = [];
    systemsSignals.forEach(([system, systemSignals]) => {
      const sSignals = Object.keys(systemSignals);
      sSignals.forEach((signal) => {
        const effects = systemSignals[signal];

        const [systemIndex, bitIndex] = alertSignalIndexes[signal];
        const bitArray = rawStatus[systemIndex].padEnd(16, '0');
        const activeAlert = bitArray[bitIndex] === '1';

        const [bypassSystemIndex, bypassBitIndex] = signalBypassIndexes[signal];
        const bypassBitArray = rawStatus[bypassSystemIndex].toString(2).padEnd(16, '0');
        const bypassedAlert = bypassBitArray[bypassBitIndex] === '1';

        if (activeAlert && !bypassedAlert) {
          alertEffects.push(...effects);
          alertSignals.push(signal);
        }
      });
    });

    this.setState({ alertEffects, alertSignals });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.interlocksStatus && prevProps.interlocksStatus !== this.props.interlocksStatus) {
      this.updateInterlockStatuses();
    }
  };

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const { activeEffects, alertEffects, alertSignals } = this.state;
    const flattenedSignals = Object.entries(signals);
    const effectsArray = Object.entries(effects);

    return (
      <div className={styles.div}>
        <GISContainerSignals
          signals={flattenedSignals}
          alertSignals={alertSignals}
          onHoverIn={(effects) => this.signalOnEnter(effects)}
          onHoverOut={() => this.signalOnLeave()}
        />
        <div className={styles.separator}></div>
        <GISContainerEffects effects={effectsArray} activeEffects={activeEffects} alertEffects={alertEffects} />
      </div>
    );
  }
}
