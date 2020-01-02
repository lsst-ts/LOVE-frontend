import React from "react";
import styles from './Modal.module.css';


export default function Modal({ handleClose, show, children }) {
  const showHideClassName = [styles.modal, show ? styles.displayBlock : styles.displayNone].join(' ');

  return (
    <div className={showHideClassName}>
      <section className={styles.modalMain}>
        {children}
        <button onClick={handleClose}>close</button>
      </section>
    </div>
  );
};
