import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from 'redux/actions/ws';
import { getStreamsData, getEfdConfig, getTaiToUtc } from 'redux/selectors';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ManagerInterface, { parseTimestamp, parsePlotInputs, parseCommanderData } from 'Utils';
import Plot from './Plot';

const moment = extendMoment(Moment);

export const defaultStyles = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    dash: [4, 0],
  },

  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    dash: [4, 0],
  },
];

export const schema = {
  description: 'Time series plot for any data stream coming from SAL',
  defaultSize: [8, 8],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: true,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: true,
      default: 'Time series plot',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    inputs: {
      externalStep: 'TimeSeriesConfig',
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        Elevation: {
          category: 'telemetry',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'mount_AzEl_Encoders',
          item: 'elevationCalculatedAngle',
          type: 'line',
          accessor: '(x) => x[0]',
          ...defaultStyles[0],
        },
        'ATDome azimuth': {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: '0',
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: '(x) => x',
          ...defaultStyles[1],
        },
      },
    },
    xAxisTitle: {
      type: 'string',
      description: 'Title of the horizontal axis of this plot',
      default: 'Time',
      isPrivate: false,
    },
    yAxisTitle: {
      type: 'string',
      description: 'Title of the vertical axis of this plot',
      default: '',
      isPrivate: false,
    },
    legendPosition: {
      type: 'string',
      description:
        "Whether to display the legend to the right of the plot or at the bottom. One of 'right' or 'bottom'",
      default: 'right',
      isPrivate: false,
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
  },
};

class PlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLive: true,
      timeWindow: 60,
      historicalData: [],
      efdClients: [],
      selectedEfdClient: null,
    };

    this.containerRef = React.createRef();
  }

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
    if (prevProps.timeSeriesControlsProps != timeSeriesControlsProps) {
      this.setState({ ...timeSeriesControlsProps });
    }

    if (prevProps.inputs != inputs) {
      const data = {};
      for (const key of Object.keys(inputs)) {
        data[key] = [];
      }
      this.setState({ data });
    }

    if (prevProps.inputs != inputs || prevProps.streams != streams) {
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
  }

  render() {
    const {
      inputs,
      streams,
      containerNode,
      width,
      height,
      xAxisTitle,
      yAxisTitle,
      legendPosition,
      controls,
      timeSeriesControlsProps,
    } = this.props;
    const { data, efdClients, selectedEfdClient } = this.state;
    const { isLive, timeWindow, historicalData } = timeSeriesControlsProps ?? this.state;

    const streamsItems = Object.entries(inputs).map(([_, inputConfig]) => {
      const { category, csc, salindex, topic, item } = inputConfig;
      const streamName = `${category}-${csc}-${salindex}-${topic}`;
      return streams[streamName]?.[item];
    });

    const units = streamsItems.find((item) => item?.units !== undefined && item?.units !== '')?.units;

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

    const legend = Object.keys(inputs).map((inputName, index) => {
      return {
        label: inputName,
        name: inputName,
        markType: inputs[inputName].type,
      };
    });

    const plotProps = {
      layers: layers,
      legend: legend,
      marksStyles: marksStyles,
      xAxisTitle: xAxisTitle,
      yAxisTitle: yAxisTitle,
      units: units !== undefined ? { y: units } : undefined,
      temporalXAxis: true,
      width: width,
      height: height,
      legendPosition: legendPosition,
      isLive: isLive,
      timeWindow: timeWindow,
      setIsLive: (isLive) => {
        this.setState({ isLive });
      },
      setTimeWindow: (timeWindow) => {
        this.setState({ timeWindow });
      },
      setHistoricalData: this.setHistoricalData,
      controls: controls,
      efdClients: efdClients,
      selectedEfdClient: selectedEfdClient,
      setEfdClient: (client) => {
        this.setState({ selectedEfdClient: client });
      },
    };

    if (!width && !height && !containerNode) {
      return (
        <div ref={this.containerRef}>
          <Plot {...plotProps} containerNode={this.containerRef.current?.parentNode} />
        </div>
      );
    } else {
      return <Plot {...plotProps} containerNode={containerNode} />;
    }
  }

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
}

const getGroupNames = (inputs) =>
  Object.values(inputs).map(
    (inputConfig) => `${inputConfig?.category}-${inputConfig?.csc}-${inputConfig?.salindex}-${inputConfig?.topic}`,
  );

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const inputs = ownProps.inputs || schema.props.inputs.default;
      const groupNames = getGroupNames(inputs);
      groupNames.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const inputs = ownProps.inputs || schema.props.inputs.default;
      const groupNames = getGroupNames(inputs);
      groupNames.forEach((groupName) => {
        dispatch(requestGroupRemoval(groupName));
      });
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const groupNames = getGroupNames(inputs);
  const streams = getStreamsData(state, groupNames);
  const taiToUtc = getTaiToUtc(state);
  const efdConfigFile = getEfdConfig(state);
  return {
    streams,
    taiToUtc,
    efdConfigFile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotContainer);
