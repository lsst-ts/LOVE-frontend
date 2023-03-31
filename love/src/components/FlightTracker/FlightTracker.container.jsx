import React from 'react';
import FlightTracker from './FlightTracker';

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
  },
};

const FlightTrackerContainer = ({
  ...props
}) => {
  return (
    <FlightTracker/>
  );
};

export default FlightTrackerContainer;