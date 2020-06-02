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
  const { children, modalClassName, footerChildren, displayTopBar, displayFooter, ...other } = props;

  return (
    <ReactModal {...other} className={[styles.modal, modalClassName].join(' ')} overlayClassName={styles.overlay}>
      {displayTopBar && (
        <div className={styles.topbar}>
          <Button title="Close" status="transparent" onClick={props.onRequestClose}>
            &#10005;
          </Button>
        </div>
      )}

      <div className={styles.content}>{children}</div>

      {displayFooter && <div className={styles.footer}>{footerChildren}</div>}
    </ReactModal>
  );
}
