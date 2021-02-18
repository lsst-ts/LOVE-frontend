import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
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
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
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
  const subscriptions = [`event-ScriptQueueState-1-stream`];
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
  };
};

const mapStateToProps = (state) => {
  const commandExecutePermission = getPermCmdExec(state);
  const queueState = getScriptQueueState(state, 1);
  return {
    commandExecutePermission: commandExecutePermission,
    queueState: queueState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TCSCommandsContainer);
