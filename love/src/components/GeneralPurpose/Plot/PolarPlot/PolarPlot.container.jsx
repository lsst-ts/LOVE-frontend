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

import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamsData, getTaiToUtc } from 'redux/selectors/selectors';
import _ from 'lodash';
import PolarPlot from './PolarPlot';
import ManagerInterface, { parseTimestamp, parsePlotInputs, parseCommanderData } from 'Utils';

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
  defaultSize: [40, 40],
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
      externalStep: 'PolarPlotConfig',
      type: 'object',
      description: 'List of inputs. Each input for a single plot line should share the same group index',
      isPrivate: false,
      default: {
        WindSpeed: {
          category: 'telemetry',
          csc: 'ESS',
          salindex: 301,
          topic: 'airFlow',
          item: 'avg2M',
          type: 'line',
          accessor: '(x) => x',
          encoding: 'radial', // radial, color, angular
          group: 0,
          ...defaultStyles[0],
        },
        WindDirection: {
          category: 'telemetry',
          csc: 'ESS',
          salindex: 301,
          topic: 'airFlow',
          item: 'avg2M',
          type: 'line',
          accessor: '(x) => x',
          encoding: 'angular', // radial, color, angular
          group: 0,
          ...defaultStyles[0],
        },
      },
    },
    temporalEncoding: {
      type: 'string',
      description: 'Which variable encodes time. One of the following: radial, color or angular',
      default: 'color',
      isPrivate: false,
    },
    displayDome: {
      type: 'boolean',
      description: 'Whether to display a representation of the dome in the background',
      default: true,
      isPrivate: false,
    },
    opacityInterpolation: {
      type: 'function',
      description: 'Opacity interpolation function',
      default: `(value, minValue, maxValue, group) => {
  if (maxValue === minValue) return 1;
  return 0.01 + ((value - minValue) / (maxValue - minValue)) * 0.9;
}`,
      isPrivate: false,
    },
    colorInterpolation: {
      type: 'function',
      description: 'Color interpolation function. It takes a value, its range (min and max) and the group index.',
      default: `(value, minValue, maxValue, group) => { 
  const proportion = maxValue !== minValue ? (value - minValue) / (maxValue - minValue) : 0;
  return [255 * (1 - proportion), 255, 255 * (1 - proportion)];
}`,
      isPrivate: false,
    },
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
      isPrivate: true,
      default: ['opacityInterpolation', 'colorInterpolation'],
    },
    groupTitles: {
      type: 'array',
      description: 'Array containing group names, to be displayed in the legend',
      isPrivate: false,
      default: ['Wind'],
    },
    radialUnits: {
      type: 'string',
      description: 'Units for the radial values',
      default: 'km/s',
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

const domeAzimuthGroupName = 'telemetry-ATDome-0-position';

class PolarPlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLive: true,
      timeWindow: 60,
      historicalData: [],
    };

    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    const { timeSeriesControlsProps, inputs, streams, subscribeToStreams, unsubscribeToStreams } = this.props;
    const { data } = this.state;

    if (!_.isEqual(prevProps.timeSeriesControlsProps, timeSeriesControlsProps)) {
      this.setState({ ...timeSeriesControlsProps });
    }

    if (!_.isEqual(prevProps.inputs, inputs)) {
      unsubscribeToStreams();
      subscribeToStreams();
      const data = {};
      for (const key of Object.keys(inputs)) {
        data[key] = [];
      }
      this.setState({ data });
    }

    if (!_.isEqual(prevProps.inputs, inputs) || !_.isEqual(prevProps.streams, streams)) {
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
          time: parseTimestamp(streamValue.private_rcvStamp?.value * 1000),
          value: accessorFunc(streamValue[item]?.value),
        };

        // TODO: use reselect to never get repeated timestamps
        if ((!lastValue || lastValue.time?.ts !== newValue.time?.ts) && newValue.time) {
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
      width,
      height,
      groupTitles,
      temporalEncoding,
      taiToUtc,
      colorInterpolation,
      opacityInterpolation,
      displayDome,
      radialUnits,
      controls,
      timeSeriesControlsProps,
    } = this.props;

    const { data } = this.state;
    const { isLive, timeWindow, historicalData } = timeSeriesControlsProps ?? this.state;

    const streamsItems = Object.entries(inputs).map(([_, inputConfig]) => {
      const { category, csc, salindex, topic, item } = inputConfig;
      const streamName = `${category}-${csc}-${salindex}-${topic}`;
      return streams[streamName]?.[item];
    });

    const units = streamsItems.find((item) => item?.units !== undefined && item?.units !== '')?.units;

    const marksStyles = Object.keys(inputs).map((input, index) => {
      return {
        name: input,
        ...defaultStyles[index % defaultStyles.length],
        ...(inputs[input].color !== undefined ? { color: inputs[input].color } : {}),
        ...(inputs[input].dash !== undefined ? { dash: inputs[input].dash } : {}),
        ...(inputs[input].shape !== undefined ? { shape: inputs[input].shape } : {}),
        ...(inputs[input].filled !== undefined ? { filled: inputs[input].filled } : {}),
        ...(inputs[input].encoding !== undefined ? { encoding: inputs[input].encoding } : {}),
        ...(inputs[input].group !== undefined ? { group: inputs[input].group } : {}),
      };
    });

    const legend = Object.keys(inputs).map((inputName, index) => {
      return {
        label: inputName,
        name: inputName,
        markType: inputs[inputName].type,
      };
    });

    const colorInterpolationFunc = eval(colorInterpolation);
    const opacityInterpolationFunc = eval(opacityInterpolation);

    const rangedInputData = this.getRangedData(data, timeWindow, historicalData, isLive, inputs);

    const plotProps = {
      data: rangedInputData,
      legend: legend,
      marksStyles: marksStyles,
      groupTitles: groupTitles,
      units:
        units !== undefined
          ? {
              y: units,
            }
          : undefined,
      temporalXAxis: true,
      temporalEncoding: temporalEncoding,
      taiToUtc: taiToUtc,
      width: width,
      height: height,
      colorInterpolation: colorInterpolationFunc,
      opacityInterpolation: opacityInterpolationFunc,
      domeAzimuth: streams[domeAzimuthGroupName],
      displayDome: displayDome,
      radialUnits: radialUnits,
      isLive: isLive,
      timeWindow: timeWindow,
      setIsLive: (isLive) => {
        this.setState({ isLive });
      },
      setTimeWindow: (timeWindow) => {
        this.setState({ timeWindow });
      },
      setHistoricalData: (startDate, timeWindow) => {
        const cscs = parsePlotInputs(inputs);
        const parsedDate = startDate.format('YYYY-MM-DDTHH:mm:ss');
        // historicalData
        ManagerInterface.getEFDTimeseries(parsedDate, timeWindow, cscs, '1min').then((data) => {
          const parsedData = parseCommanderData(data, 'time', 'value');
          this.setState({ historicalData: parsedData });
        });
      },
      controls: controls,
    };

    return <PolarPlot {...plotProps} />;
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

  getRangedData = (data, timeWindow, historicalData, isLive, inputs) => {
    let filteredData = {};
    if (!isLive) {
      const topics = this.getTopicItemPair(inputs);
      const filteredHistoricalData = {};
      Object.keys(topics).forEach((topicKey) => {
        const topic = topics[topicKey];
        const [topicName, property] = topic;
        const dataPoints = historicalData?.[topicName]?.[property] ?? [];
        filteredHistoricalData[topicKey] = dataPoints;
      });
      filteredData = filteredHistoricalData;
    } else {
      for (const input in data) {
        filteredData[input] = data[input].filter((val) => {
          const currentSeconds = new Date().getTime() / 1000;
          const dataSeconds = val.time.toMillis() / 1000 + this.props.taiToUtc;
          if (currentSeconds - timeWindow * 60 <= dataSeconds) return true;
          else return false;
        });
      }
    }
    return filteredData;
  };
}

const getGroupNames = (inputs, displayDome) => {
  const domeGroupNames = [domeAzimuthGroupName];
  const dataGroups = Object.values(inputs).map(
    (inputConfig) => `${inputConfig?.category}-${inputConfig?.csc}-${inputConfig?.salindex}-${inputConfig?.topic}`,
  );
  if (displayDome) {
    return [...dataGroups, ...domeGroupNames];
  }
  return dataGroups;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const inputs = ownProps.inputs || schema.props.inputs.default;
      const displayDome = ownProps.displayDome || schema.props.displayDome.default;
      const groupNames = getGroupNames(inputs, displayDome);
      groupNames.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const inputs = ownProps.inputs || schema.props.inputs.default;
      const displayDome = ownProps.displayDome || schema.props.displayDome.default;
      const groupNames = getGroupNames(inputs, displayDome);
      groupNames.forEach((groupName) => {
        dispatch(removeGroup(groupName));
      });
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const displayDome = ownProps.displayDome || schema.props.displayDome.default;
  const groupNames = getGroupNames(inputs, displayDome);
  const streams = getStreamsData(state, groupNames);
  return {
    taiToUtc: getTaiToUtc(state),
    streams,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolarPlotContainer);
