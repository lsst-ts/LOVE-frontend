import React from 'react';
import { VegaLite } from 'react-vega';
import PropTypes from 'prop-types';

import { SHAPES, COLORS, DASHES } from './VegaTimeSeriesPlot';

class VegaLegendMiniPlot extends React.PureComponent {
  static defaultProps = {
    shape: SHAPES[0],
    filled: true,
    color: COLORS[0],
    dash: DASHES[0],
    /**
     * What kind of mark is it, can be "line" or "bar"
     */
    markType: 'line',
  };

  static propTypes = {
    markType: PropTypes.oneOf(['line', 'pointLine', 'bar']),
    /** (All layers) hex color */
    color: PropTypes.string,
    /** (Only `lines` layer). Dash pattern for segmented lines passed to the strokeDash channel. E.g, [2, 1] draws
     * a line with a pattern of 2 "filled" pixels and 1 "empty" pixel.
     */
    dash: PropTypes.arrayOf(PropTypes.number),
    /** (Only `pointLines` layer). Shape of the points to be drawn https://vega.github.io/vega-lite/docs/point.html*/
    shape: PropTypes.string,
    /** (Only `pointLines`) layer. Whether to draw a filled point or only its border. */
    filled: PropTypes.bool,
  };

  lineSpec = (markType) => {
    if (markType !== 'line' && markType !== 'pointLine') {
      return {};
    }
    return {
      data: {
        values: [{ a: -100 }, { a: 0 }, { a: 100 }],
      },
      mark: {
        type: 'line',
        point:
          markType === 'line'
            ? null
            : {
                style: 'triangle',
                filled: this.props.filled,
              },
        color: this.props.color,
        clip: true,
        strokeDash: this.props.dash,
      },
      encoding: {
        x: {
          field: 'a',
          type: 'quantitative',
          scale: {
            domain: [-5, 5],
          },
          axis: {
            title: null,
          },
        },
      },
      config: {
        background: null,
        axis: false,
        style: {
          triangle: {
            shape: this.props.shape,
            strokeWidth: 2,
            size: 80,
            color: this.props.color,
          },
        },
      },
    };
  };

  barSpec = (markType) => {
    if (markType !== 'bar') {
      return {};
    }
    return {
      data: { values: [{ a: 0, b: 0.5 }] },
      mark: {
        type: 'bar',
        color: this.props.color,
        clip: true,
      },
      encoding: {
        x: {
          field: 'a',
          type: 'quantitative',
          scale: { domain: [-0.5, 0.5] },
          axis: { title: null },
        },
        y: {
          field: 'b',
          type: 'quantitative',
          axis: { title: null },
        },
      },
      config: {
        background: null,
        axis: false,
        bar: {
          continuousBandSize: 15,
        },
      },
    };
  };
  render() {
    const lineSpec = this.lineSpec(this.props.markType);
    const barSpec = this.barSpec(this.props.markType);
    const spec = {
      schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      width: 32,
      height: 24,
      padding: 0,
      view: {
        stroke: null,
      },
      ...lineSpec,
      ...barSpec,
    };

    return <VegaLite renderer="svg" spec={spec} actions={false} />;
  }
}

export default VegaLegendMiniPlot;
