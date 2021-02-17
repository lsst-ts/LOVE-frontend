import React from 'react';
import { connect } from 'react-redux';
import { requestSALCommand } from '../../redux/actions/ws';
import { getPermCmdExec } from '../../redux/selectors';
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

const TCSCommandsContainer = ({ commandExecutePermission, ...props }) => {
  return <TCSCommands commandExecutePermission={commandExecutePermission} {...props} />;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestSALCommand: (component, salindex, cmd) => {
      return dispatch(requestSALCommand({ ...cmd, component, salindex }));
    },
  };
};

const mapStateToProps = (state) => {
  const commandExecutePermission = getPermCmdExec(state);
  return {
    commandExecutePermission: commandExecutePermission,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TCSCommandsContainer);
