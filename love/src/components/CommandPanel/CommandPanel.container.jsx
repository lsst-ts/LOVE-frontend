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
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
import { getPermCmdExec, getScriptQueueState } from '../../redux/selectors';
import CommandPanel from './CommandPanel';

export const schema = {
  description: 'Panel containing multiple buttons that execute different commands, such as closing the dome',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Command Panel',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const CommandPanelContainer = ({ ...props }) => {
  return <CommandPanel {...props} />;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [`event-ScriptQueueState-1-stream`, `event-ScriptQueueState-2-stream`];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    requestSALCommand: (component, salindex, cmd) => {
      dispatch(requestSALCommand({ ...cmd, component, salindex }));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const commandExecutePermission = getPermCmdExec(state);
  const mainQueueState = getScriptQueueState(state, 1);
  const auxQueueState = getScriptQueueState(state, 2);
  return {
    commandExecutePermission,
    auxQueueState,
    mainQueueState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommandPanelContainer);
