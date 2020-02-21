import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import styles from './ConfirmationModal.module.css';

export default class ConfirmationModal extends Component {
  static propTypes = {
    /** Boolean to define wether or not the modal is open */
    isOpen: PropTypes.bool,
    /** Confirmation message */
    message: PropTypes.string,
    /** Confirmation button text */
    confirmText: PropTypes.string,
    /** Coancelation button text */
    cancelText: PropTypes.string,
    /** Function to call when the action is confirmed */
    confirmCallback: PropTypes.func,
    /** Function to call when the action is canceled */
    cancelCallback: PropTypes.func,
  };

  static defaultProps = {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  };

  constructor() {
    super();
    this.state = {
      selected: [],
    };
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.cancelCallback}
        contentLabel="Confirmation Dialog"
        modalClassName={styles.modal}
      >
        <div className={styles.container}>
          <div className={styles.content}>
            <h2> {this.props.message} </h2>

          </div>
          <div className={styles.footer}>
            <span />
            <Button
              status="default"
              onClick={this.props.cancelCallback}
            >
              {this.props.cancelText}
            </Button>
            <Button
              status="primary"
              onClick={this.props.confirmCallback}
            >
              {this.props.confirmText}
            </Button>
          </div>
        </div>
    </Modal>
    );
  }
}
