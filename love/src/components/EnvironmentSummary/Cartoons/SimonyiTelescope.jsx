import React, { useState } from 'react';
import styles from './SimonyiTelescope.module.css';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import SimonyiSummary from '../SummaryInformation/SimonyiSummary';

function SimonyiTelescope({ className, ...props }) {
  const [showSimonyiSummary, setShowSimonyiSummary] = useState(false);

  return (
    <svg viewBox="0 0 726.72 436.7" className={className} {...props}>
      <text x={245} y={10} width="60" height="40" className={styles.temperature}>
        10.12°
      </text>
      <g id="Simonyi">
        <g id="TMA" onMouseEnter={() => setShowSimonyiSummary(true)} onMouseLeave={() => setShowSimonyiSummary(false)}>
          <text x={185} y={40} width="60" height="40" className={styles.temperature}>
            18.36 °C
          </text>
          <g>
            <g>
              <rect className={styles.cls4} x="153.4" y="44.72" width="16.11" height="54.37" />
              <polygon
                className={styles.cls4}
                points="169.19 103.97 153.73 103.97 153.4 99.09 169.51 99.09 169.19 103.97"
              />
              <rect className={styles.cls8} x="143.43" y="52.29" width="36.05" height="28.63" />
            </g>
            <rect
              className={styles.cls4}
              x="115.25"
              y="90.38"
              width="53.56"
              height="3.66"
              transform="translate(147.92 -77.03) rotate(59)"
            />
            <rect
              className={styles.cls4}
              x="154.56"
              y="90.38"
              width="53.56"
              height="3.66"
              transform="translate(353.77 -15.73) rotate(121)"
            />
            <polygon
              className={styles.cls3}
              points="209.38 80.95 113.79 80.95 110.54 84.85 212.63 84.85 209.38 80.95"
            />
            <rect className={styles.cls3} x="129.35" y="136.68" width="64.39" height="19.13" />
            <path
              className={styles.cls3}
              d="m207.07,145.25l-6.5,19.27h-78.04s-6.5-19.27-6.5-19.27l-.18-34.1,8.45-45.03h4.33v45.03h0l2.26,10.39c1.04,16.03,14.37,28.71,30.66,28.71s29.62-12.68,30.66-28.71l2.55-10.39h0v-45.03h4.33l8.45,45.03-.47,34.1Z"
            />
            <polygon
              className={styles.cls3}
              points="213.57 108.14 213.57 127.38 207.07 129.6 116.02 129.6 109.51 127.38 109.51 108.14 213.57 108.14"
            />
            <path className={styles.cls3} d="m210.24,58.31h-97.56l-1.3,7.8h100.16l-1.3-7.8Z" />
          </g>
          <g>
            <g>
              <path
                className={styles.cls2}
                d="m176.21,127.55v-7.76c0-8.08-6.55-14.63-14.63-14.63h0c-8.08,0-14.63,6.55-14.63,14.63v7.76s-49.67,43.18-49.67,43.18h21.02s.34-.07.34-.07l-1.55-7.3,28.28-24.59,8.11,17.26,3.33,14.64h6.05s3.51,0,3.51,0l3.33-14.64,8.11-17.26,28.28,24.59-1.55,7.3.34.07h21.02l-49.67-43.18Z"
              />
              <path
                className={styles.cls2}
                d="m174.91,119.79c0,7.36-5.97,13.33-13.33,13.33-7.36,0-13.33-5.97-13.33-13.33s5.97-13.33,13.33-13.33c7.36,0,13.33,5.97,13.33,13.33Z"
              />
            </g>
            <rect className={styles.cls2} x="80.93" y="169.76" width="161.29" height="5.28" />
          </g>
        </g>
        <polygon
          id="Facility"
          className={styles.cls3}
          points="33.94 176.07 274.72 176.07 274.72 200.89 385.54 200.89 396.18 230.26 581.34 230.28 701.87 309.3 692.77 309.14 692.8 314.24 694.51 314.24 720.11 346.48 712.52 346.83 712.52 351.39 714.5 351.53 725.27 380.34 712.97 380.34 712.97 385.81 716.87 385.81 714.51 430.74 712.97 430.74 712.97 435.7 1.05 435.7 1 300.02 41.16 300.02 41.32 209.26 33.94 208.77 33.94 176.07"
        />
        <polygon
          id="SimonyiDome"
          className={styles.cls6}
          points="275.31 175.1 275.31 49.4 202.98 1.11 74.29 45.61 20.96 129.31 20.96 176.07 275.31 175.1"
        />
      </g>
      <g id="LiftSchute">
        <rect className={styles.cls1} x="286.38" y="175.7" width="98.48" height="200" />
        <line className={styles.cls7} x1="287.38" y1="335.7" x2="383.85" y2="335.7" />
        <line className={styles.cls7} x1="287.38" y1="295.7" x2="383.85" y2="295.7" />
        <line className={styles.cls7} x1="287.38" y1="255.7" x2="383.85" y2="255.7" />
        <polyline className={styles.cls7} points="286.38 174.7 286.38 135.7 384.85 135.7 384.85 174.7" />
        <line className={styles.cls7} x1="287.38" y1="215.7" x2="383.85" y2="215.7" />
      </g>
      <g id="Floors" className={styles.cls10}>
        <text className={styles.cls9} transform="translate(326.84 362.67)">
          <tspan x="0" y="0">
            3
          </tspan>
        </text>
        <text className={styles.cls9} transform="translate(325.87 322.44)">
          <tspan x="0" y="0">
            4
          </tspan>
        </text>
        <text className={styles.cls9} transform="translate(326.81 282.21)">
          <tspan x="0" y="0">
            5
          </tspan>
        </text>
        <text className={styles.cls9} transform="translate(326.39 241.97)">
          <tspan x="0" y="0">
            6
          </tspan>
        </text>
        <text className={styles.cls9} transform="translate(326.56 201.74)">
          <tspan x="0" y="0">
            7
          </tspan>
        </text>
        <text className={styles.cls9} transform="translate(326.16 161.51)">
          <tspan x="0" y="0">
            8
          </tspan>
        </text>
      </g>
      <g id="Platform">
        <polygon
          className={styles.cls2}
          points="375.61 270.98 375.61 280.98 365.61 290.98 305.61 290.98 295.61 280.98 295.61 270.98 375.61 270.98"
        />
        <rect className={styles.cls3} x="300.62" y="260.98" width="70" height="10" />
        <path className={styles.cls5} d="m358.12,260.98c0,3.31-10.07,6-22.5,6s-22.5-2.69-22.5-6" />
      </g>
      {showSimonyiSummary && (
        <foreignObject className={styles.simonyiHover}>
          <div className={styles.simonyiSummary}>
            <SimonyiSummary />
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

export default SimonyiTelescope;
