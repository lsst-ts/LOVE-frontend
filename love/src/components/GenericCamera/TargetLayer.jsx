import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './TargetLayer.module.css';
import { xy_sample } from './CameraUtils';

export default class TargetLayer extends PureComponent {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  render() {
    const { width, height, data } = this.props;
    return (
      <svg ref={this.svgRef} className={styles.svg} width={width} height={height} viewBox="0 0 500 500">
        {data?.map((data, i) => {
          const {xy, ...extraData} = data;
          return (
            <g key={i} onClick={() => this.props.onLayerClick(this.props.name, extraData, i)}>
              <circle className={styles.circle} cx={xy[0]} cy={xy[1]} r="10" />
              <text
                x={xy[0]}
                y={xy[1]}
                dy=".35em"
                className={styles.text}
              >
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
};

TargetLayer.defaultProps = {
  azelData: [],
  baseColor: 'white',
  onCellClick: () => {},
};
