import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from '../../../../redux/actions/ws';
import { getStreamsData } from '../../../../redux/selectors/selectors';
import { DateTime } from 'luxon';
import VegaTimeseriesPlot, { COLORS, DASHES } from './VegaTimeSeriesPlot';
import { parseTimestamp } from '../../../../Utils';
import VegaLegend from './VegaLegend';
import styles from './VegaTimeSeriesPlot.module.css';

export const schema = {
  description: 'Time series plot for any data stream coming from SAL',
  defaultSize: [8, 8],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Time series plot',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    inputs: {
      externalStep: 'TimeSeriesConfig',
      type: 'object',
      description: 'lits of inputs',
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
        },
        'ATDome azimuth': {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: '0',
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: '(x) => x',
        },
      },
    },
  },
};

const defaultStyles = [
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

const VegaTimeSeriesPlotContainer = function ({
  inputs = schema.props.inputs.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
}) {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    subscribeToStreams();
  }, []);

  React.useEffect(() => {
    const data = {};
    for (const key of Object.keys(inputs)) {
      data[key] = [];
    }
    setData(data);
  }, [inputs]);

  React.useEffect(() => {
    let changed = false;
    if (data === {}) {
      return;
    }
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const { category, csc, salindex, topic, item, type, accessor } = inputConfig;
      /* eslint no-eval: 0 */
      const accessorFunc = eval(accessor);
      const inputData = data[inputName] || [];
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
      if ((!lastValue || lastValue.x?.ts !== newValue.x?.ts) && newValue.x) {
        changed = true;
        inputData.push(newValue);
      }
      if (inputData.length > 100) {
        changed = true;
        inputData.slice(-100);
      }
      data[inputName] = inputData;
    }
    if (changed) {
      setData(data);
    }
  }, [inputs, streams]);

  const layers = { lines: [], bars: [], pointLines: [] };
  for (const [input, inputData] of Object.entries(data)) {
    const { type } = inputs[input];
    const typeStr = type + 's';
    if (!typeStr in layers) {
      continue;
    }
    layers[typeStr] = layers[typeStr].concat(inputData);
  }

  const marksStyles = React.useMemo(() => {
    return Object.keys(inputs).map((input, index) => {
      return {
        name: input,
        ...defaultStyles[index % defaultStyles.length],
      };
    });
  }, [inputs]);

  const legendData = marksStyles.map(({ name }) => ({
    name,
    label: name,
  }));


  return (
    <div className={styles.container}>
      <VegaTimeseriesPlot
        layers={layers}
        xAxisTitle="Time"
        yAxisTitle="Quantity [u]"
        marksStyles={marksStyles}
        temporalXAxis
        width={500}
        height={200}
      />
      <VegaLegend listData={legendData} marksStyles={marksStyles} />
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(VegaTimeSeriesPlotContainer);
