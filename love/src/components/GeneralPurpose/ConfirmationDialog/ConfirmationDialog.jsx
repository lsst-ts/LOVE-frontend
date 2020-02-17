import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import styles from './ConfirmationDialog.module.css';

export default class ConfirmationDialog extends Component {
  static propTypes = {
    /** Confirmation message */
    message: PropTypes.string,
    /** Confirmation button text */
    confirmText: PropTypes.string,
    /** Coancelation button text */
    coancelText: PropTypes.string,
    /** Function to call when the action is confirmed */
    confirmCallback: PropTypes.func,
    /** Function to call when the action is canceled */
    canceledCallback: PropTypes.func,
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
    );
  }
}
