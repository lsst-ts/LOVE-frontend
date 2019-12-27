import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage } from '../../Utils';

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

  componentDidUpdate = (prevProps, _prevState) => {
    /* Check command ack for toast*/
    if (
      prevProps.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status === SALCommandStatus.ACK
    ) {
      const [message, result] = getNotificationMessage(this.props.lastSALCommand);
      if (result === 'Done') {
        toast.success(message);
      } else {
        toast.info(message);
      }
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
