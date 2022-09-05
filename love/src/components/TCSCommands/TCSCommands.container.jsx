import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
import { requestDEMOCommand } from '../../redux/actions/time';
import { getPermCmdExec, getScriptQueueState } from '../../redux/selectors';
import TCSCommands from './TCSCommands';

export const schema = {
  description: 'Panel containing multiple buttons that execute different commands, such as closing the dome',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'TCS Commands',
    },
    nameTCS: {
      type: 'string',
      description: 'Name of the Telescope Control System (TCS) for the call of the commands ("aux" or "main").',
      isPrivate: false,
      default: 'aux',
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

const TCSCommandsContainer = ({
  queueState,
  commandExecutePermission,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {
  return (
    <TCSCommands
      state={queueState.state}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      commandExecutePermission={commandExecutePermission}
      {...props}
    />
  );
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
      return dispatch(requestSALCommand({ ...cmd, component, salindex }));
    },
    requestDemoCommand: (payload) => {
      return dispatch(requestDEMOCommand(payload));
    },
  };
};

const mapStateToProps = (state) => {
  const commandExecutePermission = getPermCmdExec(state);
  const queueState = getScriptQueueState(state, 1);
  return {
    commandExecutePermission,
    queueState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TCSCommandsContainer);
