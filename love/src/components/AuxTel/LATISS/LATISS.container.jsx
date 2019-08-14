import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import { getLATISSState } from '../../../redux/selectors';

import LATISS from './LATISS';

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
      dispatch(requestGroupSubscription('event-ATSpectrograph-0-reportedFilterPosition'));
      dispatch(requestGroupSubscription('event-ATSpectrograph-0-reportedDisperserPosition'));
      dispatch(requestGroupSubscription('event-ATSpectrograph-0-reportedLinearStagePosition'));
      dispatch(requestGroupSubscription('event-ATSpectrograph-0-lsState'));
      dispatch(requestGroupSubscription('event-ATSpectrograph-0-fwState'));
      dispatch(requestGroupSubscription('event-ATSpectrograph-0-gwState'));
      // Camera
      dispatch(requestGroupSubscription('event-ATCamera-0-shutterDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-0-raftsDetailedState'));
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LATISSContainer);
