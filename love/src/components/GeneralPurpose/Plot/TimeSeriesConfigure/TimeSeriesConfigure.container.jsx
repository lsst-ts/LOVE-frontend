import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from 'redux/selectors';
import { addGroup, removeGroup } from 'redux/actions/ws';
import TimeSeriesConfigure from './TimeSeriesConfigure';


export const schema = {
  description: `Timeseries Configure`,
  props: {
    subscriptions: {
      type: 'array',
      description:
        'List of subscriptions in the format: <"event"|"telemetry">-<CSC>-<CSCIndex>-<topic>, e.g. "telemetry-all-all-all"',
      isPrivate: false,
      default: [
        'telemetry-all-all-all',
        // 'telemetry-ATDome-0-azimuthPosition',
      ],
    },
  }
};

const TimeSeriesConfigureContainer = ({
  subscriptions,
  subscribeToStreams,
  unsubscribeToStreams,
  onSave,
  onCancel,
  ...props
}) => {
  const [telemetries, setTelemetries] = React.useState({});
  if (subscriptions && Object.keys(subscriptions).length > 4 && Object.keys(telemetries).length === 0) {
    setTelemetries(subscriptions);
  }
  return (
    <TimeSeriesConfigure
      subscriptions={subscriptions}
      getStreamData={getStreamData}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      onCancel={onCancel}
      onSetSelection={onSave}
      {...props}
    />
  );
};


const mapStateToProps = (state, ownProps) => {
  const getStreamDataProp = (groupName) => getStreamData(state, groupName);
  return { getStreamData: getStreamDataProp };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (streams) => {
      streams.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: (streams) => {
      streams.forEach((groupName) => {
        dispatch(removeGroup(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesConfigureContainer);
