import React from "react";
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Button from '../Button/Button';
import styles from './Modal.module.css';

Modal.propTypes = {
  /** Children components */
  children: PropTypes.node,
  /* String indicating how the content container should be announced to screenreaders */
  contentLabel: PropTypes.string,
  /** Boolean to define wether or not the modal is open */
  isOpen: PropTypes.bool,
  /** Function to call when modal closing is requested */
  onRequestClose: PropTypes.func,
  /** Additional className to apply to the modal */
  modalClassName: PropTypes.string,
};


export default function Modal(props) {
  ReactModal.setAppElement('#root');
  const { children, modalClassName, ...other } = props;

  return (
    <ReactModal {...other} className={[styles.modal, modalClassName].join(' ')} overlayClassName={styles.overlay}>
      <div className={styles.topbar}>
        <Button title='Close' status='transparent' onClick={props.onRequestClose}>
          &#10005;
        </Button>

      </div>
      {children}
    </ReactModal>
  );
};
