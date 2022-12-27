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
            transform: 'translate(0, -100%)',
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
            transform: 'translate(calc(100% + 12px), -8px) rotate(90deg)',
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
            transform: 'translate(0, calc(100% + 3px))',
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
            transform: 'translate(-10px, -8px) rotate(90deg)',
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
