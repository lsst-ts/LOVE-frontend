import React from 'react';
import { connect } from 'react-redux';
import { requestSALCommand } from '../../redux/actions/ws';
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
  return {
    requestSALCommand: (component, salindex, cmd) => {
      return;
      dispatch(requestSALCommand({ ...cmd, component, salindex }));
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

export default connect(mapStateToProps, mapDispatchToProps)(CommandPanelContainer);
