import React from 'react';
import styles from './RecIcon.module.css';

function RecIcon(props) {
const isRecording = props.isRecording ? true : false;
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.01 14.4">
      <rect className={[styles.cls5, !isRecording ? styles.opacity : ''].join(' ')}
        x="0" y="0" width="36.01" height="14.4" rx="7.2" ry="7.2"
      />

      { !isRecording? (
        <circle className={styles.cls3} cx="8.97" cy="7.11" r="2.48" />
      ) : (
        <rect className={styles.cls4} x="6.7" y="5" width="4.1" height="4.1" />
      )
      }
      <text className={styles.cls1} transform="translate(15.3 9.78) scale(.82 1)">
        <tspan x="0" y="0">
          R
        </tspan>
        <tspan className={styles.cls2} x="5.93" y="0">
          E
        </tspan>
        <tspan x="11.33" y="0">
          C
        </tspan>
      </text>
    </svg>
  );
}

export default RecIcon;
