/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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
import { getUsername, getPermCmdExec, getScriptQueueOn, getScriptSchema } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import NightPlanning from './NightPlanning';

export const schema = {
  description: 'Night planning tool interface',
  defaultSize: [77, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'LOVE Night Planning tool',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const NightPlanningContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <NightPlanning {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const username = getUsername(state);
  const commandExecutePermission = getPermCmdExec(state);
  return {
    username,
    commandExecutePermission,
    getScriptQueueOn: (index) => getScriptQueueOn(state, index),
    getScriptSchema: (scriptQueueIndex, scriptPath) => getScriptSchema(state, scriptQueueIndex, scriptPath),
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    `event-ScriptQueueState-1-stateStream`,
    `event-ScriptQueueState-1-availableScriptsStream`,
    `event-ScriptQueueState-2-stateStream`,
    `event-ScriptQueueState-2-availableScriptsStream`,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
    requestSALCommand: (cmd) => {
      return dispatch(requestSALCommand(cmd));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NightPlanningContainer);
