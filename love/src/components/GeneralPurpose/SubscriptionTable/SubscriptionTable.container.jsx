import React from 'react';
import { connect } from 'react-redux';
import { getStreamData } from '../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import SubscriptionTable from './SubscriptionTable';

export const schema = {
  description: `Table displaying raw subscription data`,
  defaultSize: [13, 2],
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
      default: 'Subscription table',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    label: {
      type: 'string',
      description: 'Status label',
      isPrivate: false,
      default: 'Azimuth state',
    },
    subscriptions: {
      type: 'array',
      description:
        'List of subscriptions in the format: <"event"|"telemetry">-<CSC>-<CSCIndex>-<topic>, e.g. "event-ATMCS-0-m3State"',
      isPrivate: false,
      default: ['event-ATMCS-0-m3State', 'telemetry-ATMCS-0-trajectory'],
    },
    accessors: {
      type: 'object',
      description:
        'Object containing the mapping of every data source to a function that extracts the value to be displayed',
      isPrivate: false,
      default: '{}',
    },
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
      isPrivate: true,
      default: ['accessors'],
    },
  },
};

const SubscriptionTableContainer = ({ subscriptions, getStreamData, subscribeToStreams, unsubscribeToStreams, ...props }) => {
  return (
    <SubscriptionTable
      subscriptions={subscriptions}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      getStreamData={getStreamData}
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
      streams.map((groupName) => {
        dispatch(addGroupSubscription(groupName));
      });
    },
    unsubscribeToStreams: (streams) => {
      streams.map((groupName) => {
        dispatch(requestGroupSubscriptionRemoval(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionTableContainer);
