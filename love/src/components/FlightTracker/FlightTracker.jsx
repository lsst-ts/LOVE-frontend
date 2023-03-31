import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './FlightTracker.module.css';
import MapFlightTracker from './MapFlightTracker';
import { formatSecondsToDigital } from 'Utils';
import SummaryPanel from '../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../GeneralPurpose/SummaryPanel/Row';
import Label from '../GeneralPurpose/SummaryPanel/Label';
import Value from '../GeneralPurpose/SummaryPanel/Value';
import Title from '../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import isEqual from 'lodash';
import time from 'redux/reducers/time';

export default class FlightTracker extends Component {
  static propTypes = {
    planes: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      timers: { 1: 600 },
    };
  }

  planeInRadio = (position, radio) => {
    const xc = 10;
    const yc = 10;
    const d2 = (position[0] - xc) ** 2 + (position[1] - yc) ** 2;
    const d = Math.sqrt(d2);
    return d <= radio;
  };

  componentDidUpdate = (prevProps, prevState) => {
    const RADIO = 10;
    if (!isEqual(prevProps.planes, this.props.planes)) {
      this.props.planes.map((value) => {
        if (this.planeInRadio(value.position, RADIO)) {
          if (this.state.timers[value.id] === undefined) {
            this.setState((prevState) => ({ ...prevState.timers, [value.id]: 600 }));
          }
        } else {
          if (prevState.timers[value.id] != undefined) {
            const copyTimers = { ...this.state.timers };
            delete copyTimers[value.id];
            this.setState({ timers: copyTimers });
          }
        }
      });
    }
  };

  componentDidMount = () => {
    const myInterval = setInterval(() => {
      this.setState((prevState) => this.changeStateTimer(prevState.timers));
    }, 1000);
  };

  changeStateTimer(timers) {
    const newTimers = timers;
    for (const [key, value] of Object.entries(newTimers)) {
      if (value === 0) {
      }
      newTimers[key] = value - 1;
    }

    return newTimers;
  }


  render() {
    return (
      <div className={styles.container}>
        <MapFlightTracker planes={[]}></MapFlightTracker>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Time</Title>
          <Value>
            <StatusText title={formatSecondsToDigital(this.state.timers['1'])} status={'running'} small>
              {formatSecondsToDigital(this.state.timers['1'])}
            </StatusText>
          </Value>
        </SummaryPanel>
      </div>
    );
  }
}   