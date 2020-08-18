import React from 'react';
import { connect } from 'react-redux';
import EventLog from './EventLog';
import { addGroup } from '../../redux/actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../../redux/actions/summaryData';
import { getGroupSortedErrorCodeData, getGroupSortedLogMessageData } from '../../redux/selectors';
import { CSCSummaryHierarchy } from '../../Config';

export const schema = {
  description: 'Displays the error code and message logs for a single CSC',
  defaultSize: [24, 29],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Event log',
    },
    name: {
      type: 'string',
      description: 'Name of the CSC to monitor',
      isPrivate: false,
      default: 'Test',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the CSC',
      isPrivate: false,
      default: 1,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
  },
};

const EventLogContainer = ({
  name,
  salindex,
  group,
  onCSCClick,
  clearCSCErrorCodes,
  clearCSCLogMessages,
  summaryStateData,
  logMessageData,
  errorCodeData,
  subscribeToStreams,
  heartbeatData,
  ...props
}) => {
  return (
    <EventLog
      name={name}
      salindex={salindex}
      group={group}
      onCSCClick={onCSCClick}
      clearCSCErrorCodes={clearCSCErrorCodes}
      errorCodeData={errorCodeData}
      summaryStateData={summaryStateData}
      subscribeToStreams={subscribeToStreams}
      logMessageData={logMessageData}
      heartbeatData={heartbeatData}
      clearCSCLogMessages={clearCSCLogMessages}
      {...props}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscList) => {
      cscList.forEach((cscNameIndex) => {
        const nameIndex = Object.values(cscNameIndex).join('-');
        dispatch(addGroup(`event-${nameIndex}-logMessage`));
        dispatch(addGroup(`event-${nameIndex}-errorCode`));
      });
      //   dispatch(addGroup('event-Heartbeat-0-stream'));
    },
    clearCSCLogMessages: (cscList) => {
      cscList.forEach((cscNameIndex) => {
        dispatch(removeCSCLogMessages(cscNameIndex));
      });
    },
    clearCSCErrorCodes: (cscList) => {
      cscList.forEach((cscNameIndex) => {
        dispatch(removeCSCErrorCodeData(cscNameIndex));
      });
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const cscList = Object.values(CSCSummaryHierarchy).flatMap((realm) => {
    // console.log(realm);
    return Object.values(realm).flatMap((cscPairs) => {
      return cscPairs.flatMap((pair) => {
        // return Object.values(pair).join('-');
        return pair;
      });
    });
  });
  const errorCodeData = getGroupSortedErrorCodeData(state, cscList);
  const logMessageData = getGroupSortedLogMessageData(state, cscList);
  return {
    cscList,
    errorCodeData,
    logMessageData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventLogContainer);
