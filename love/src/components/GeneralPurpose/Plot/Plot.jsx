/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import VegaLegend from './VegaTimeSeriesPlot/VegaLegend';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ManagerInterface, { parseTimestamp, parsePlotInputs, parseCommanderData } from 'Utils';
import { isEqual } from 'lodash';
import styles from './Plot.module.css';
const moment = extendMoment(Moment);

export default class Plot extends Component {
  static propTypes = {
    /** Title of the x axis */
    xAxisTitle: PropTypes.string,
    /** Title of the y axis */
    yAxisTitle: PropTypes.string,
    /** If true, x axis labels will be rendered as timestamps */
    temporalXAxis: PropTypes.bool,
    /** If temporalXAxis is true, this string will be used to format the x axis labels */
    temporalXAxisFormat: PropTypes.string,
    /** Position of the legends: right or bottom */
    legendPosition: PropTypes.string,
    /** If true, controls to configure the time window will be rendered */
    controls: PropTypes.bool,
    /** Inputs for the plot */
    inputs: PropTypes.object,
    /** Width of the plot in pixels */
    width: PropTypes.number,
    /** Height of the plot in pixels */
    height: PropTypes.number,
    /** Max height of the plot in pixels */
    maxHeight: PropTypes.number,
    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     *  Will be ignored if both props.width and props.height are provided */
    containerNode: PropTypes.instanceOf(Element),
    /** Object with the configuration of the timeSeriesControls */
    timeSeriesControlsProps: PropTypes.object,
    /** Object with the configuration of the efd */
    efdConfigFile: PropTypes.object,
    /** In the weatherforecast telemetries is received data in one array with time and value.
     * In other telemetries, the data is received one to one */
    isForecast: PropTypes.bool,
    /** Size of the slice array, when receive more the historical data that the window time for the visualization */
    sliceSize: PropTypes.number,
    /** In weatherforecast for the hourly telemetry, receive 14 days to the future, but It's necessary the firts 48 hours.
     * Used for the correctly operation of array between daily and hourly telemetry */
    sliceInvert: PropTypes.bool,
    /** Size array of telemetry of the weatherforecast, It's needed for the correctly slice */
    sizeLimit: PropTypes.number,
    /** Used for the multi axis when the scale of data is difference, for example the units data is percent and milimeters */
    scaleIndependent: PropTypes.bool,
    /** Used for the set limit range of the plot */
    scaleDomain: PropTypes.shape({
      domainMax: PropTypes.number,
      domainMin: PropTypes.number,
    }),
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    xAxisTitle: 'Time',
    yAxisTitle: 'Value',
    temporalXAxis: true,
    temporalXAxisFormat: '%H:%M',
    legendPosition: 'right',
    controls: false,
    inputs: {},
    // width: null,
    // height: null,
    maxHeight: 240,
    // containerNode: null,
    // timeSeriesControlsProps: null,
    // efdConfigFile: null,
    isForecast: false,
    sliceSize: 1800,
    sliceInvert: false,
    sizeLimit: 1800,
    scaleIndependent: false,
    scaleDomain: {},
  };

  static defaultStyles = [
    {
      color: '#ff7bb5',
      shape: 'circle',
      filled: false,
      orient: 'left',
      dash: [4, 0],
    },
    {
      color: '#00b7ff',
      shape: 'square',
      filled: true,
      orient: 'left',
      dash: [4, 0],
    },
    {
      color: '#97e54f',
      shape: 'diamond',
      filled: true,
      orient: 'right',
      dash: [4, 0],
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLive: props.timeSeriesControlsProps?.isLive ?? true,
      timeWindow: props.timeSeriesControlsProps?.timeWindow ?? 60,
      historicalData: props.timeSeriesControlsProps?.historicalData ?? [],
      efdClients: [],
      selectedEfdClient: null,
      containerWidth: undefined,
      containerHeight: undefined,
    };
    this.timeSeriesControlRef = React.createRef();
    this.legendRef = React.createRef();
    this.resizeObserver = undefined;
  }

  /** Queries the EFD for timeseries
   * @param {Moment} startDate - Start date of the query
   * @param {number} timeWindow - Time window in minutes
   *
   * Notes:
   * - The query is done for all inputs in props.inputs
   * - The query is done to the EFD instance
   */
  setHistoricalData = (startDate, timeWindow) => {
    const { inputs } = this.props;
    const { selectedEfdClient } = this.state;
    const cscs = parsePlotInputs(inputs);
    const parsedDate = startDate.format('YYYY-MM-DDTHH:mm:ss');
    ManagerInterface.getEFDTimeseries(parsedDate, timeWindow, cscs, '1min', selectedEfdClient).then((data) => {
      if (!data) return;
      const parsedData = parseCommanderData(data);
      this.setState({ historicalData: parsedData });
    });
  };

