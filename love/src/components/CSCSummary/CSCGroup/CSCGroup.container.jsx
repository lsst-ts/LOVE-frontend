import React from 'react';
import { connect } from 'react-redux';
import CSCGroup from './CSCGroup';
import { addGroupSubscription } from '../../../redux/actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../../../redux/actions/summaryData';
import { getStreamData, getCSCHeartbeat, getCSCLogMessages, getCSCErrorCodeData } from '../../../redux/selectors';

export const schema = {
  description: 'Summary of a set of CSCs, including heartbeats and summary state',
  defaultSize: [12, 19],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC group',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
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
    subscribeToStreamCallback: {
      type: 'function',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: '() => {}',
    },
    _functionProps: {
      type: 'array',
      description:
        'Array containing the props that are functions',
      isPrivate: true,
      default: ['subscribeToStreamCallback'],
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const CSCGroupContainer = ({ subscribeToStreams, ...props }) => {
  return <CSCGroup {...props} subscribeToStreams={subscribeToStreams} />;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(addGroupSubscription('event-Heartbeat-0-stream'));
      dispatch(addGroupSubscription(`event-${cscName}-${index}-summaryState`));
      dispatch(addGroupSubscription(`event-${cscName}-${index}-logMessage`));
      dispatch(addGroupSubscription(`event-${cscName}-${index}-errorCode`));
      dispatch(addGroupSubscription('event-Heartbeat-0-stream'));
      ownProps.subscribeToStreamCallback(cscName, index);
    },
    clearCSCLogMessages: (csc, salindex) => {
      dispatch(removeCSCLogMessages(csc, salindex));
    },
    clearCSCErrorCodes: (csc, salindex) => {
      dispatch(removeCSCErrorCodeData(csc, salindex));
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(CSCGroupContainer);
