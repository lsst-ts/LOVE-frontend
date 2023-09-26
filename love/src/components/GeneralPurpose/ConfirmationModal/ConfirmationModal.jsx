/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
        footerChildren={
          <>
            <Button status="default" onClick={this.props.cancelCallback} className={styles.button}>
              {this.props.cancelText}
            </Button>
            <Button status="primary" onClick={this.props.confirmCallback} className={styles.button}>
              {this.props.confirmText}
            </Button>
          </>
        }
      >
        <div className={styles.content}>
          <p> {this.props.message} </p>
        </div>
      </Modal>
    );
  }
}