  /** Get pairs containing topic and item names of the form
   * [csc-index-topic, item], based on the inputs
   * @param {object} inputs - Object containing the inputs
   */
  getTopicItemPair = (inputs) => {
    const topics = {};
    Object.keys(inputs).forEach((inputKey) => {
      const input = inputs[inputKey];
      if (!input.values) {
        topics[inputKey] = [`${input.csc}-${input.salindex}-${input.topic}`, input.item];
      } else {
        Object.values(input.values).forEach((value) => {
          topics[inputKey] = [`${value.csc}-${value.salindex}-${value.topic}`, value.item];
        });
      }
    });
    return topics;
  };

  /** Get data for the plot, based on the inputs
   * @param {object} data - Data to be filtered
   * @param {number} timeWindow - Time window in minutes
   * @param {object} historicalData - Historical data
   * @param {boolean} isLive - If true, live mode is enabled
   * @param {object} inputs - Object containing the inputs
   *
   * Notes:
   * - If isLive is true, the data is filtered based on the timeWindow
   * - If isLive is false, the data is filtered based on the historicalData
   */
  getRangedData = (data, timeWindow, historicalData, isLive, inputs) => {
    let filteredData;
    const topics = this.getTopicItemPair(inputs);
    const parsedHistoricalData = Object.keys(topics).flatMap((key) => {
      const [topicName, property] = topics[key];
      return (historicalData[topicName]?.[property] ?? []).map((dp) => ({ name: key, ...dp }));
    });
    if (!isLive) {
      filteredData = parsedHistoricalData;
    } else {
      const joinedData = parsedHistoricalData.concat(data);
      filteredData = joinedData.filter((val) => {
        const currentSeconds = new Date().getTime() / 1000;
        const timemillis = val.x && val.x.ts ? val.x.ts : val.x;
        const dataSeconds = timemillis / 1000 + this.props.taiToUtc;
        if (currentSeconds - timeWindow * 60 <= dataSeconds) return true;
        return false;
      });
    }
    return filteredData;
  };

  /** Make array of data for forecast plots */
  getForecastData = (inputName, data) => {
    let result = [];
    data.forEach((d) => {
      result.push({ name: inputName, ...d });
    });
    return result;
  };

