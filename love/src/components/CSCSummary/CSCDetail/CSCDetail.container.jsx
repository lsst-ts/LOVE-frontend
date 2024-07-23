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
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamData, getCSCHeartbeat, getCSCWithWarning, getServerTime } from 'redux/selectors';
import CSCDetail from './CSCDetail';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Displays heartbeat and Summary State for a single CSC',
  defaultSize: [12, 6],
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
      default: 'CSC details',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: false,
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
    hasHeartbeat: {
      type: 'boolean',
      description: 'Whether the CSC produces heartbeat',
      isPrivate: false,
      default: true,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
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
  unsubscribeToStreams,
  heartbeatData,
  serverTime,
  embedded,
  withWarning,
  simulationMode,
  isRaw,
  subscriptions,
}) => {
  if (isRaw) {
    return <SubscriptionTableContainer subscriptions={subscriptions} name={name} salindex={salindex} />;
  }
  return (
    <CSCDetail
      group={group}
      name={name}
      salindex={salindex}
      hasHeartbeat={hasHeartbeat}
      summaryStateData={summaryStateData}
      onCSCClick={onCSCClick}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      heartbeatData={heartbeatData}
      embedded={embedded}
      withWarning={withWarning}
      serverTime={serverTime}
      simulationMode={simulationMode}
    />
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-${ownProps.name}-${ownProps.salindex}-summaryState`,
    `event-${ownProps.name}-${ownProps.salindex}-logMessage`,
    `event-${ownProps.name}-${ownProps.salindex}-errorCode`,
    `event-${ownProps.name}-${ownProps.salindex}-simulationMode`,
    `event-Heartbeat-0-stream`,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const serverTime = getServerTime(state);
  const withWarning = getCSCWithWarning(state, ownProps.name, ownProps.salindex);
  const heartbeatData = getCSCHeartbeat(state, ownProps.name, ownProps.salindex);
  const summaryStateData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-summaryState`)?.[0];
  const simulationMode = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-simulationMode`)?.[0];

  return {
    summaryStateData,
    simulationMode,
    heartbeatData,
    withWarning,
    serverTime,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CSCDetailContainer);
