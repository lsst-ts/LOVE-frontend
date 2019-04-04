import React, { PureComponent } from 'react';
import moment from 'moment';
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import ManagerInterface, { telemetryObjectToVegaList, getFakeHistoricalTimeSeries, hasFakeData } from '../../Utils';
import Vega from '../Vega/Vega';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import styles from './TimeSeries.module.css';

export default class TimeSeries extends PureComponent {
  constructor() {
    super();

    this.state = {
      telemetryName: 'test',
      step: 0,
      lastMessageData: [],
      dateStart: new Date().getTime() - 60 * 60 * 1000,
      dateEnd: new Date(),
      isLive: true,
      timeWindow: 60,
      historicalData: [],
      subscribedStreams: [],
      selectedRows: [],
    };

    this.managerInterface = new ManagerInterface();
  }

  onSetSelection = (selectedRows) => {
    const streams = selectedRows.map((rowKeyValue) => {
      const splitKey = rowKeyValue.key.split('-');
      return [splitKey[0], splitKey[1]];
    });
    const streamsSet = new Set(streams);
    streamsSet.forEach((stream) => {
      this.managerInterface.subscribeToTelemetry(stream[0], stream[1], this.onReceiveMsg);
    });
    this.setState({
      telemetryName: selectedRows[0].key,
      subscribedStreams: streamsSet,
      selectedRows,
      step: 1,
    });
  };

  componentWillUnmount = () => {
    this.state.subscribedStreams.forEach((stream) => {
      // eslint-disable-next-line
      this.managerInterface.unsubscribeToTelemetry(stream[0], stream[1], (msg) => console.log(msg));
    });
  };

  onReceiveMsg = (msg) => {
    if (!this.state.isLive) return;
    const data = JSON.parse(msg.data);
    const dateEnd = new Date();
    const dateStart = moment(dateEnd)
      .subtract(this.state.timeWindow, 'minutes')
      .toDate();
    if (typeof data.data === 'object') {
      let timestamp = new Date();
      timestamp = timestamp
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '/')
        .replace('T', ' ');
      const newEntries = telemetryObjectToVegaList(data.data, this.state.selectedRows, timestamp);
      this.setState({
        lastMessageData: newEntries,
        dateStart,
        dateEnd,
      });
    }
  };

  setTimeWindow = (timeWindow) => {
    const now = new Date();
    this.setState({
      timeWindow,
      dateEnd: now,
      dateStart: moment(now)
        .subtract(timeWindow, 'minutes')
        .toDate(),
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!hasFakeData) {
      return;
    }
    if (prevState.step !== this.state.step && this.state.step === 1) {
      const d = getFakeHistoricalTimeSeries(this.state.selectedRows, new Date().getTime() - 3600 * 1000, new Date());
      this.setState({
        historicalData: d,
      });
    }
    if (prevState.timeWindow !== this.state.timeWindow) {
      const d = getFakeHistoricalTimeSeries(this.state.selectedRows, this.state.dateStart, this.state.dateEnd);
      this.setState({
        historicalData: d,
      });
    }
  };

  setLiveMode = (isLive) => {
    // console.log('islive', isLive);
    this.setState({
      isLive,
    });
  };

  setHistoricalData = (dateStart, dateEnd) => {
    if (hasFakeData) {
      this.setState({
        dateStart,
        dateEnd,
        isLive: false,
        historicalData: getFakeHistoricalTimeSeries(this.state.selectedRows, dateStart, dateEnd),
      });
    }
  };

  goBack = () => {
    this.setState({
      step: 0,
    });
  };

  render() {
    const columnsToDisplay = [
      'selection_column',
      'component',
      'stream',
      'name',
      'param_name',
      'data_type',
      'value',
      'units',
    ];

    return this.state.step === 0 ? (
      <RawTelemetryTable
        telemetries={this.props.telemetries}
        {...this.state}
        columnsToDisplay={columnsToDisplay}
        checkedFilterColumn="units"
        onSetSelection={this.onSetSelection}
      />
    ) : (
      <div className={styles.timeseriesContainer}>
        <TimeSeriesControls
          setTimeWindow={this.setTimeWindow}
          timeWindow={String(this.state.timeWindow)}
          setLiveMode={this.setLiveMode}
          isLive={this.state.isLive}
          setHistoricalData={this.setHistoricalData}
          goBack={this.goBack}
        />
        <Vega
          telemetryName={this.state.telemetryName.split('-')[2]}
          historicalData={this.state.historicalData}
          lastMessageData={this.state.lastMessageData}
          dateStart={this.state.dateStart}
          dateEnd={this.state.dateEnd}
          dataType={this.state.selectedRows[0].value.dataType}
        />
      </div>
    );
  }
}
