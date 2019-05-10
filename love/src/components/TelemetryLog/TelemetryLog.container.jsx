import React from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import {requestGroupSubscription} from '../../redux/actions/ws';

const TelemetryLogContainer = ({ token, subscribeToStream }) => {
  return <TelemetryLog subscribeToStream={subscribeToStream}/>;
};

TelemetryLogContainer.defaultProps = {
  token: 'asd',
};
const mapStateToProps = (state) => {
  console.log('mapstatetoprops', state);
  return { token: state.auth.token };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: (category, csc, stream) => {
      const groupName = [category, csc, stream].join('-');
      dispatch(requestGroupSubscription(groupName));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TelemetryLogContainer);
