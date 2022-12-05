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
    markType: PropTypes.oneOf(['line', 'pointLine', 'bar', 'area', 'arrow', 'spread', 'bigote', 'rect']),
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
        values: [{ a: -10, b: 2, c: 8, d: 5 }, { a: 0, b: 2, c: 8, d: 5 }, { a: 10, b: 2, c: 8, d: 5 }],
      },
      layer: [
        {
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
            y: {
              field: 'd',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
              axis: {
                title: null,
              },
            },
          },
        }
      ],
      config: {
        background: null,
        axis: {
          orient: "right"
        },
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
      data: { values: [{ a: 1, b: 4 },{ a: 3, b: 6 },{ a: 5, b: 3}] },
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
        axis: {
          orient: "right"
        },
        bar: {
          continuousBandSize: 5,
        },
      },
    };
  };

  areaSpec = (markType) => {
    if (markType !== 'area') {
      return {};
    }
    return {
      data: {
        values: [{ a: -10, b: 2, c: 7}, { a: 0, b: 2, c: 7 }, { a: 10, b: 2, c: 7 }],
      },
      layer: [
        {
          mark: {
            type: 'line',
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
            y: {
              field: 'b',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
              axis: {
                title: null,
              },
            },
          },
        },
        {
          mark: {
            type: 'line',
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
            y: {
              field: 'c',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
              axis: {
                title: null,
              },
            },
          },
        },
        {
          mark: {
            type: 'area',
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
            y: {
              field: 'b',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
            },
            y2: {
              field: 'c',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
            },
            opacity: {
              value: 0.5
            }
          },
        }
      ],
      config: {
        background: null,
        axis: {
          orient: "right"
        },
      },
    };
  };

  spreadSpec = (markType) => {
    if (markType !== 'spread') {
      return {};
    }
    return {
      data: {
        values: [{ a: -10, b: 2, c: 8, d: 5 }, { a: 0, b: 2, c: 8, d: 5 }, { a: 10, b: 2, c: 8, d: 5 }],
      },
      layer: [
        {
          mark: {
            type: 'line',
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
            y: {
              field: 'd',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
              axis: {
                title: null,
              },
            },
          },
        },
        {
          mark: {
            type: 'area',
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
            y: {
              field: 'b',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
            },
            y2: {
              field: 'c',
              type: 'quantitative',
              scale: {
                domain: [0, 9],
              },
            },
            opacity: {
              value: 0.5
            }
          },
        }
      ],
      config: {
        background: null,
        axis: {
          orient: "right"
        },
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
          {x: -1, y: 0.5, angle: 165}, {x: 0.5, y: 2, angle: 105}, {x: 2, y: 1, angle: 25}
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
              type: 'quantitative',
              scale: {domain: [360, 0]}
            }
          }
        },
      ],
      config: {
        background: null,
        axis: {
          orient: "right"
        },
      },
    }
  }

  bigoteSpec = (markType) => {
    if (markType !== 'bigote') {
      return {};
    }
    return {
      data: { values: [
        { x: 1, x2: 1.2, y: 0.5, y2: 3, lux: 0.5, lux2: 1.7, luy: 3, luy2: 3.1, ldy: 0.4 },
        { x: 2.5, x2: 2.7, y: 1.5, y2: 4, lux: 2, lux2: 3.2, luy: 4, luy2: 4.1, ldy: 1.4  }, 
        { x: 4, x2: 4.2, y: 0.64, y2: 2.5, lux: 3.5, lux2: 4.7, luy: 2.5, luy2: 2.6, ldy: 0.74 }, 
      ] },
      layer: [
        {
          mark: {
            type: 'bar',
            color: this.props.color,
            /* clip: true, */
          },
          encoding: {
            x: {
              field: 'x',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            x2: {
              field: 'x2',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            y2: {
              field: 'y2',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            opacity: {
              value: 0.9
            }
          },
        },
        {
          mark: {
            type: 'bar',
            color: this.props.color,
            /* clip: true, */
          },
          encoding: {
            x: {
              field: 'lux',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            x2: {
              field: 'lux2',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            y: {
              field: 'luy',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            y2: {
              field: 'luy2',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            opacity: {
              value: 0.9
            }
          },
        },
        {
          mark: {
            type: 'bar',
            color: this.props.color,
            /* clip: true, */
          },
          encoding: {
            x: {
              field: 'lux',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            x2: {
              field: 'lux2',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            y2: {
              field: 'ldy',
              type: 'quantitative',
              scale: { domain: [0, 5] },
              axis: { title: null },
            },
            opacity: {
              value: 0.9
            }
          },
        }
      ],
      
      config: {
        background: null,
        axis: {
          orient: "right"
        },
        bar: {
          continuousBandSize: 5,
        },
      },
    };
  };

  rectSpec = (markType) => {
    if (markType !== 'rect') {
      return {};
    }
    return {
      data: { values: [{ a: 0.5, b: 3, c: 0, d: 2 },{ a: 2.5, b: 4, c: 0, d: 4 },{ a: 4.5, b: 3, c: 0, d: 6}] },
      mark: {
        type: 'rect',
        strokeWidth: 1,
        stroke: this.props.color,
        fill: this.props.color,
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
        x2: {
          field: 'd',
          type: 'quantitative',
          scale: { domain: [0, 6] },
          axis: { title: null },
        },
        y2: {
          field: 'c',
          type: 'quantitative',
          axis: { title: null },
        },
        fillOpacity: {
          value: 0.5
        },
      },
      config: {
        background: null,
        axis: {
          orient: "right"
        },
        /* bar: {
          continuousBandSize: 5,
        }, */
      },
    };
  };

  render() {
    const lineSpec = this.lineSpec(this.props.markType);
    const barSpec = this.barSpec(this.props.markType);
    const areaSpec = this.areaSpec(this.props.markType);
    const arrowSpec = this.arrowSpec(this.props.markType);
    const spreadSpec = this.spreadSpec(this.props.markType);
    const bigoteSpec = this.bigoteSpec(this.props.markType);
    const rectSpec = this.rectSpec(this.props.markType);
    const spec = {
      schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 30,
      height: 31,
      view: {
        stroke: null,
      },
      ...lineSpec,
      ...barSpec,
      ...arrowSpec,
      ...areaSpec,
      ...spreadSpec,
      ...bigoteSpec,
      ...rectSpec,
    };

    return <VegaLite
        style={{
          display: 'flex'
        }}
        padding={{
          right: '10px',
          left: '0px'
        }}
        renderer="svg"
        spec={spec}
        actions={false}
      />;
  }
}

export default VegaLegendMiniPlot;
