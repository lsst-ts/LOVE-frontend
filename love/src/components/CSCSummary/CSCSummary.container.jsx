import React from 'react';
import { connect } from 'react-redux';
import CSCSummary from './CSCSummary';
import { hasFakeData, CSCSummaryHierarchy } from '../../Config';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import {getCSCHeartbeats, getCSCsSummaryStates} from '../../redux/selectors';
const CSCSummaryContainer = ({ subscribeToStreams, unsubscribeToStreams, heartbeatsData, summaryStateData }) => {
  return (
    <CSCSummary
      hierarchy={CSCSummaryHierarchy}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      heartbeatsData={heartbeatsData}
      summaryStateData={summaryStateData}
    />
  );
};

const mapStateToProps = (state) => {
  const heartbeatsData = getCSCHeartbeats(state);

  const cscsList = [];
  Object.keys(CSCSummaryHierarchy).forEach((realm) => {
    const groupsDict = CSCSummaryHierarchy[realm];
    Object.keys(groupsDict).forEach((group) => {
      groupsDict[group].forEach((csc) => {
        cscsList.push(csc)
      });
    });
  });

 
  const summaryStateData = getCSCsSummaryStates(state, cscsList)
  return {
    heartbeatsData,
    summaryStateData
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
      Object.keys(CSCSummaryHierarchy).forEach((realm) => {
        const groupsDict = CSCSummaryHierarchy[realm];
        Object.keys(groupsDict).forEach((group) => {
          groupsDict[group].forEach((csc) => {
            dispatch(requestGroupSubscription(`event-${csc}-1-summaryState`));
            dispatch(requestGroupSubscription(`event-${csc}-1-logMessage`));
            dispatch(requestGroupSubscription(`event-${csc}-1-errorCode`));
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
            dispatch(requestGroupSubscriptionRemoval(`event-${csc}-1-summaryState`));
            dispatch(requestGroupSubscriptionRemoval(`event-${csc}-1-logMessage`));
            dispatch(requestGroupSubscriptionRemoval(`event-${csc}-1-errorCode`));
          });
        });
      });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCSummaryContainer);
