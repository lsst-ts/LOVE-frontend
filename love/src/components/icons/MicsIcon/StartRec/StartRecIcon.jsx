import React from 'react';
import styles from './StartRecIcon.module.css';

function StartRecIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.01 14.4">
      {/* <rect x="0" y="0" width="36.01" height="14.4" rx="7.2" ry="7.2"/> */}
      
      <circle className={styles.cls3} cx="8.97" cy="7.11" r="2.48" />
      
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

export default StartRecIcon;
