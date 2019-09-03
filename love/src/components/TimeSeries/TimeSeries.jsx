import React, { PureComponent } from 'react';
import moment from 'moment';
import TelemetrySelectionTableContainer from '../HealthStatusSummary/TelemetrySelectionTable/TelemetrySelectionTable.container';
import ManagerInterface, { telemetryObjectToVegaList, getFakeHistoricalTimeSeries } from '../../Utils';
import Vega from '../Vega/Vega';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import { hasFakeData } from '../../Config';
import styles from './TimeSeries.module.css';
import TimeSeriesPlotContainer from '../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container';

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

  onSetSelection = (selectedRows, data) => {
    let streams = {};
    data.forEach((row) => {
      streams[row.name] = {
        paramName: row.param_name,
        streamKey: `telemetry-${row.component}-${row.stream}`,
      };
    });
    this.setState({
      telemetryName: selectedRows[0].key,
      subscribedStreams: streams,
      selectedRows,
      step: 1,
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

    const streams = this.state.subscribedStreams;
    const dataSources = Object.keys(streams);
    let layers = {};
    let groupNames = {};
    let accessors = {};
    const encoding = {
      color: {
        scale: {
          domain: dataSources,
        },
      },
      x: {
        axis: {
          format: '%X',
          labelOverlap: 'parity',
        },
      },
    };
    dataSources.forEach((key) => {
      layers[key] = {
        mark: {
          interpolate: 'linear',
        },
      };
      groupNames[key] = streams[key].streamKey;
      accessors[key] = (stream) => stream[streams[key].paramName].value;
    });

    return this.state.step === 0 ? (
      <TelemetrySelectionTableContainer
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
        <TimeSeriesPlotContainer
          dataSources={dataSources}
          layers={layers}
          encoding={encoding}
          groupNames={groupNames}
          accessors={accessors}
          dateInterval={this.state.timeWindow * 60 * 1000}
          width={600}
          height={600 / 1.77}
        />
      </div>
    );
  }
}
