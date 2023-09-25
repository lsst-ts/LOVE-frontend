/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './TargetLayer.module.css';
// import { xy_sample } from './CameraUtils';

export default class TargetLayer extends PureComponent {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  render() {
    const { width, height, data, selectedCell, name } = this.props;
    return (
      <svg ref={this.svgRef} className={styles.svg} width={width} height={height} viewBox="0 0 500 500">
        {data?.map((data, i) => {
          const { xy, ...extraData } = data;
          return (
            <g key={i} onClick={() => this.props.onLayerClick(name, extraData, i)}>
              <circle
                className={[
                  styles.circle,
                  selectedCell.layerName === name && i === selectedCell.index ? styles.selected : '',
                ].join(' ')}
                cx={xy[0]}
                cy={xy[1]}
                r="10"
              />
              <text x={xy[0]} y={xy[1]} dy=".35em" className={styles.text}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
}

TargetLayer.propTypes = {
  /** Target data array, containing objects with the following keys:
   * xy: Az and El coordinates
   */
  data: PropTypes.array,
  /** Layer width */
  width: PropTypes.number,
  /** Layer height */
  height: PropTypes.number,
  /** Object containing the selected cell information, with the following schema: 
   * {
        layerName,
        value,
        index,
      } 
    */
  selectedCell: PropTypes.object,
};

TargetLayer.defaultProps = {
  data: [],
  onCellClick: () => {},
  width: 500,
  height: 500,
  selectedCell: {},
};
