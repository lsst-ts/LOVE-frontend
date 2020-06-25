import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from '../../../redux/actions/ws';
import { getStreamsData } from '../../../redux/selectors/selectors.js';
import VegaTimeSeriesPlot from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';
import { parseTimestamp } from '../../../Utils';
import moment from 'moment';

export const schema = {
  description: 'vega plot',
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
    subscriptions: {
      type: 'array',
      description: 'lits of subscriptions',
      isPrivate: false,
      default: {
        Elevation: {
          group: 'telemetry-ATMCS-0-mount_AzEl_Encoders',
          item: 'elevationCalculatedAngle',
          type: 'line',
          accessor: (x) => x,
        },
        'telemetry-ATMCS-0-mount_AzEl_Encoders': {
          elevationCalculatedAngle: {
            name: 'Elevation',
            type: 'line',
            accessor: (x) => x[0],
          },
        },
        'telemetry-ATDome-0-position': {
          azimuthPosition: {
            name: 'ATDome azimuthh',
            type: 'line',
            accessor: (x) => x,
          },
        },
      },
    },
  },
  _functionProps: {
    type: 'array',
    description: 'Array containing the props that are functions',
    isPrivate: true,
    default: ['subscriptions'],
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
  subscriptions = schema.props.subscriptions.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) {
  const startDate = moment().subtract(2, 'year').startOf('day');
  const [subscriptionsData, setSubscriptionsData] = React.useState({});
  let index = -1;
  const marksStyles = React.useMemo(() => {
    return Object.keys(subscriptions).flatMap((streamName) => {
      return Object.keys(subscriptions[streamName]).map((paramName) => {
        const paramConfig = subscriptions[streamName][paramName];
        index++;
        return {
          name: paramConfig.name,
          ...defaultStyles[index % defaultStyles.length],
        };
      });
    });
  }, [subscriptions]);

  React.useEffect(() => {
    subscribeToStreams();
  }, []);

  React.useEffect(() => {
    const subscriptionsData = {};
    Object.keys(subscriptions).forEach((streamName) => {
      const streamDict = {};
      Object.keys(subscriptions[streamName]).forEach((paramName) => {
        streamDict[paramName] = [];
      });
      subscriptionsData[streamName] = streamDict;
    });
    setSubscriptionsData(subscriptionsData);
  }, [subscriptions]);

  React.useEffect(() => {
    let changed = false;
    for (const [streamName, streamConfig] of Object.entries(subscriptions)) {
      for (const [paramName, paramConfig] of Object.entries(streamConfig)) {
        const { name, accessor, type } = paramConfig;
        if (!streams?.[streamName]?.[paramName]?.value) {
          continue;
        }
        const { value, ...others } = streams[streamName][paramName];
        const newValue = {
          name,
          x: parseTimestamp(streams[streamName]?.private_rcvStamp?.value),
          y: Array.isArray(value) ? accessor(value?.[0]) : accessor(value),
          ...others,
        };
        const subsData = subscriptionsData[streamName][paramName];
        const lastValue = subsData[subsData.length - 1];
        if (!lastValue || lastValue.x?.ts !== newValue.x?.ts) {
          changed = true;
          subsData.push(newValue);
        }
        if (subsData.length > 100) {
          changed = true;
          subsData.slice(-100);
        }
      }
    }
    if (changed) {
      setSubscriptionsData(subscriptionsData);
    }
  }, [streams]);
  const layers = { lines: [], bars: [], pointLines: [] };
  for (const [streamName, streamData] of Object.entries(subscriptionsData)) {
    for (const [paramName, paramData] of Object.entries(streamData)) {
      const { name, type } = subscriptions[streamName][paramName];
      const typeStr = type + 's';
      if (!type in layers) {
        continue;
      }
      layers[typeStr] = layers[typeStr].concat(paramData);
    }
  }

  return (
    <div>
      <div style={{ width: '500px', height: '200px' }}>
        <VegaTimeSeriesPlot
          layers={layers}
          marksStyles={marksStyles}
          units={{ y: 'deg' }}
          yAxisTitle={'Telementry'}
          xAxisTitle={'Time ago'}
          temporalXAxis={true}
          skipPointsEvery={1}
        />
      </div>
      <div style={{ width: '500px', height: '100px' }}>
        <VegaLegend marksStyles={marksStyles} />
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
  const groupNames = Object.keys(subscriptions);

  const streams = getStreamsData(state, groupNames);
  return {
    streams,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
      const groupNames = Object.keys(subscriptions);
      console.log('groupNames', groupNames);
      groupNames.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
      const groupNames = Object.keys(subscriptions);
      groupNames.forEach((groupName) => {
        dispatch(requestGroupRemoval(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VegaTimeSeriesPlotContainer);

// 'Mount Azimuth': 'telemetry-ATMCS-0-mount_AzEl_Encoders',
// 'Mount Azimuth': (data) => (data.azimuthCalculatedAngle ? data.azimuthCalculatedAngle.value[0] : 0),
