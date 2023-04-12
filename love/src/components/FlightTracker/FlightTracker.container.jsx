import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamData } from 'redux/selectors';
import FlightTracker from './FlightTracker';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'View of the Flight Tracker',
  defaultSize: [30, 30],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Flight Tracker',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
  },
};

const FlightTrackerContainer = ({
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions} />;
  }
  return (
    <FlightTracker/>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

const mapStateToProps = (state) => {
  //const streams = getStreamsData(state, groupNames);
  return {
    //streams,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightTrackerContainer);
