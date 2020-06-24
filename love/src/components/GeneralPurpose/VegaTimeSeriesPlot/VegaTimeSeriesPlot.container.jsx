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
        'telemetry-ATMCS-0-mount_AzEl_Encoders': {
          // elevationCalculatedAngle: 'Elevation',
          elevationCalculatedAngle: {
            name: 'Elevation',
            type: 'line',
            accessor: (x) => x[0],
          },
        },
        'telemetry-ATDome-0-position': {
          // azimuthPosition: 'ATDome azimuth',
          azimuthPosition: {
            name: 'ATDome azimuth',
            type: 'line',
            accessor: (x) => x,
          },
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
  subscriptions = schema.props.subscriptions.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) {
  console.log('subscriptions: ', subscriptions);
  console.log('streams: ', streams);
  const startDate = moment().subtract(2, 'year').startOf('day');
  const [data, setData] = React.useState([]);
  const [layers, setLayers] = React.useState([]);
  const parameters = Object.keys(subscriptions).flatMap((streamName) => {
    return Object.keys(subscriptions[streamName]).map((paramName) => {
      const paramConfig = subscriptions[streamName][paramName];
      return {
        streamName,
        paramName,
        name: paramConfig.name,
        type: paramConfig.type,
        accessor: paramConfig.accessor,
      };
    });
  });
  console.log('parameters: ', parameters);
  const marksStyles = parameters.map((param, index) => ({
    name: param.name,
    ...defaultStyles[index % defaultStyles.length],
  }));
  console.log('marksStyles: ', marksStyles);

  React.useEffect(() => {
    subscribeToStreams();
  }, []);

  React.useEffect(() => {
    const newData = [];
    parameters.forEach((param) => {
      const { paramName, streamName, name, accessor, type } = param;
      if (!streams?.[streamName]?.[paramName]?.value) {
        return;
      }

      const { value, ...others } = streams[streamName][paramName];
      newData.push({
        name,
        x: parseTimestamp(streams[streamName]?.private_rcvStamp?.value),
        y: accessor(value),
        ...others,
      });
    });

    if (newData?.length > 0) {
      setData((data) => data.concat(newData).slice(-100));
    }
  }, [streams]);

  console.log('data: ', data);

  return (
    <div>
      <div style={{ width: '500px', height: '200px' }}>
        <VegaTimeSeriesPlot
          layers={{ lines: data }}
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
