/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
    cscList: {
      type: 'array',
      description:
        'Array of the CSCs to be included in the group, as objects with the format: {name: <component-name>, salindex: <number>}',
      isPrivate: false,
      default: defaultCSCList,
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
  const cscList = ownProps.cscList;
  const errorCodeData = getGroupSortedErrorCodeData(state, cscList);
  const logMessageData = getGroupSortedLogMessageData(state, cscList);
  return {
    cscList,
    errorCodeData,
    logMessageData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventLogContainer);
