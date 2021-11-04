import React from 'react';
import { connect } from 'react-redux';
import EventLog from './EventLog';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../../redux/actions/summaryData';
import { getGroupSortedErrorCodeData, getGroupSortedLogMessageData } from '../../redux/selectors';
import { defaultCSCList } from '../../Config';

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
<<<<<<< HEAD
    cscList: {
      type: 'array',
      description:
        'Array of the CSCs to be included in the group, as objects with the format: {name: <component-name>, salindex: <number>}',
      isPrivate: false,
      default: defaultCSCList,
    },
=======
>>>>>>> add the set of max length to the arrays logMessageData and errorCodeData, to 100 and 50 respective. Separe changes of the tickets-52
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
  unsubscribeToStreams,
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
      unsubscribeToStreams={unsubscribeToStreams}
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
    },
    unsubscribeToStreams: (cscList) => {
      cscList.forEach((cscNameIndex) => {
        const nameIndex = Object.values(cscNameIndex).join('-');
        dispatch(removeGroup(`event-${nameIndex}-logMessage`));
        dispatch(removeGroup(`event-${nameIndex}-errorCode`));
      });
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
<<<<<<< HEAD
  const cscList = ownProps.cscList;
=======
  const cscList = Object.values(CSCSummaryHierarchy).flatMap((realm) => {
    //console.log(realm);
    return Object.values(realm).flatMap((cscPairs) => {
      return cscPairs.flatMap((pair) => {
        // return Object.values(pair).join('-');
        return pair;
      });
    });
  });
>>>>>>> add the set of max length to the arrays logMessageData and errorCodeData, to 100 and 50 respective. Separe changes of the tickets-52
  const errorCodeData = getGroupSortedErrorCodeData(state, cscList);
  const logMessageData = getGroupSortedLogMessageData(state, cscList);
  return {
    cscList,
    errorCodeData,
    logMessageData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventLogContainer);
