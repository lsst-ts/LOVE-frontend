import React from 'react';
import { connect } from 'react-redux';
import CSCSummary from './CSCSummary';
import {  CSCSummaryHierarchy } from '../../Config';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
const CSCSummaryContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
}) => {
  return (
    <CSCSummary
      hierarchy={CSCSummaryHierarchy}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
      Object.keys(CSCSummaryHierarchy).forEach((realm) => {
        const groupsDict = CSCSummaryHierarchy[realm];
        Object.keys(groupsDict).forEach((group) => {
          groupsDict[group].forEach((csc) => {
            dispatch(requestGroupSubscription(`event-${csc.name}-${csc.salindex}-summaryState`));
            dispatch(requestGroupSubscription(`event-${csc.name}-${csc.salindex}-logMessage`));
            dispatch(requestGroupSubscription(`event-${csc.name}-${csc.salindex}-errorCode`));
          });
        });
      });
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-Heartbeat-0-stream'));
      Object.keys(CSCSummaryHierarchy).forEach((realm) => {
        const groupsDict = CSCSummaryHierarchy[realm];
        Object.keys(groupsDict).forEach((group) => {
          groupsDict[group].forEach((csc) => {
            dispatch(requestGroupSubscriptionRemoval(`event-${csc.name}-${csc.salindex}-summaryState`));
            dispatch(requestGroupSubscriptionRemoval(`event-${csc.name}-${csc.salindex}-logMessage`));
            dispatch(requestGroupSubscriptionRemoval(`event-${csc.name}-${csc.salindex}-errorCode`));
          });
        });
      });
    },
  };
};
export default connect(
  null,
  mapDispatchToProps,
)(CSCSummaryContainer);
