import React from "react";
import ReactModal from 'react-modal';
import Button from '../Button/Button';

import styles from './Modal.module.css';


export default function Modal(props) {

  console.log('props: ', props);

  ReactModal.setAppElement('#root');
  const { children, ...other } = props;

  return (
    <ReactModal {...other} className={styles.modal} overlayClassName={styles.overlay}>
      <div className={styles.topbar}>
        <Button title='Close' status='transparent' onClick={props.onRequestClose}>
          &#10005;
        </Button>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </ReactModal>
  );
};
