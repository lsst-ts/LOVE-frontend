import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import VegaTimeseriesPlot from '../Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import TimeSeriesControls from '../Plot/TimeSeriesControls/TimeSeriesControls';
import VegaLegend from '../Plot/VegaTimeSeriesPlot/VegaLegend';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ManagerInterface, { parseTimestamp, parsePlotInputs, parseCommanderData } from 'Utils';
import { defaultStyles } from './NewPlot.container';
import styles from './NewPlot.module.css';

const moment = extendMoment(Moment);


export default class NewPlot extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Title of the x axis */
    xAxisTitle: PropTypes.string,
    /** Title of the y axis */
    yAxisTitle: PropTypes.string,
    /** If true, x axis labels will be rendered as timestamps */
    temporalXAxis: PropTypes.bool,
    legendPosition: PropTypes.string,
    controls: PropTypes.bool,
    inputs: PropTypes.object,
    /** Width of the plot in pixels */
    width: PropTypes.number,
    /** Height of the plot in pixels */
    height: PropTypes.number,
    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     *  Will be ignored if both props.width and props.height are provided */
    containerNode: PropTypes.node,
    timeSeriesControlsProps: PropTypes.object,
    efdConfigFile: PropTypes.object,
  };

  static defaultProps = {
  };


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLive: true,
      timeWindow: 60,
      historicalData: [],
      efdClients: [],
      selectedEfdClient: null,
      containerWidth: undefined, 
      containerHeight: undefined,
    };
    this.containerRef = React.createRef();
  }

  /* setIsLive = (isLive) => {
    this.setState({ isLive: isLive });
  }

  setTimeWindow = (timeWindow) => {
    this.setState({ timeWindow: timeWindow });
  } */

  /* setEfdClient = (client) => {
    this.setState({ selectedEfdClient: client });
  } */

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

  // Get pairs containing topic and item names of the form
  // [csc-index-topic, item], based on the inputs
  getTopicItemPair = (inputs) => {
    const topics = {};
    Object.keys(inputs).forEach((inputKey) => {
      const input = inputs[inputKey];
      topics[inputKey] = [`${input.csc}-${input.salindex}-${input.topic}`, input.item];
    });
    return topics;
  };

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
        const dataSeconds = val.x.toMillis() / 1000 + this.props.taiToUtc;
        if (currentSeconds - timeWindow * 60 <= dataSeconds) return true;
        return false;
      });
    }
    return filteredData;
  };

  componentDidMount() {
    this.props.subscribeToStreams();
    ManagerInterface.getEFDClients().then(({ instances }) => this.setState({ efdClients: instances }));
    const { defaultEfdInstance } = this.props.efdConfigFile ?? {};
    if (defaultEfdInstance) {
      this.setState({ selectedEfdClient: defaultEfdInstance }, () => {
        this.setHistoricalData(Moment().subtract(3600, 'seconds'), 60);
      });
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    const { timeSeriesControlsProps, inputs, streams } = this.props;
    const { data } = this.state;
    if (prevProps.timeSeriesControlsProps !== timeSeriesControlsProps) {
      this.setState({ ...timeSeriesControlsProps });
    }

    if (prevProps.inputs !== inputs) {
      const data = {};
      for (const key of Object.keys(inputs)) {
        data[key] = [];
      }
      this.setState({ data });
    }

    if (prevProps.inputs !== inputs || prevProps.streams !== streams) {
      const newData = {};
      for (const [inputName, inputConfig] of Object.entries(inputs)) {
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
        };

        // TODO: use reselect to never get repeated timestamps
        if ((!lastValue || lastValue.x?.ts !== newValue.x?.ts) && newValue.x) {
          inputData.push(newValue);
        }

        // Slice inputData array if it has more than 1800 datapoints (corresponding to one hour if telemetry is received every two seconds)
        if (inputData.length > 1800) {
          inputData = inputData.slice(-1800);
        }
        newData[inputName] = inputData;
      }
      this.setState({ data: newData });
    }

    if (
      prevProps.containerNode !== this.props.containerNode &&
      this.props.width === undefined && // width/height have more priority
      this.props.height === undefined
    ) {
      if (this.props.containerNode) {
        this.resizeObserver = new ResizeObserver((entries) => {
          const container = entries[0];
          this.setState({
            containerHeight: container.contentRect.height,
            containerWidth: container.contentRect.width,
          });
        });

        this.resizeObserver.observe(this.props.containerNode);
      }
    }
  }


  render() {

    const { data, efdClients, containerWidth, containerHeight } = this.state;
    const { controls, xAxisTitle, yAxisTitle, inputs, legendPosition, timeSeriesControlsProps } = this.props;

    const { isLive, timeWindow, historicalData } = timeSeriesControlsProps ?? this.state;
    
    const { streams, containerNode } = this.props;

    const streamsItems = Object.entries(inputs).map(([_, inputConfig]) => {
      const { category, csc, salindex, topic, item } = inputConfig;
      const streamName = `${category}-${csc}-${salindex}-${topic}`;
      return streams[streamName]?.[item];
    });

    const units = {y: streamsItems.find((item) => item?.units !== undefined && item?.units !== '')?.units};

    const layerTypes = ['lines', 'bars', 'pointLines'];
    const layers = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const { type } = inputConfig;
      const typeStr = type + 's';
      if (!layerTypes.includes(typeStr)) {
        continue;
      }

      if (isLive && !data[inputName]) continue;

      let rangedInputData;
      rangedInputData = this.getRangedData(data[inputName], timeWindow, historicalData, isLive, inputs);
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
        ...defaultStyles[index % defaultStyles.length],
        ...(inputs[input].color !== undefined ? { color: inputs[input].color } : {}),
        ...(inputs[input].dash !== undefined ? { dash: inputs[input].dash } : {}),
        ...(inputs[input].shape !== undefined ? { shape: inputs[input].shape } : {}),
        ...(inputs[input].filled !== undefined ? { filled: inputs[input].filled } : {}),
      };
    });

    /** Fill marksStyles to satisfy the VegaTimeseriesPlot and VegaLegend APIs */
    const completedMarksStyles = legend.map(({ name, markType }, index) => {
        const style = marksStyles?.find((style) => style.name === name);
        if (!style) {
          return {
            ...defaultStyles[index % defaultStyles.length],
            ...(markType !== undefined ? { markType } : {}),
            name,
          };
        }
        return {
          ...style,
          ...(markType !== undefined ? { markType } : {}),
        };
      });

    
    // const timeSeriesControlRef = React.useRef(undefined);
    console.log('NewPlot containerWidth', containerWidth, ' containerHeight', containerHeight);

    return (
      <div ref={this.containerRef}>
        {controls && (
          <TimeSeriesControls
            // ref={timeSeriesControlRef}
            setTimeWindow={(timeWindow) => this.setState({ timeWindow })}
            timeWindow={this.state.timeWindow}
            setLiveMode={(isLive) => this.setState({ isLive })}
            isLive={this.state.isLive}
            setHistoricalData={this.setHistoricalData}
            efdClients={efdClients}
            selectedEfdClient={(client) => this.setState({ selectedEfdClient: client })}
            setEfdClient={this.setEfdClient}
          />
        )}
        <div className={[styles.container, legendPosition === 'bottom' ? styles.bottomLegend : ''].join(' ')}>
          <VegaTimeseriesPlot
            layers={layers}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            units={units}
            marksStyles={completedMarksStyles}
            temporalXAxis
            width={legendPosition === 'right' ? containerWidth - 150 : containerWidth} // from the .autogrid grid-template-columns
            height={legendPosition === 'bottom' ? containerHeight - 25 : containerHeight}
            className={styles.plot}
          />
          <VegaLegend listData={legend} marksStyles={completedMarksStyles} />
        </div>
      </div>
    );
  }

}