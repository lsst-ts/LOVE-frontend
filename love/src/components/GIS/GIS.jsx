import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { signals, effects, signalIndexes } from '../../Config';
import GISContainerSignals from './GISContainerDetectionSignals';
import GISContainerEffects from './GISContainerEffectsActuation';
import { result } from 'lodash';

const alertSignals = ['fireSignal', 'manLiftNotParked'];
export default class GIS extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      activeEffects: [],
      // redEffects: ['fireIndication'],
    };
  }

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevProps.alertSignals !== this.props.alertSignals) {
  //     console.log("CHANGE ON ALERTSIGNALS");
  //     // Armar red effects
  //     const newRedEffects = [];
  //     this.setState({ redEffects: newRedEffects });
  //   }
  // }

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
    const { activeEffects /*redEffects*/ } = this.state;
    // const flattenedSignals = Object.values(signals).map((signals) => Object.values(signals)).flat();
    const flattenedSignals = Object.entries(signals);
    const effectsArray = Object.entries(effects);

    const onlySignals = Object.values(signals);
    const redEffects = [];
    alertSignals.forEach((alertSignal) => {
      onlySignals.forEach((signal) => {
        if (Object.keys(signal).includes(alertSignal)) {
          redEffects.push(...signal[alertSignal]);
        }
      });
    });

    return (
      <div className={styles.div}>
        <GISContainerSignals
          signals={flattenedSignals}
          alertSignals={alertSignals}
          signalIndexes={signalIndexes}
          onHoverIn={(effects) => this.signalOnEnter(effects)}
          onHoverOut={() => this.signalOnLeave()}
        />
        {/* <div className={styles.separator}></div> */}
        <GISContainerEffects effects={effectsArray} activeEffects={activeEffects} redEffects={redEffects} />
      </div>
    );
  }
}
