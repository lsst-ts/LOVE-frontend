import React from 'react';
import styles from './MoonPointing.module.css';

function Moon(props) {
  const ilumination = 45;
  // ilumination = ilumination ?? 0;

  const fill = ilumination < 50 ? '#0c171e' : '#a6bac6';
  const rx = ilumination < 50 ? (50 - ilumination).toString() : (-50 + ilumination).toString();

  return (
    <svg id="Layer_6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path className={styles.cls20} d="m50,0c27.61,0,50,22.39,50,50s-22.39,50-50,50V0Z" />
      <path className={styles.cls10} d="m50,0C22.39,0,0,22.39,0,50s22.39,50,50,50V0Z" />
      <ellipse style={{ fill: fill }} cx="50" cy="50" rx={rx} ry="50" />
    </svg>
  );
}

export default Moon;
