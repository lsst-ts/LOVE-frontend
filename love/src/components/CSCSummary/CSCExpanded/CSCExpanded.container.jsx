/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import CSCExpanded from './CSCExpanded';
import { addGroup, removeGroup, requestSALCommand } from '../../../redux/actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../../../redux/actions/summaryData';
import { getStreamData, getCSCHeartbeat, getCSCLogMessages, getCSCErrorCodeData } from '../../../redux/selectors';

export const schema = {
  description: 'Displays the error code and message logs for a single CSC',
  defaultSize: [24, 29],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC expanded',
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
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
      isPrivate: true,
      default: [],
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const CSCExpandedContainer = ({
  name,
  salindex,
  group,
  onCSCClick,
  clearCSCErrorCodes,
  clearCSCLogMessages,
  requestSALCommand,
  summaryStateData,
  softwareVersions,
  cscLogLevelData,
  configurationsAvailable,
  configurationApplied,
  logMessageData,
  errorCodeData,
  subscribeToStreams,
  unsubscribeToStreams,
  heartbeatData,
  displaySummaryState = true,
  hideTitle = false,
}) => {
  return (
    <CSCExpanded
      name={name}
      salindex={salindex}
      group={group}
      onCSCClick={onCSCClick}
      clearCSCErrorCodes={clearCSCErrorCodes}
      requestSALCommand={requestSALCommand}
      errorCodeData={errorCodeData}
      summaryStateData={summaryStateData}
      softwareVersions={softwareVersions}
      cscLogLevelData={cscLogLevelData}
      configurationsAvailable={configurationsAvailable}
      configurationApplied={configurationApplied}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      logMessageData={logMessageData}
      heartbeatData={heartbeatData}
      clearCSCLogMessages={clearCSCLogMessages}
      displaySummaryState={displaySummaryState}
      hideTitle={hideTitle}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(addGroup('event-Heartbeat-0-stream'));
      dispatch(addGroup(`event-${cscName}-${index}-summaryState`));
      dispatch(addGroup(`event-${cscName}-${index}-logMessage`));
      dispatch(addGroup(`event-${cscName}-${index}-logLevel`));
      dispatch(addGroup(`event-${cscName}-${index}-errorCode`));
      dispatch(addGroup(`event-${cscName}-${index}-softwareVersions`));
      dispatch(addGroup(`event-${cscName}-${index}-configurationsAvailable`));
      dispatch(addGroup(`event-${cscName}-${index}-configurationApplied`));
    },
    unsubscribeToStreams: (cscName, index) => {
      dispatch(removeGroup('event-Heartbeat-0-stream'));
      dispatch(removeGroup(`event-${cscName}-${index}-summaryState`));
      dispatch(removeGroup(`event-${cscName}-${index}-logMessage`));
      dispatch(removeGroup(`event-${cscName}-${index}-logLevel`));
      dispatch(removeGroup(`event-${cscName}-${index}-errorCode`));
      dispatch(removeGroup(`event-${cscName}-${index}-softwareVersions`));
      dispatch(removeGroup(`event-${cscName}-${index}-configurationsAvailable`));
      dispatch(removeGroup(`event-${cscName}-${index}-configurationApplied`));
    },
    clearCSCLogMessages: (csc, salindex) => {
      dispatch(removeCSCLogMessages(csc, salindex));
    },
    clearCSCErrorCodes: (csc, salindex) => {
      dispatch(removeCSCErrorCodeData(csc, salindex));
    },
    requestSALCommand: (cmd) => {
      dispatch(
        requestSALCommand({
          ...cmd,
        }),
      );
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  let summaryStateData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-summaryState`);
  let heartbeatData = getCSCHeartbeat(state, ownProps.name, ownProps.salindex);
  let softwareVersions = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-softwareVersions`);
  let configurationsAvailable = getStreamData(
    state,
    `event-${ownProps.name}-${ownProps.salindex}-configurationsAvailable`,
  );
  let configurationApplied = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-configurationApplied`);
  let cscLogLevelData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-logLevel`);

  const logMessageData = getCSCLogMessages(state, ownProps.name, ownProps.salindex);
  const errorCodeData = getCSCErrorCodeData(state, ownProps.name, ownProps.salindex);
  summaryStateData = summaryStateData ? summaryStateData : {};

  return {
    summaryStateData: summaryStateData ? summaryStateData?.[0] : undefined,
    softwareVersions: softwareVersions ? softwareVersions?.[0] : undefined,
    configurationsAvailable: configurationsAvailable ? configurationsAvailable?.[0] : undefined,
    configurationApplied: configurationApplied ? configurationApplied?.[0] : undefined,
    cscLogLevelData: cscLogLevelData ? cscLogLevelData?.[0] : undefined,
    heartbeatData,
    logMessageData,
    errorCodeData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CSCExpandedContainer);
