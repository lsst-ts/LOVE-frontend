import React from 'react';
import { connect } from 'react-redux';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import { getLATISSState } from '../../../redux/selectors';
import LATISS from './LATISS';

export const schema = {
  description:
    'Summary view of the LATISS. Contains information about the filter and grating wheel, shutter and CCDs state',
  defaultSize: [61, 31],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'LATISS',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

const LATISSContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  reportedFilterPosition,
  reportedFilterName,
  reportedDisperserPosition,
  reportedDisperserName,
  reportedLinearStagePosition,
  lsState,
  fwState,
  gwState,
  shutterDetailedState,
  raftsDetailedState,
}) => {
  return (
    <LATISS
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      reportedFilterPosition={reportedFilterPosition}
      reportedFilterName={reportedFilterName}
      reportedDisperserPosition={reportedDisperserPosition}
      reportedDisperserName={reportedDisperserName}
      reportedLinearStagePosition={reportedLinearStagePosition}
      lsState={lsState}
      fwState={fwState}
      gwState={gwState}
      shutterDetailedState={shutterDetailedState}
      raftsDetailedState={raftsDetailedState}
    />
  );
};

const mapStateToProps = (state) => {
  const latissState = getLATISSState(state);
  return {
    reportedFilterPosition: latissState['reportedFilterPosition'],
    reportedFilterName: latissState['reportedFilterName'],
    reportedDisperserPosition: latissState['reportedDisperserPosition'],
    reportedDisperserName: latissState['reportedDisperserName'],
    reportedLinearStagePosition: latissState['reportedLinearStagePosition'],
    lsState: latissState['lsState'],
    fwState: latissState['fwState'],
    gwState: latissState['gwState'],
    shutterDetailedState: latissState['shutterDetailedState'],
    raftsDetailedState: latissState['raftsDetailedState'],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(addGroupSubscription('event-ATSpectrograph-0-reportedFilterPosition'));
      dispatch(addGroupSubscription('event-ATSpectrograph-0-reportedDisperserPosition'));
      dispatch(addGroupSubscription('event-ATSpectrograph-0-reportedLinearStagePosition'));
      dispatch(addGroupSubscription('event-ATSpectrograph-0-lsState'));
      dispatch(addGroupSubscription('event-ATSpectrograph-0-fwState'));
      dispatch(addGroupSubscription('event-ATSpectrograph-0-gwState'));
      // Camera
      dispatch(addGroupSubscription('event-ATCamera-0-shutterDetailedState'));
      dispatch(addGroupSubscription('event-ATCamera-0-raftsDetailedState'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ATSpectrograph-0-reportedFilterPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATSpectrograph-0-reportedDisperserPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATSpectrograph-0-reportedLinearStagePosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATSpectrograph-0-lsState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATSpectrograph-0-fwState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATSpectrograph-0-gwState'));
      // Camera
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-shutterDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-raftsDetailedState'));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LATISSContainer);
