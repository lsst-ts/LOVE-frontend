/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Button from '../Button/Button';
import styles from './Modal.module.css';

Modal.propTypes = {
  /** Children components */
  children: PropTypes.node,
  /** Footer components */
  footerChildren: PropTypes.node,
  /* String indicating how the content container should be announced to screenreaders */
  contentLabel: PropTypes.string,
  /** Boolean to define wether or not the modal is open */
  isOpen: PropTypes.bool,
  /** Function to call when modal closing is requested */
  onRequestClose: PropTypes.func,
  /** Additional className to apply to the modal */
  modalClassName: PropTypes.string,
  /** Whether to display the top bar */
  displayTopBar: PropTypes.bool,
  /** Whether to display the footer */
  displayFooter: PropTypes.bool,
};

Modal.defaultProps = {
  displayTopBar: true,
  displayFooter: true,
};

export default function Modal(props) {
  ReactModal.setAppElement('#root');
  const { children, modalClassName, footerChildren, displayTopBar, displayFooter, size, ...other } = props;
  return (
    <ReactModal
      {...other}
      className={[styles.modal, modalClassName, size ? styles['modal-' + size] : ''].join(' ')}
      overlayClassName={styles.overlay}
    >
      {displayTopBar && (
        <div className={styles.topbar}>
          <Button title="Close" status="transparent" onClick={props.onRequestClose}>
            &#10005;
          </Button>
        </div>
      )}

      <div className={styles.content}>{children}</div>

      {displayFooter && footerChildren && <div className={styles.footer}>{footerChildren}</div>}
    </ReactModal>
  );
}
