import React from 'react';
import { connect } from 'react-redux';
import CSCGroup from './CSCGroup';
import { requestGroupSubscription } from '../../../redux/actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../../../redux/actions/summaryData';
import { getStreamData, getCSCHeartbeat, getCSCLogMessages, getCSCErrorCodeData } from '../../../redux/selectors';

export const schema = {
    description: 'Summary of a set of CSCs, including heartbeats and summary state',
    defaultSize: [12, 19],
    props: {
      name: {
        type: 'string',
        description: 'Custom name of the group',
        isPrivate: false,
        default: 'CSC group',
      },
      cscs: {
        type: 'array',
        description:
          'Array of the CSCs to be included in the group, as objects with the format: {name: <component-name>, salindex: <number>}',
        isPrivate: false,
        default: [
          {
            name: 'ATMCS',
            salindex: 0,
          },
          {
            name: 'ATPtg',
            salindex: 0,
          },
          {
            name: 'ATDome',
            salindex: 0,
          },
          {
            name: 'ATDomeTrajectory',
            salindex: 0,
          },
          {
            name: 'ATAOS',
            salindex: 0,
          },
          {
            name: 'ATPneumatics',
            salindex: 0,
          },
          {
            name: 'ATHexapod',
            salindex: 0,
          },
        ],
      },
    },
  };
  

const CSCGroupContainer = ({
    subscribeToStreams,
    ...props,
}) => {
  return (
    <CSCGroup
        {...props}
      subscribeToStreams={subscribeToStreams}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-summaryState`));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-logMessage`));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-errorCode`));
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
    },
    clearCSCLogMessages: (csc, salindex) => {
      dispatch(removeCSCLogMessages(csc, salindex));
    },
    clearCSCErrorCodes: (csc, salindex) => {
      dispatch(removeCSCErrorCodeData(csc, salindex))
    }
  };
};

const mapStateToProps = (state, ownProps) => {
  let summaryStateData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-summaryState`);
  let heartbeatData = getCSCHeartbeat(state, ownProps.name, ownProps.salindex);

  const logMessageData = getCSCLogMessages(state, ownProps.name, ownProps.salindex);
  const errorCodeData = getCSCErrorCodeData(state, ownProps.name, ownProps.salindex);
  summaryStateData = summaryStateData ? summaryStateData : {};

  return {
    summaryStateData: summaryStateData[0],
    heartbeatData,
    logMessageData,
    errorCodeData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCGroupContainer);
