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
import { addGroup, removeGroup, requestSALCommand } from 'redux/actions/ws';
import {
  getScriptQueueState,
  getScriptHeartbeats,
  getSummaryStateValue,
  getPermCmdExec,
  getLastSALCommand,
  getUsername,
  getAuthlistState,
  getEfdConfig,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ScriptQueue from './ScriptQueue';

export const schema = {
  description: `Component containing information about the scripts currently running, scripts to be run (in queue) and past scripts.
                Allows commands to be sent for interacting with the scripts, such as stopping, enqueueing and requeueing scripts`,
  defaultSize: [66, 38],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Script queue',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the ScriptQueue',
      isPrivate: false,
      default: 1,
    },
  },
};

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  requestSALCommand,
  summaryStateValue,
  queueState,
  scriptHeartbeats,
  commandExecutePermission,
  lastSALCommand,
  username,
  salindex,
  fit,
  embedded,
  authlist,
  efdConfig,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <ScriptQueue
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      requestSALCommand={requestSALCommand}
      summaryStateValue={summaryStateValue}
      current={queueState.current}
      finishedScriptList={queueState.finishedScriptList}
      availableScriptList={queueState.availableScriptList}
      waitingScriptList={queueState.waitingScriptList}
      state={queueState.state}
      heartbeats={scriptHeartbeats}
      commandExecutePermission={commandExecutePermission}
      lastSALCommand={lastSALCommand}
      username={username}
      salindex={salindex}
      fit={fit}
      embedded={embedded}
      running={queueState.running}
      authlist={authlist}
      efdConfig={efdConfig}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const queueState = getScriptQueueState(state, ownProps.salindex);
  const scriptHeartbeats = getScriptHeartbeats(state, ownProps.salindex);
  const summaryStateValue = getSummaryStateValue(state, `event-ScriptQueue-${ownProps.salindex}-summaryState`);
  const commandExecutePermission = getPermCmdExec(state);
  const lastSALCommand = getLastSALCommand(state);
  const username = getUsername(state);
  const authlist = getAuthlistState(state, [`event-ScriptQueue-${ownProps.salindex}-authList`]);
  const efdConfig = getEfdConfig(state);
  return {
    queueState,
    scriptHeartbeats,
    summaryStateValue,
    commandExecutePermission,
    lastSALCommand,
    username,
    authlist,
    efdConfig,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-ScriptQueueState-${ownProps.salindex}-stateStream`,
    `event-ScriptQueueState-${ownProps.salindex}-scriptsStream`,
    `event-ScriptQueueState-${ownProps.salindex}-availableScriptsStream`,
    `event-ScriptQueue-${ownProps.salindex}-summaryState`,
    `event-ScriptHeartbeats-${ownProps.salindex}-stream`,
    `event-ScriptQueue-${ownProps.salindex}-authList`,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    requestSALCommand: (cmd) => {
      if (cmd.csc === 'Script') {
        return dispatch(requestSALCommand({ ...cmd, component: 'Script', salindex: 0 }));
      }
      return dispatch(requestSALCommand({ ...cmd, component: 'ScriptQueue', salindex: ownProps.salindex }));
    },
  };
};
const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(ScriptQueueContainer);

connectedContainer.defaultProps = {
  salindex: 1,
};

export default connectedContainer;