  /** Parse inputs and streams to generate data to be plotted
   * @param {object} inputs - Object containing the inputs
   * @param {object} streams - Object containing the streams
   *
   * Notes:
   * - The data is stored in the state
   * - The data is parsed based on the inputs and streams
   * - The data is also sliced based on sliceSize, sliceInver, and sizeLimit
   * - If isForecast is true, the data is parsed differently
   */
  parseInputStream(inputs, streams) {
    const { sliceSize, sizeLimit } = this.props;
    const { data } = this.state;
    const newData = {};

    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      if (inputConfig.values) {
        let inputData = data[inputName] || [];
        const lastValue = inputData[inputData.length - 1];
        let newValue = {
          name: inputName,
          values: {},
          units: {},
        };

        for (const value of Object.values(inputConfig.values)) {
          const { category, csc, salindex, topic, item, accessor, variable = 'y' } = value;
          /* eslint no-eval: 0 */
          const accessorFunc = eval(accessor);

          const streamName = `${category}-${csc}-${salindex}-${topic}`;
          if (!streams[streamName] || !streams[streamName]?.[item]) {
            continue;
          }
          const streamValue = Array.isArray(streams[streamName]) ? streams[streamName][0] : streams[streamName];
          newValue['x'] = parseTimestamp(streamValue.private_rcvStamp?.value * 1000);

          const val = accessorFunc(streamValue[item]?.value);
          const units = streamValue[item]?.units;

          if (Array.isArray(val)) {
            newValue[variable] = val;
            newValue['units'][variable] = units;
            for (let i = 0; i < val.length; i++) {
              if (newValue.values[i] === undefined) newValue.values[i] = {};
              newValue.values[i][variable] = val[i];
            }
          } else {
            newValue[variable] = val;
            newValue['units'][variable] = units;
          }
        }

        if (!this.props.isForecast) {
          // TODO: use reselect to never get repeated timestamps
          if ((!lastValue || lastValue.x?.ts !== newValue.x?.ts) && newValue.x) {
            inputData.push(newValue);
          }
        } else {
          inputData = [];
          Object.entries(newValue.values).forEach((entry) => {
            let input = Object.assign({}, entry[1]);
            input['units'] = newValue.units;
            input['x'] = parseTimestamp(entry[1]['x'] * 1000);
            inputData.push(input);
          });
        }

        // Slice inputData array if it has more than sliceSize datapoints (corresponding to one hour if telemetry is received every two seconds)
        if (inputData.length > sliceSize) {
          if (this.props.sliceInvert) {
            if (inputData.length > sizeLimit) {
              inputData = inputData.slice(-1 * sizeLimit).slice(0, sliceSize);
            } else {
              inputData = inputData.slice(0, sliceSize);
            }
          } else {
            inputData = inputData.slice(-1 * sliceSize);
          }
        }
        newData[inputName] = inputData;
      } else {
        const { category, csc, salindex, topic, item, accessor } = inputConfig;
        /* eslint no-eval: 0 */
        const accessorFunc = eval(accessor);
        let inputData = data[inputName] || [];
        const lastValue = inputData[inputData.length - 1];
        const streamName = `${category}-${csc}-${salindex}-${topic}`;
        if (!streams[streamName] || !streams[streamName]?.[item]) {
          continue;
        }
        const streamValue = Array.isArray(streams[streamName]) ? streams[streamName][0] : streams[streamName];
        const newValue = {
          name: inputName,
          x: parseTimestamp(streamValue.private_rcvStamp?.value * 1000),
          y: accessorFunc(streamValue[item]?.value),
          units: { y: streamValue[item]?.units },
        };

        // TODO: use reselect to never get repeated timestamps
        if ((!lastValue || lastValue.x?.ts !== newValue.x?.ts) && newValue.x) {
          inputData.push(newValue);
        }

        // Slice inputData array if it has more than sliceSize datapoints (corresponding to one hour if telemetry is received every two seconds)
        if (inputData.length > sliceSize) {
          if (this.props.sliceInvert) {
            if (inputData.length > sizeLimit) {
              inputData = inputData.slice(-1 * sizeLimit).slice(0, sliceSize);
            } else {
              inputData = inputData.slice(0, sliceSize);
            }
          } else {
            inputData = inputData.slice(-1 * sliceSize);
          }
        }
        newData[inputName] = inputData;
      }
    }
    if (!isEqual(data, newData)) {
      this.setState({ data: newData });
    }
  }

  setResizeObserver() {
    const { containerNode, legendPosition } = this.props;
    this.resizeObserver = new ResizeObserver((entries) => {
      // We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
      window.requestAnimationFrame(() => {
        const container = entries[0];

        const diffControl =
          this.timeSeriesControlRef && this.timeSeriesControlRef.current
            ? this.timeSeriesControlRef.current.offsetHeight + 19
            : 0;
        const diffLegend =
          legendPosition === 'bottom' && this.legendRef.current ? this.legendRef.current.offsetHeight : 0;

        this.setState({
          containerHeight: container.contentRect.height - diffControl - diffLegend,
          containerWidth: container.contentRect.width,
        });
      });
    });

    if (!(containerNode instanceof Element)) return;
    this.resizeObserver.observe(containerNode);
  }

  componentDidMount() {
    this.props.subscribeToStreams();

    // Query for available EFD clients
    ManagerInterface.getEFDClients().then(({ instances }) => this.setState({ efdClients: instances }));

    // Query for historical data if defaultEfdInstance is defined
    const { defaultEfdInstance } = this.props.efdConfigFile ?? {};
    if (defaultEfdInstance) {
      this.setState({ selectedEfdClient: defaultEfdInstance }, () => {
        this.setHistoricalData(Moment().subtract(3600, 'seconds'), 60);
      });
    }

    // Set container height and width if props are defined
    if (this.props.height !== undefined && this.props.width !== undefined) {
      this.setState({
        containerHeight: this.props.height,
        containerWidth: this.props.width,
      });
    }

    // Set resize observer if containerNode is defined
    if (this.props.width === undefined && this.props.height === undefined && this.props.containerNode) {
      this.setResizeObserver();
    }
  }

  componentDidUpdate(prevProps) {
    const { height, width, inputs, containerNode, timeSeriesControlsProps, streams } = this.props;

    // Check if timeSeriesControlsProps has changed
    if (timeSeriesControlsProps && !isEqual(prevProps.timeSeriesControlsProps, timeSeriesControlsProps)) {
      this.setState({ ...timeSeriesControlsProps });
    }

    // Check if height or width has changed so we can update the containerHeight and containerWidth
    if (width !== undefined && height !== undefined && (prevProps.width !== width || prevProps.height !== height)) {
      this.setState({
        containerHeight: this.props.height,
        containerWidth: this.props.width,
      });
    }

    // Check if containerNode has changed so we can update the resizeObserver
    if (width === undefined && height === undefined && containerNode && prevProps.containerNode !== containerNode) {
      this.setResizeObserver();
    }

    // Check if inputs or streams have changed so we can parse the input stream
    if (!isEqual(prevProps.inputs, inputs) || !isEqual(prevProps.streams, streams)) {
      this.parseInputStream(inputs, streams);
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  render() {
    const {
      xAxisTitle,
      yAxisTitle,
      inputs,
      legendPosition,
      controls,
      temporalXAxisFormat,
      scaleIndependent,
      scaleDomain,
    } = this.props;

    const { data, efdClients, containerWidth, containerHeight, isLive, timeWindow, historicalData } = this.state;
    const layerTypes = ['lines', 'bars', 'pointLines', 'arrows', 'areas', 'spreads', 'bigotes', 'rects', 'heatmaps'];
    const layers = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const { type } = inputConfig;
      const typeStr = type + 's';
      if (!layerTypes.includes(typeStr)) {
        continue;
      }

      if (isLive && !data[inputName]) continue;

      let rangedInputData;
      rangedInputData = this.props.isForecast
        ? this.getForecastData(inputName, data[inputName])
        : this.getRangedData(data[inputName], timeWindow, historicalData, isLive, inputs);
      layers[typeStr] = (layers[typeStr] ?? []).concat(rangedInputData);
    }

    const legend = Object.keys(inputs).map((inputName, index) => {
      return {
        label: inputName,
        name: inputName,
        markType: inputs[inputName].type,
      };
    });

    const marksStyles = Object.keys(inputs).map((input, index) => {
      return {
        name: input,
        ...Plot.defaultStyles[index % Plot.defaultStyles.length],
        ...(inputs[input].color !== undefined ? { color: inputs[input].color } : {}),
        ...(inputs[input].dash !== undefined ? { dash: inputs[input].dash } : {}),
        ...(inputs[input].shape !== undefined ? { shape: inputs[input].shape } : {}),
        ...(inputs[input].filled !== undefined ? { filled: inputs[input].filled } : {}),
        ...(inputs[input].orient !== undefined ? { orient: inputs[input].orient } : { orient: 'right' }),
      };
    });

    /** Fill marksStyles to satisfy the VegaTimeseriesPlot and VegaLegend APIs */
    const completedMarksStyles = legend.map(({ name, markType }, index) => {
      const style = marksStyles?.find((style) => style.name === name);
      if (!style) {
        return {
          ...Plot.defaultStyles[index % Plot.defaultStyles.length],
          ...(markType !== undefined ? { markType } : {}),
          name,
        };
      }
      return {
        ...style,
        ...(markType !== undefined ? { markType } : {}),
      };
    });

    return (
      <>
        {controls && (
          <div ref={this.timeSeriesControlRef}>
            <TimeSeriesControls
              setTimeWindow={(timeWindow) => this.setState({ timeWindow })}
              timeWindow={this.state.timeWindow}
              setLiveMode={(isLive) => this.setState({ isLive })}
              isLive={this.state.isLive}
              setHistoricalData={this.setHistoricalData}
              efdClients={efdClients}
              selectedEfdClient={this.state.selectedEfdClient}
              setEfdClient={(client) => this.setState({ selectedEfdClient: client })}
            />
          </div>
        )}
        {legendPosition === 'right' ? (
          <div className={[styles.containerFlexRow].join(' ')}>
            <VegaTimeseriesPlot
              layers={layers}
              xAxisTitle={xAxisTitle}
              yAxisTitle={yAxisTitle}
              marksStyles={completedMarksStyles}
              temporalXAxis
              width={containerWidth - 160} // from the .autogrid grid-template-columns
              height={containerHeight}
              className={styles.plot}
              temporalXAxisFormat={temporalXAxisFormat}
              scaleIndependent={scaleIndependent}
              scaleDomain={scaleDomain}
            />
            <VegaLegend listData={legend} marksStyles={completedMarksStyles} />
          </div>
        ) : (
          <div
            className={[styles.containerFlexCol].join(' ')}
            style={this.props.maxHeight ? { maxHeight: this.props.maxHeight } : {}}
          >
            <div>
              <VegaTimeseriesPlot
                layers={layers}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                marksStyles={completedMarksStyles}
                temporalXAxis
                width={containerWidth - 30} // from the .autogrid grid-template-columns
                height={containerHeight}
                className={styles.plot}
                temporalXAxisFormat={temporalXAxisFormat}
                scaleIndependent={scaleIndependent}
                scaleDomain={scaleDomain}
              />
            </div>
            <div ref={this.legendRef} className={styles.marginLegend}>
              <VegaLegend listData={legend} marksStyles={completedMarksStyles} />
            </div>
          </div>
        )}
      </>
    );
  }
}