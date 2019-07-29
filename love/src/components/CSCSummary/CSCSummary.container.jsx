import React from 'react';
import { connect } from 'react-redux';
import CSCSummary from './CSCSummary';
import { hasFakeData, CSCSummaryHierarchy } from '../../Config';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import { getCSCHeartbeats, getAllStreamsAsDictionary } from '../../redux/selectors';
const CSCSummaryContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  heartbeatsData,
  summaryStateData,
  logMessageData,
  errorCodeData,
}) => {
  return (
    <CSCSummary
      hierarchy={CSCSummaryHierarchy}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      heartbeatsData={heartbeatsData}
      summaryStateData={summaryStateData}
      logMessageData={logMessageData}
      errorCodeData={errorCodeData}
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
        cscsList.push([csc.name, csc.salindex]);
      });
    });
  });

  const summaryStateData = getAllStreamsAsDictionary(state, 'event', cscsList, 'summaryState', true);
  const logMessageData = getAllStreamsAsDictionary(state, 'event', cscsList, 'logMessage');
  const errorCodeData =  getAllStreamsAsDictionary(state, 'event', cscsList, 'errorCode');
  return {
    heartbeatsData,
    summaryStateData,
    logMessageData,
    errorCodeData
  };
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
  mapStateToProps,
  mapDispatchToProps,
)(CSCSummaryContainer);
