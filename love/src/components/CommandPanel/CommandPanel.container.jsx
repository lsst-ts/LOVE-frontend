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
    scriptQueueIndex: {
      type: 'number',
      description: 'Salindex of the ScriptQueue to listen events',
      isPrivate: false,
      default: 1,
    },
  },
};

const CommandPanelContainer = ({ ...props }) => {
  return <CommandPanel {...props} />;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [`event-ScriptQueueState-${ownProps.scriptQueueIndex}-stream`];
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
  const queueState = getScriptQueueState(state, ownProps.scriptQueueIndex);
  return {
    commandExecutePermission,
    queueState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommandPanelContainer);
