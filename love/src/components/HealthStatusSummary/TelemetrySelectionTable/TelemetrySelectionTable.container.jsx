import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from '../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import TelemetrySelectionTable from './TelemetrySelectionTable';

const TelemetrySelectionTableContainer = ({
  allTelemetries,
  subscribeToStream,
  unsubscribeToStream,
  onSave,
  onCancel,
  ...props
}) => {
  return (
    <TelemetrySelectionTable
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      allTelemetries={allTelemetries}
      onCancel={onCancel}
      onSetSelection={onSave}
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
      dispatch(addGroupSubscription('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetriesdsa
      dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TelemetrySelectionTableContainer);
