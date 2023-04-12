import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getAircraftTracker } from 'redux/selectors';
import FlightTracker from './FlightTracker';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'View of the Aircraft Tracker',
  defaultSize: [30, 30],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Aircraft Tracker',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
  },
};

const FlightTrackerContainer = ({ isRaw, subscriptions, status, aircrafts }) => {
  if (isRaw) {
    return <SubscriptionTableContainer subscriptions={subscriptions} />;
  }
  return (
    <FlightTracker
      status={status}
      aircrafts={aircrafts}
    />
  );
};

const mapStateToProps = (state) => {
  const data = getAircraftTracker(state);
  return {
    status: data.status,
    aircrafts: data.aircrafts,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    'telemetry-AircraftTracker-0-data',
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

FlightTrackerContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(FlightTrackerContainer);
