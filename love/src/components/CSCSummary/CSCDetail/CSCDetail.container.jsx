import React from 'react';
import { connect } from 'react-redux';
import CSCDetail from './CSCDetail';
import { addGroupSubscription } from '../../../redux/actions/ws';
import { getStreamData, getCSCHeartbeat } from '../../../redux/selectors';

export const schema = {
  description: 'Displays the error code and message logs for a single CSC',
  defaultSize: [8, 2],
  props: {
    name: {
      type: 'string',
      description: 'Name of the CSC to monitor',
      isPrivate: false,
      default: 'Test',
    },
    salindex: {
      type: 'number',
      description:
        'Salindex of the CSC',
      isPrivate: false,
      default: 1,
    },
    hasHeartbeat: {
      type: 'boolean',
      description:
        'Whether the CSC produces heartbeat',
      isPrivate: false,
      default: true,
    },
    _functionProps: {
      type: 'array',
      description:
        'Array containing the props that are functions',
      isPrivate: true,
      default: [],
    },
  },
};

const CSCDetailContainer = ({
  group,
  name,
  salindex,
  hasHeartbeat,
  summaryStateData,
  onCSCClick,
  subscribeToStreams,
  heartbeatData,
  embedded,
}) => {
  return (
    <CSCDetail
      group={group}
      name={name}
      salindex={salindex}
      hasHeartbeat={hasHeartbeat}
      summaryStateData={summaryStateData}
      onCSCClick={onCSCClick}
      subscribeToStreams={subscribeToStreams}
      heartbeatData={heartbeatData}
      embedded={embedded}
  />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(addGroupSubscription('event-Heartbeat-0-stream'));
      dispatch(addGroupSubscription(`event-${cscName}-${index}-summaryState`));
      dispatch(addGroupSubscription(`event-${cscName}-${index}-logMessage`));
      dispatch(addGroupSubscription(`event-${cscName}-${index}-errorCode`));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  let summaryStateData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-summaryState`);
  let heartbeatData = getCSCHeartbeat(state, ownProps.name, ownProps.salindex);
  if (!summaryStateData) {
    summaryStateData = {};
  }

  return {
    summaryStateData: summaryStateData[0],
    heartbeatData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCDetailContainer);
