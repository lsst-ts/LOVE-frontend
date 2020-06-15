import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import HealthStatusConfig from './HealthStatusConfig';

const HealthStatusConfigContainer = ({
  allTelemetries,
  subscribeToStream,
  unsubscribeToStream,
  onSave,
  onCancel,
  ...props
}) => {
  const [telemetries, setTelemetries] = React.useState({});

  if (allTelemetries && Object.keys(allTelemetries).length > 4 && Object.keys(telemetries).length === 0) {
    setTelemetries(allTelemetries);
  }
  return (
    <HealthStatusConfig
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      allTelemetries={telemetries}
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
      dispatch(addGroup('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetriesdsa
      dispatch(removeGroup('telemetry-all-all-all'));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusConfigContainer);
