import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import styles from './ObservatorySummary.module.css';
import SummaryPanel from '../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../GeneralPurpose/SummaryPanel/Label';
import Value from '../GeneralPurpose/SummaryPanel/Value';
import Title from '../GeneralPurpose/SummaryPanel/Title';

const POOLING_TIME = 3000;

export default class ObservatorySummary extends Component {
  static propTypes = {
    /** Simonyi Telescope Observing Mode */
    simonyiObservingMode: PropTypes.string,
    /** Simonyi Telescope Tracking State */
    simonyiTrackingState: PropTypes.string,
    /** Auxiliary Telescope Observing Mode */
    auxtelObservingMode: PropTypes.string,
    /** Auxiliary Telescope Tracking State */
    auxtelTrackingState: PropTypes.string,
  };

  static defaultProps = {
    simonyiObservingMode: 'Unknown',
    simonyiTrackingState: 'Unknown',
    auxtelObservingMode: 'Unknown',
    auxtelTrackingState: 'Unknown',
  };

  componentDidMount() {
    this.props.subscribeToStream();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStream();
  }

  render() {
    const {
      simonyiObservingMode,
      simonyiTrackingState,
      auxtelObservingMode,
      auxtelTrackingState,
      controlLocation,
    } = this.props;

    const controlLocationName = controlLocation
      ? controlLocation.name.charAt(0).toUpperCase() + controlLocation.name.slice(1)
      : 'Unknown';

    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.row2}>
          <Title wide>Simonyi Telescope</Title>
          <Label>Operation Mode</Label>
          <Value>Unknown</Value>
          <Label>Observation Mode</Label>
          <Value>{simonyiObservingMode}</Value>
          <Label>Tracking Mode</Label>
          <Value>{simonyiTrackingState}</Value>
          <Label>Power Source</Label>
          <Value>Unknown</Value>
        </SummaryPanel>

        <SummaryPanel>
          <Title wide>Vera C. Rubin Observatory</Title>
          <Label>Control</Label>
          <Value>{controlLocationName}</Value>
          <Label>Power Source</Label>
          <Value>Unknown</Value>
        </SummaryPanel>

        <SummaryPanel>
          <Title wide>Auxiliary Telescope</Title>
          <Label>Operation Mode</Label>
          <Value>Unknown</Value>
          <Label>Observation Mode</Label>
          <Value>{auxtelObservingMode}</Value>
          <Label>Tracking Mode</Label>
          <Value>{auxtelTrackingState}</Value>
          <Label>Power Source</Label>
          <Value>Unknown</Value>
        </SummaryPanel>
      </div>
    );
  }
}
