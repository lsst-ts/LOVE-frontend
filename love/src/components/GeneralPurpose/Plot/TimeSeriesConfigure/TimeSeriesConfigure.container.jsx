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
  //allTelemetries,
  //subscribeToStream,
  //unsubscribeToStream,
  subscriptions,
  subscribeToStreams,
  unsubscribeToStreams,
  onSave,
  onCancel,
  ...props
}) => {
  const [telemetries, setTelemetries] = React.useState({});

  /* if (allTelemetries && Object.keys(allTelemetries).length > 4 && Object.keys(telemetries).length === 0) {
    setTelemetries(allTelemetries);
  } */
  if (subscriptions && Object.keys(subscriptions).length > 4 && Object.keys(telemetries).length === 0) {
    setTelemetries(subscriptions);
  }
  return (
    <TimeSeriesConfigure
      // allTelemetries={telemetries}
      subscriptions={subscriptions}
      getStreamData={getStreamData}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      // subscribeToStream={subscribeToStream}
      // unsubscribeToStream={unsubscribeToStream}
      onCancel={onCancel}
      onSetSelection={onSave}
      {...props}
    />
  );
};

/* const mapStateToProps = (state) => {
  const allTelemetries = getAllTelemetries(state);
  return { allTelemetries };
}; */

/* const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: () => {
      //All telemetriesdsa
      dispatch(addGroup('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetriesdsa
      dispatch(removeGroup('telemetry-all-all-all'));
    },
  };
}; */

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
