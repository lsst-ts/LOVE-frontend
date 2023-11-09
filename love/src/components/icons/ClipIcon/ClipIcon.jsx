/** 
This file is part of LOVE-frontend.

Developed for the LSST Telescope and Site Systems.
This product includes software developed by the LSST Project
(https://www.lsst.org).
See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

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
import PropTypes from 'prop-types';

const ClipIcon = ({ className }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 949.801 949.801">
      <g>
        <path
          d="M474.9,80c38.2,0,74.2,14.9,101.3,42c27.101,27.1,42.2,63.2,42.3,101.6l0.101,354.701c0,22,17.899,39.898,39.899,39.898
          h0.7c22,0,39.9-18,39.9-39.898l-0.3-354.701c0-30.2-5.9-59.5-17.601-87c-11.3-26.6-27.399-50.5-47.899-71.1
          c-20.5-20.5-44.4-36.6-71-47.9C534.801,5.9,505.5,0,475.4,0h-0.6c-30.301,0-59.601,5.9-87.2,17.6c-26.7,11.3-50.601,27.5-71.2,48
          c-20.5,20.6-36.7,44.5-48,71.1c-11.7,27.6-17.6,56.8-17.7,87l0.5,549.3c-0.1,47.4,18.2,92.1,51.8,125.699
          c32.9,33,75.801,51.102,120.9,51.102c45.2,0,88.2-18.201,121.2-51.102c33.6-33.699,52.1-78.398,52.1-126V452.2
          c0-35.8-11.899-67.8-33.399-92c-48.601-54.8-128-49.7-174.5-3.2c-24.9,24.9-36.601,60.1-36.601,95.4l0.3,130.1
          c0,22,17.9,39.9,39.9,39.9h0.8c22,0,39.9-17.9,39.9-39.9v-1.1c0-10.801-0.101-128.201-0.101-129.1c0-62.3,83-63.3,83,0
          l0.101,320.399v4.801c0,22-9.5,44.699-26,62.1C474.101,857.1,451.8,867.9,429.5,869.4c-1.8,0.1-3.5,0.199-5.3,0.199
          c-23.2,0-45.7-10.1-63.4-28.4c-17.1-17.799-27.5-41.299-28.3-64.5v-4.398L331.601,223.4v-4.1C332.7,182,348,147,374.9,120.7
          C401.9,94.7,437.4,80.1,474.9,80z"
        />
      </g>
    </svg>
  );
};

ClipIcon.propTypes = {
  /** Custom classname */
  className: PropTypes.string,
};

export default ClipIcon;
