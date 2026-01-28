/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import styles from './Icons/Style.module.css';

function PipelineIcon({ phases }) {
  const alert = (
    <>
      <path
        className={styles.alert}
        d="m45.49,14.5c-.33,0-.59.18-.59.5,0,.97.11,2.36.11,3.33,0,.25.22.36.48.36.2,0,.47-.11.47-.36,0-.97.11-2.36.11-3.33,0-.32-.27-.5-.59-.5Z"
      />
      <path className={styles.alert} d="m45.5,19.25c-.35,0-.63.28-.63.63s.28.63.63.63.63-.28.63-.63-.28-.63-.63-.63Z" />
    </>
  );
  const mapStateToSvg = {
    0: { rectStyle: styles.wait, alert: false, pathStyle: styles.wait },
    1: { rectStyle: styles.processing, alert: false, pathStyle: styles.path },
    2: { rectStyle: styles.complete, alert: false, pathStyle: styles.path },
    3: { rectStyle: styles.processing, alert: true, pathStyle: styles.path },
  };
  const phasesPip = phases ?? { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

  return (
    <svg id="Layer_1" viewBox="0 0 71 23">
      <rect
        className={mapStateToSvg[phasesPip[0]].rectStyle}
        x=".5"
        y="12.5"
        width="10"
        height="10"
        rx="1.71"
        ry="1.71"
      />
      <path className={mapStateToSvg[phasesPip[1]].pathStyle} d="m5.5,12.59h0c0-3.92,3.18-7.09,7.09-7.09h7.7" />
      <rect
        className={mapStateToSvg[phasesPip[1]].rectStyle}
        x="20.5"
        y=".5"
        width="10"
        height="10"
        rx="1.71"
        ry="1.71"
      />
      <line className={mapStateToSvg[phasesPip[2]].rectStyle} x1="10.62" y1="17.5" x2="20.66" y2="17.5" />
      <rect
        className={mapStateToSvg[phasesPip[2]].rectStyle}
        x="20.5"
        y="12.5"
        width="10"
        height="10"
        rx="1.71"
        ry="1.71"
      />
      <line className={mapStateToSvg[phasesPip[3]].rectStyle} x1="30.62" y1="17.5" x2="40.15" y2="17.5" />
      <rect
        className={mapStateToSvg[phasesPip[3]].rectStyle}
        x="40.5"
        y="12.5"
        width="10"
        height="10"
        rx="1.71"
        ry="1.71"
      />
      <line className={mapStateToSvg[phasesPip[4]].rectStyle} x1="60.48" y1="17.5" x2="50.43" y2="17.5" />
      <rect
        className={mapStateToSvg[phasesPip[4]].rectStyle}
        x="60.5"
        y="12.5"
        width="10"
        height="10"
        rx="1.71"
        ry="1.71"
      />

      <g className={mapStateToSvg[phasesPip[0]].alert ? '' : styles.noDisplay} style={{ translate: '-40px 0px' }}>
        {alert}
      </g>
      <g className={mapStateToSvg[phasesPip[1]].alert ? '' : styles.noDisplay} style={{ translate: '-20px -12px' }}>
        {alert}
      </g>
      <g className={mapStateToSvg[phasesPip[2]].alert ? '' : styles.noDisplay} style={{ translate: '-20px 0px' }}>
        {alert}
      </g>
      <g className={mapStateToSvg[phasesPip[3]].alert ? '' : styles.noDisplay} style={{ translate: '0px 0px' }}>
        {alert}
      </g>
      <g className={mapStateToSvg[phasesPip[4]].alert ? '' : styles.noDisplay} style={{ translate: '20px 0px' }}>
        {alert}
      </g>
    </svg>
  );
}

export default PipelineIcon;
