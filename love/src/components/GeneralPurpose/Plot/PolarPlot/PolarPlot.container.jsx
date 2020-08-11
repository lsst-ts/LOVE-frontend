import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from 'redux/actions/ws';
import { getStreamsData, getTaiToUtc } from 'redux/selectors/selectors';
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
          csc: 'Environment',
          salindex: '1',
          topic: 'windSpeed',
          item: 'avg2M',
          type: 'line',
          accessor: '(x) => x',
          encoding: 'radial', // radial, color, angular
          group: 0,
          ...defaultStyles[0],
        },
        WindDirection: {
          category: 'telemetry',
          csc: 'Environment',
          salindex: '1',
          topic: 'windDirection',
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
  const proportion = (value - minValue) / (maxValue - minValue); 
  return [255, 255 * (1 - proportion), 255 * (1 - proportion)]; 
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
  },
};

const domeAzimuthGroupName = 'telemetry-ATDome-0-position';

const PolarPlotContainer = function ({
  inputs = schema.props.inputs.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  width,
  height,
  groupTitles,
  temporalEncoding,
  taiToUtc,
  colorInterpolation,
  opacityInterpolation,
  displayDome,
  radialUnits,
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
        time: parseTimestamp(streamValue.private_rcvStamp?.value * 1000),
        value: accessorFunc(streamValue[item]?.value),
      };

      // TODO: use reselect to never get repeated timestamps
      if ((!lastValue || lastValue.time?.ts !== newValue.time?.ts) && newValue.time) {
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

  const marksStyles = React.useMemo(() => {
    return Object.keys(inputs).map((input, index) => {
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

  const colorInterpolationFunc = React.useMemo(() => {
    return eval(colorInterpolation);
  }, [colorInterpolation]);
  const opacityInterpolationFunc = React.useMemo(() => {
    return eval(opacityInterpolation);
  }, [opacityInterpolation]);
  // this should be the case for a component loaded from the UI Framework
  const plotProps = {
    data: data,
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
  };
  return <PolarPlot {...plotProps} />;
};

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
        dispatch(requestGroupRemoval(groupName));
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
