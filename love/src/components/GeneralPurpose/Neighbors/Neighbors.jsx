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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Neighbors.module.css';

class Neighbors extends Component {
  static defaultProps = {
    edgesColors: { top: 'transparent', right: 'transparent', bottom: 'transparent', left: 'transparent' },
    selectNeighbor: () => false,
  };

  render() {
    const { children, edgesColors, selectNeighbor } = this.props;
    return (
      <div className={styles.container}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: edgesColors.top,
            transform: 'translate(0, -20%)',
            cursor: 'pointer',
          }}
          onClick={() => selectNeighbor('top')}
        >
          <div className={styles.arrowUp}></div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: edgesColors.right,
            transformOrigin: 'left',
            transform: 'translate(calc(97% + 12px), -8px) rotate(90deg)',
            cursor: 'pointer',
          }}
          onClick={() => selectNeighbor('right')}
        >
          <div className={styles.arrowRight}></div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: edgesColors.bottom,
            transform: 'translate(0, calc(60% + 3px))',
            cursor: 'pointer',
          }}
          onClick={() => selectNeighbor('bottom')}
        >
          <div className={styles.arrowBottom}></div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: edgesColors.left,
            transformOrigin: 'left',
            transform: 'translate(-5px, -8px) rotate(90deg)',
            cursor: 'pointer',
          }}
          onClick={() => selectNeighbor('left')}
        >
          <div className={styles.arrowLeft}></div>
        </div>
        {children}
      </div>
    );
  }
}

Neighbors.propTypes = {
  /** Inner content that goes inside neighbors borders */
  children: PropTypes.node,
  /** Background color of each edge
   * Parameters include: top, right, left, bottom
   */
  edgesColors: PropTypes.object,
  /** Callback to be used when an edge is clicked
   * It is executed with 1 argument: 'top', 'right', 'left', 'bottom' depending on which edge was clicked
   */
  selectNeighbor: PropTypes.func,
};

export default Neighbors;
