import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { SALCommandStatus } from '../../redux/actions/ws';

export default class Layout extends Component {
  static propTypes = {
    /** Children components */
    children: PropTypes.node,
    /** Last SAL command that has been sent */
    lastSALCommand: PropTypes.object,
  };

  static defaultProps = {
    lastSALCommand: undefined,
  };

  static watcherSuccessfulCmds = {
    'cmd_acknowledge': 'acknowledged',
    'cmd_mute': 'muted',
    'cmd_unmute': 'unmuted',
  }

  static watcherErrorCmds = {
    'cmd_acknowledge': 'acknowledging',
    'cmd_mute': 'muting',
    'cmd_unmute': 'unmuting',
  }

  componentDidUpdate = (prevProps, _prevState) => {
    /* Check command ack for toast*/
    console.log('this.props.lastSALCommand: ', this.props.lastSALCommand);
    if (
      prevProps.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status === SALCommandStatus.ACK
    ) {
      const [message, result] = this.getNotificationMessage(this.props.lastSALCommand);
      if (result === 'Done') {
        toast.success(message);
      } else {
        toast.info(message);
      }
    }
  };

  getNotificationMessage = (salCommand) => {
    const cmd = salCommand.cmd;
    const result = salCommand.result;
    const component = salCommand.component;

    if (component === 'Watcher') {
      const alarm = salCommand.params.name;
      if (result === 'Done') {
        return [`Alarm '${alarm}' ${Layout.watcherSuccessfulCmds[cmd]} successfully`, result];
      } else {
        return [`Error ${Layout.watcherErrorCmds[cmd]} alarm '${alarm}', returned ${result}`, result];
      }
    }

    if (result === 'Done') {
      return [`Command '${cmd}' ran successfully`, result];
    } else {
      return [`Command '${cmd}' returned ${result}`, result];
    }
  };

  render() {
    return (
      <>
        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
        {this.props.children}
      </>
    );
  }
}
