import React from "react";
import ReactModal from 'react-modal';
import styles from './Modal.module.css';


export default function Modal(props) {
  ReactModal.setAppElement('#root');
  const { children, ...other } = props;
  return (
    <ReactModal {...other} className={styles.modal}>
      {children}
    </ReactModal>
  );
};
