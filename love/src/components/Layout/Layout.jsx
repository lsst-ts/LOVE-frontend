import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage } from '../../Utils';
import Button from '../GeneralPurpose/Button/Button';
import Modal from '../GeneralPurpose/Modal/Modal';
import styles from './Layout.module.css';


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

  constructor() {
    super();
    this.state = {
      show: false,
    }
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

  hideModal = () => {
    this.setState({ show: false });
  };

  showModal = e => {
    this.setState({ show: true });
  };

  render() {
    return (
      <>
        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
        <Modal show={this.state.show} handleClose={this.hideModal}/>
        <div className={styles.topbar} onClick={this.showModal}>
          <Button> + </Button>
        </div>
        <div className={styles.contentWrapper}>
          {this.props.children}
        </div>
      </>
    );
  }
}
