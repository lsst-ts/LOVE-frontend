import React from 'react';
import { connect } from 'react-redux';
import CSCExpanded from './CSCExpanded';
import { requestGroupSubscription } from '../../../redux/actions/ws';
import { removeCSCLogMessages } from '../../../redux/actions/summaryData';
import { getStreamData, getCSCHeartbeat, getCSCLogMessages, getCSCErrorCodeData } from '../../../redux/selectors';

const CSCExpandedContainer = ({
  name,
  salindex,
  group,
  realm,
  onCSCClick,
  clearCSCErrorCodes,
  clearCSCLogMessages,
  summaryStateData,
  logMessageData,
  errorCodeData,
  subscribeToStreams,
  heartbeatData,
}) => {
  return (
    <CSCExpanded
      name={name}
      salindex={salindex}
      group={group}
      realm={realm}
      onCSCClick={onCSCClick}
      clearCSCErrorCodes={clearCSCErrorCodes}
      errorCodeData={errorCodeData}
      summaryStateData={summaryStateData}
      subscribeToStreams={subscribeToStreams}
      logMessageData={logMessageData}
      heartbeatData={heartbeatData}
      clearCSCLogMessages={clearCSCLogMessages}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-summaryState`));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-logMessage`));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-errorCode`));
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
    },
    clearCSCLogMessages: (csc, salindex) => {
      dispatch(removeCSCLogMessages(csc, salindex));
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCExpandedContainer);
