import React from 'react';
import PropTypes from 'prop-types';
import styles from './AnalogClock.module.css';
import * as dayjs from 'dayjs';

/**
 * Component that displays time and optionally the date below
 */
AnalogClock.propTypes = {
  /** Date-able object or float, if float it must be in milliseconds */
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
}

AnalogClock.defaultProps = {
  timestamp: dayjs(),
  showDate: true,
}

const renderMarkers = () => {
  const markers = [];
  const deltaAngle = 6;
  const shortLength = 1;
  const longLength = 1.5;
  for (let i = 0; i < 60; i++) {
    markers.push(
      <line
        key={i}
        x1={19 - (i % 5 ? shortLength : longLength)}
        y1="0" x2="19" y2="0"
        transform={`rotate(${deltaAngle * i}, 0, 0)`}
        className={i % 5 ? null : styles.heavyMarker}/>
    );
  }
  markers.push(<text key="hour-0" className={styles.number} transform={`translate(-2, -13.5)`}> 12 </text>);
  markers.push(<text key="hour-3" className={styles.number} transform={`translate(14.5, 1.5)`}> 3 </text>);
  markers.push(<text key="hour-9" className={styles.number} transform={`translate(-1, 16.5)`}> 6 </text>);
  markers.push(<text key="hour-6" className={styles.number} transform={`translate(-16.5, 1.5)`}> 9 </text>);
  return markers;
}

export default function AnalogClock ({ timestamp }) {
  const t = timestamp instanceof dayjs ? timestamp : dayjs(timestamp);
  const markers = renderMarkers();
  const second = timestamp.second();
  const minute = timestamp.minute() + (second / 60);
  const hour = (timestamp.hour() % 12) + (minute / 60);
  return (
    <svg viewBox="0 0 40 40">
      <circle className={styles.background} cx="20" cy="20" r="19" />
      <circle className={styles.center} cx="20" cy="20" r="0.7"/>

      <g className={styles.marks}>
        { markers }
        <text key="hour-0" className={styles.number} transform={`translate(-2, -13.5)`}> 12 </text>
        <text key="hour-3" className={styles.number} transform={`translate(14.5, 1.5)`}> 3 </text>
        <text key="hour-9" className={styles.number} transform={`translate(-1, 16.5)`}> 6 </text>
        <text key="hour-6" className={styles.number} transform={`translate(-16.5, 1.5)`}> 9 </text>

        <line x1="0" y1="0" x2="9" y2="0"   className={styles.hour}   transform={`rotate(${30 * hour - 90}, 0, 0)`}/>
        <line x1="0" y1="0" x2="12" y2="0"  className={styles.minute}  transform={`rotate(${6 * minute - 90}, 0, 0)`}/>
        <line x1="-3" y1="0" x2="14" y2="0" className={styles.second} transform={`rotate(${6 * second - 90}, 0, 0)`}/>
      </g>

    </svg>
  );
}