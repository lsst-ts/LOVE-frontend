import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Zoom.module.css';

function ZoomOutIcon(props) {
  const [cls1, cls2, svg] = props.block
    ? [styles.cls1Not, styles.cls2Not, styles.svgNot]
    : [styles.cls1, styles.cls2, styles.svgNot];

  return (
    <svg id="Capa_3" className={svg} data-name="Capa 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.8 31.8">
      <path className={cls2} d="m5.5.5h25.8v30.8H5.5c-2.76,0-5-2.24-5-5V5.5C.5,2.74,2.74.5,5.5.5Z" />
      <circle className={styles.cls3} cx="16.43" cy="15.12" r="7.7" />
      <line className={cls1} x1="13.8" y1="15.12" x2="19.05" y2="15.12" />
      <line className={cls1} x1="7.19" y1="24.7" x2="10.89" y2="20.99" />
    </svg>
  );
}

export default ZoomOutIcon;