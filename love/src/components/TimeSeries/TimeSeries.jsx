import React, { PureComponent } from 'react';
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import ManagerInterface, { telemetryObjectToVegaList, getFakeHistoricalTimeSeries } from '../../Utils';
import Vega from '../Vega/Vega';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import moment from 'moment';
import { getFakeUnits } from '../../Utils';

export default class TimeSeries extends PureComponent {
  constructor() {
    super();

    this.state = {
      specDataType: 'quantitative',
      telemetryName: 'test',
      step: 0,
      lastMessageData: [],
      dateStart: new Date().getTime() - 60 * 60 * 1000,
      dateEnd: new Date(),
      isLive: true,
      timeWindow: 60,
    };

    this.managerInterface = new ManagerInterface();

    this.historicalData = [];
  }

  getSpec = (data, name) => {
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      description: "Google's stock price over time.",
      data: {
        values: data,
        name: 'telemetries',
      },
      mark: this.state.specDataType === 'quantitative' ? 'line' : 'point',
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          title: 'date',
        },
        y: {
          field: 'value',
          type: this.state.specDataType,
          title: getFakeUnits(name),
        },
        color: {
          field: 'source',
          type: 'nominal',
          legend: {
            title: 'Parameter Names' + ' '.repeat(32),
          },
        },
      },
    };
  };

  getSpecDataType = (dataType) => {
    if (dataType === 'String') return 'nominal';
    else return 'quantitative';
  };

  onSetSelection = (selectedRows) => {
    const streams = selectedRows.map((rowKeyValue) => {
      return rowKeyValue.key.split('-')[1];
    });
    const streamsSet = new Set(streams);
    streamsSet.forEach((stream) => {
      this.managerInterface.subscribeToTelemetry(stream, this.onReceiveMsg);
    });
    this.setState({
      telemetryName: selectedRows[0].key,
      specDataType: this.getSpecDataType(selectedRows[0].value.dataType),
      subscribedStreams: streamsSet,
      selectedRows: selectedRows,
      step: 1,
    });
  };

  componentWillUnmount = () => {
    this.state.subscribedStreams.forEach((stream) => {
      this.managerInterface.unsubscribeToTelemetry(stream, (msg) => console.log(msg));
    });
  };

  onReceiveMsg = (msg) => {
    if(!this.state.isLive)
      return;
    let data = JSON.parse(msg.data);
    console.log(data);
    let dateEnd = new Date();
    let dateStart = moment(dateEnd)
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
        dateStart: dateStart,
        dateEnd: dateEnd,
      });
    }
  };

  setTimeWindow = (timeWindow) => {
    this.setState({
      timeWindow: timeWindow,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.step !== this.state.step && this.state.step === 1) {
      this.historicalData = getFakeHistoricalTimeSeries(
        this.state.selectedRows,
        new Date().getTime() - 3600 * 1000,
        new Date(),
      );
    }
  };

  setLiveMode = (isLive) => {
    console.log('islive', isLive);
    this.setState({
      isLive: isLive,
    });
  };

  setHistoricalData = (dateStart, dateEnd) => {
    this.historicalData = getFakeHistoricalTimeSeries(
      this.state.selectedRows,
      dateStart,
      dateEnd,
    );
    this.setState({
      dateStart,
      dateEnd,
      isLive: false,
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
    let props = {
      setTimeWindow: this.setTimeWindow,
      timeWindow: this.state.timeWindow,
      setLiveMode: this.setLiveMode,
      isLive: this.state.isLive,
      setHistoricalData: this.setHistoricalData,
    };
    return this.state.step === 0 ? (
      <RawTelemetryTable
        telemetries={this.props.telemetries}
        {...this.state}
        columnsToDisplay={columnsToDisplay}
        checkedFilterColumn="units"
        onSetSelection={this.onSetSelection}
      />
    ) : (
      <>
        <h1>Plot title</h1>
        <TimeSeriesControls {...props} />
        <Vega
          spec={this.getSpec(this.state.lastMessageData, this.state.telemetryName.split('-')[2])}
          lastMessageData={this.state.lastMessageData}
          dateStart={this.state.dateStart}
          dateEnd={this.state.dateEnd}
          historicalData={this.historicalData}
        />
      </>
    );
  }
}
