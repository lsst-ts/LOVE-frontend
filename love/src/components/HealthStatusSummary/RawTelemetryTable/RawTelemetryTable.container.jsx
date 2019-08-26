import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import RawTelemetryTable from './RawTelemetryTable';

const RawTelemetryTableContainer = ({ allTelemetries, subscribeToStream, unsubscribeToStream,
  ...props
}) => {
  return (
    <RawTelemetryTable
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      allTelemetries={allTelemetries}
    />
  );
};

const mapStateToProps = (state) => {
  const allTelemetries = getAllTelemetries(state);
  return { allTelemetries };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: () => {
      //All telemetries
      dispatch(requestGroupSubscription('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetries
      dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RawTelemetryTableContainer);
