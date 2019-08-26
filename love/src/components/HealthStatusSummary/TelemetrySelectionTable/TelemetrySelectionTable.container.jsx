import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import TelemetrySelectionTable from './TelemetrySelectionTable';

const TelemetrySelectionTableContainer = ({ allTelemetries, subscribeToStream, unsubscribeToStream,
  ...props
}) => {
  return (
    <TelemetrySelectionTable
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
      //All telemetriesdsa
      dispatch(requestGroupSubscription('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetriesdsa
      dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TelemetrySelectionTableContainer);
