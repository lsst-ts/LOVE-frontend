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

export default function AnalogClock ({ timestamp }) {
  const t = timestamp instanceof dayjs ? timestamp : dayjs(timestamp);
  return (
    <svg className={styles.svgOverlay} viewBox="0 0 224.8 235">
      <g>
        <g>
          <circle className={styles.st0} cx="113.5" cy="116.6" r="108.5"/>
          <g className={styles.st1}>
            <circle className={styles.st2} cx="113.5" cy="116.6" r="105"/>
          </g>
          <g>
            <rect x="96.2" y="17.7" className={styles.st3} width="22.8" height="12.5"/>
            <text transform="matrix(1 0 0 1 99.7725 28.2965)" className={[styles.st4, styles.st5, styles.st6].join(' ')}>12</text>
          </g>
          <g>
            <rect x="100.2" y="207.4" className={styles.st3} width="14.7" height="12.5"/>
            <text transform="matrix(1 0 0 1 103.6641 217.9962)" className={[styles.st4, styles.st5, styles.st6].join(' ')}>6</text>
          </g>
          <g>
            <rect x="9.9" y="112.2" className={styles.st3} width="14.7" height="12.5"/>
            <text transform="matrix(1 0 0 1 13.3647 122.796)" className={[styles.st4, styles.st5, styles.st6].join(' ')}>9</text>
          </g>
          <g>
            <rect x="201.7" y="112.2" className={styles.st3} width="14.7" height="12.5"/>
            <text transform="matrix(1 0 0 1 205.1646 122.796)" className={[styles.st4, styles.st5, styles.st6].join(' ')}>3</text>
          </g>
          <g>
            <g>
              <rect x="106.9" y="8.5" className={styles.st4} width="2.8" height="5.6"/>
              <rect x="106.5" y="218.8" className={styles.st4} width="2.8" height="5.6"/>
            </g>
            <g>
              <rect x="5.7" y="114.9" className={styles.st4} width="5.6" height="2.8"/>
              <rect x="216" y="115.2" className={styles.st4} width="5.6" height="2.8"/>
            </g>
          </g>
          <g>
            
              <rect x="45.3" y="197.7" transform="matrix(0.6467 -0.7628 0.7628 0.6467 -134.847 107.036)" className={styles.st4} width="5.6" height="2.8"/>
            
              <rect x="165.2" y="25.4" transform="matrix(0.5125 -0.8587 0.8587 0.5125 58.8792 157.3678)" className={styles.st4} width="5.6" height="2.8"/>
          </g>
          <g>
            
              <rect x="14.9" y="158.7" transform="matrix(0.9094 -0.4159 0.4159 0.9094 -64.9941 21.8478)" className={styles.st4} width="5.6" height="2.8"/>
            
              <rect x="201.7" y="63.7" transform="matrix(0.9094 -0.4159 0.4159 0.9094 -8.5333 90.9603)" className={styles.st4} width="5.6" height="2.8"/>
          </g>
          <g>
            <g>
              
                <rect x="165.8" y="204" transform="matrix(0.9094 -0.4159 0.4159 0.9094 -70.8454 88.2697)" className={styles.st4} width="2.8" height="5.6"/>
              
                <rect x="58.4" y="24.1" transform="matrix(0.8587 -0.5125 0.5125 0.8587 -5.3506 34.4712)" className={styles.st4} width="2.8" height="5.6"/>
            </g>
            <g>
              
                <rect x="204.6" y="163.6" transform="matrix(0.4159 -0.9094 0.9094 0.4159 -31.04 284.5655)" className={styles.st4} width="2.8" height="5.6"/>
              
                <rect x="21.9" y="62.2" transform="matrix(0.4159 -0.9094 0.9094 0.4159 -45.5589 59.1608)" className={styles.st4} width="2.8" height="5.6"/>
            </g>
          </g>
        </g>
        <line className={styles.st7} x1="211.9" y1="107.4" x2="98.5" y2="119.3"/>
        <line className={styles.st8} x1="76.6" y1="166.2" x2="113.4" y2="119.5"/>
        <line className={styles.st9} x1="137.2" y1="29.5" x2="114.7" y2="116.6"/>
        <circle className={styles.st10} cx="113.7" cy="117.8" r="5.3"/>
      </g>
    </svg>
  );
}
