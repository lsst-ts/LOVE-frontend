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
    markType: PropTypes.oneOf(['line', 'pointLine', 'bar', 'area', 'arrow']),
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
    if (markType !== 'line' && markType !== 'pointLine' ) {
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
      data: { values: [{ a: -2, b: 4 },{ a: 1, b: 6 },{ a: 4, b: 3}] },
      mark: {
        type: 'bar',
        color: this.props.color,
        /* clip: true, */
      },
      encoding: {
        x: {
          field: 'a',
          type: 'quantitative',
          scale: { domain: [0, 6] },
          axis: { title: null },
        },
        y: {
          field: 'b',
          type: 'quantitative',
          axis: { title: null },
        },
        opacity: {
          value: 0.9
        }
      },
      config: {
        background: null,
        axis: false,
        bar: {
          continuousBandSize: 5,
        },
      },
    };
  };

  areaSpec = (markType) => {
    if (markType !== 'area' ) {
      return {};
    }
    return {
      data: {
        values: [{ a: -10, b: 19, c: 11}, { a: 0,  b: 34, c: 8 }, { a: 10, b: 27, c: 18 }, {a: 25, b: 29, c: 12}],
      },
      mark: {
        type: 'area',
        color: this.props.color,
      },
      encoding: {
        x: {
          field: 'a',
          type: 'quantitative',
          scale: {
            domain: [0, 25],
          },
          axis: {
            title: null,
          },
        },
        y: {
          field: 'b',
          aggregate: 'max',
          axis: { title: null },
        },
        y2: {
          field: 'c',
          aggregate: 'min',
          axis: { title: null },
        },
        opacity: {
          value: 0.8
        }
      },
      config: {
        background: null,
        axis: false,
      },
    };
  };

  arrowSpec = (markType) => {
    if (markType !== 'arrow' ) {
      return {};
    }
    return {
      data: {
        values: [
          {x: -2, y: 0.5, angle: 0}, {x: 0, y: 2, angle: -45}, {x: 2, y: 1, angle: -260}
        ]
      },
      layer: [
        {
          mark: {
            type: 'line',
            color: this.props.color,
          },
          encoding: {
            x: {
              field: 'x',
              type: 'quantitative',
              scale: {
                domain: [-2, 3],
              },
              axis: {
                title: null,
              },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: { title: null },
              scale: {
                domain: [0, 2.5],
              },
            },
            opacity: {
              value: 0.8
            }
          },
        },
        {
          mark: {
            type: 'text',
            dx: 0,
            fontSize: 13,
            color: '#d3e1eb',
          },
          encoding: {
            text: {
              value: '➟'
            },
            x: {
              field: 'x',
              type: 'quantitative',
              scale: {
                domain: [-2, 3],
              },
              axis: {
                title: null,
              },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: { title: null },
              scale: {
                domain: [0, 2.5],
              },
            },
            angle: {
              field: 'angle',
              type: 'nominal',
            }
          }
        },
      ],
      config: {
        background: null,
        axis: false,
      },
    }
  }

  render() {
    const lineSpec = this.lineSpec(this.props.markType);
    const barSpec = this.barSpec(this.props.markType);
    const areaSpec = this.areaSpec(this.props.markType);
    const arrowSpec = this.arrowSpec(this.props.markType);
    const spec = {
      schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 24,
      height: 23,
      padding: 0,
      view: {
        stroke: null,
      },
      ...lineSpec,
      ...barSpec,
      ...arrowSpec,
      ...areaSpec,
      
    };

    return <VegaLite renderer="svg" spec={spec} actions={false} />;
  }
}

export default VegaLegendMiniPlot;
