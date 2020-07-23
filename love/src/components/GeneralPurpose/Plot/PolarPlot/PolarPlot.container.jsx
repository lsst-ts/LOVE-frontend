import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from 'redux/actions/ws';
import { getStreamsData } from 'redux/selectors/selectors';
import PolarPlot from './PolarPlot';
import { parseTimestamp } from 'Utils';

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
  },
};

const PolarPlotContainer = function ({
  inputs = schema.props.inputs.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  width,
  height,
  xAxisTitle,
  yAxisTitle,
}) {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    subscribeToStreams();
  }, []);

  /** TODO: find a way to detect "real" changes in inputs
   * now resizing the plot also makes the inputs prop to change
   */
  React.useEffect(() => {
    unsubscribeToStreams();
    subscribeToStreams();
    const data = {};
    for (const key of Object.keys(inputs)) {
      data[key] = [];
    }
    setData(data);
  }, [inputs]);

  // console.log('inputs', inputs);
  // console.log('Object.keys(inputs)', Object.keys(inputs));
  // console.log('sreams', streams);

  const streamsItems = React.useMemo(() =>
    Object.entries(inputs).map(
      ([inputName, inputConfig]) => {
        const { category, csc, salindex, topic, item, type, accessor } = inputConfig;
        const streamName = `${category}-${csc}-${salindex}-${topic}`;
        return streams[streamName]?.[item];
      },
      [inputs, streams],
    ),
  );

  const units = React.useMemo(
    () => streamsItems.find((item) => item?.units !== undefined && item?.units !== '')?.units,
    [streamsItems],
  );

  React.useEffect(() => {
    let changed = false;
    if (data === {}) {
      return;
    }
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const { category, csc, salindex, topic, item, type, accessor } = inputConfig;
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
        changed = true;
        inputData.push(newValue);
      }

      // TODO: change by a date range filter
      if (inputData.length > 100) {
        changed = true;
        inputData = inputData.slice(-100);
      }
      data[inputName] = inputData;
    }
    if (changed) {
      setData(data);
    }
  }, [inputs, streams]);

  const layers = { lines: [], bars: [], pointLines: [] };
  for (const [inputName, inputConfig] of Object.entries(inputs)) {
    const { type } = inputConfig;
    const typeStr = type + 's';
    if (!typeStr in layers) {
      continue;
    }
    if (!data[inputName]) continue;
    layers[typeStr] = layers[typeStr].concat(data[inputName]);
  }
  const marksStyles = React.useMemo(() => {
    return Object.keys(inputs).map((input, index) => {
      return {
        name: input,
        ...defaultStyles[index % defaultStyles.length],
        ...(inputs[input].color !== undefined ? { color: inputs[input].color } : {}),
        ...(inputs[input].dash !== undefined ? { dash: inputs[input].dash } : {}),
        ...(inputs[input].shape !== undefined ? { shape: inputs[input].shape } : {}),
        ...(inputs[input].filled !== undefined ? { filled: inputs[input].filled } : {}),
      };
    });
  }, [inputs]);

  const legend = React.useMemo(() => {
    return Object.keys(inputs).map((inputName, index) => {
      return {
        label: inputName,
        name: inputName,
        markType: inputs[inputName].type,
      };
    });
  }, [inputs]);

  // this should be the case for a component loaded from the UI Framework
  const plotProps = {
    layers: layers,
    legend: legend,
    marksStyles: marksStyles,
    xAxisTitle: xAxisTitle,
    yAxisTitle: yAxisTitle,
    units:
      units !== undefined
        ? {
            y: units,
          }
        : undefined,
    temporalXAxis: true,
    width: width,
    height: height,
  };
  return <PolarPlot {...plotProps} />;
};

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
  return {
    streams,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolarPlotContainer);
