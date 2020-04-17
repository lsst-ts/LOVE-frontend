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
    message: PropTypes.node,
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
        footerChildren={(
          <>
          <Button
            status="default"
            onClick={this.props.cancelCallback}
            className={styles.button}
          >
            {this.props.cancelText}
          </Button>
          <Button
            status="primary"
            onClick={this.props.confirmCallback}
            className={styles.button}
          >
            {this.props.confirmText}
          </Button>
          </>
        )}
      >
        <div className={styles.content}>
          <p> {this.props.message} </p>
        </div>
    </Modal>
    );
  }
}
