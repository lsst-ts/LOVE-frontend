import React, { useState } from 'react';
import styles from './AuxTelescope.module.css';
import AuxtelSummary from '../SummaryInformation/AuxtelSummary';

function AuxTelescope({ className, ...props }) {
  const [showAuxtelSummary, setShowAuxtelSummary] = useState(false);
  const {
    auxtelTrackingState,
    auxtelAltitude,
    auxtelAzimuth,
    auxtelRotator,
    auxtelDomeAlt,
    auxtelDomeAz,
    hideIconTemperature,
    showIconTemperature,
  } = props;

  const auxtelMouseEnter = () => {
    setShowAuxtelSummary(true);
    hideIconTemperature();
  };

  const auxtelMouseLeave = () => {
    setShowAuxtelSummary(false);
    showIconTemperature();
  };

  return (
    <svg viewBox="0 0 444.43 436.59" className={className} {...props}>
      {/* <text x={135} y={10} width="60" height="40" className={styles.temperature}>
        10.84 °C
      </text> */}
      <g id="ATDome">
        <rect className={styles.cls2} x="169.41" y="132.63" width="176.93" height="45" />
        <path
          className={showAuxtelSummary ? styles.hover : styles.cls5}
          d="m257.87,1h0c48.83,0,88.46,39.64,88.46,88.46v43.17h-176.93v-43.17c0-48.83,39.64-88.46,88.46-88.46Z"
        />
      </g>
      <g id="AuxTel">
        {/* <text x={187} y={50} width="60" height="40" className={styles.temperature}>
          10.36 °C
        </text> */}
        <g id="ATMount" className={styles.hoverable} onMouseEnter={auxtelMouseEnter} onMouseLeave={auxtelMouseLeave}>
          <rect className={styles.cls1} x="242.87" y="117.66" width="30" height="8" />
          <g>
            <rect className={styles.cls1} x="237.08" y="124.52" width="41.58" height="6.14" />
            <polygon
              className={styles.cls2}
              points="276.97 79.66 276.97 106.44 271.75 111.66 244 111.66 238.78 106.44 238.78 79.66 230.78 79.66 230.78 111.66 230.78 119.66 238.78 119.66 276.97 119.66 284.97 119.66 284.97 111.66 284.97 79.66 276.97 79.66"
            />
            <rect className={styles.cls3} x="251.32" y="62.84" width="13.12" height="37.12" />
            <rect className={styles.cls4} x="242.87" y="29.66" width="30" height="50" />
            <rect className={styles.cls3} x="253.87" y="23.96" width="8" height="10" />
            <polygon
              className={styles.cls4}
              points="272.87 29.66 242.87 29.66 256.87 79.66 258.87 79.66 272.87 29.66"
            />
            <rect className={styles.cls2} x="238.78" y="81.66" width="38.18" height="8" />
          </g>
        </g>
        <g id="CalibrationHill">
          <polygon
            className={styles.cls1}
            points="108.87 177.63 384.04 177.63 384.04 435.59 1.11 435.59 21.11 237.63 108.87 177.63"
          />
          <polygon
            className={styles.cls1}
            points="394.04 177.63 359.94 177.63 15.77 290.12 1.11 435.59 443.43 435.59 443.43 219.08 394.04 177.63"
          />
        </g>
      </g>
      {showAuxtelSummary && (
        <foreignObject className={styles.auxtelHover}>
          <div className={styles.auxtelSummary}>
            <AuxtelSummary
              auxtelTrackingState={auxtelTrackingState}
              auxtelAltitude={auxtelAltitude}
              auxtelAzimuth={auxtelAzimuth}
              auxtelRotator={auxtelRotator}
              auxtelDomeAlt={auxtelDomeAlt}
              auxtelDomeAz={auxtelDomeAz}
            />
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

export default AuxTelescope;
