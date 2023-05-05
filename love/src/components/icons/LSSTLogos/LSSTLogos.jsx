import React from 'react';
import styles from './LSSTLogos.module.css';
import img from './LSSTLogos.png';

function LSSTLogos(props) {
  const style = [styles, props.className].join(' ');
  return <img className={styles.img} src={img} />;
}

export default LSSTLogos;
