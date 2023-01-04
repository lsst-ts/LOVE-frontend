import React, { Component } from 'react';
import { VegaLite } from 'react-vega';
import styles from './VegaTimeSeriesPlot.module.css';
import PropTypes from 'prop-types';


export const SHAPES = [
  'circle',
  'square',
  'diamond',
  'triangle-up',
  'triangle-down',
  'triangle-right',
  'triangle-left',
  'cross',
];

export const COLORS = [
  '#ff7bb5', // pink
  '#97e54f', // green
  '#00b7ff', // light blue
  '#f9b200', // orange-ish
  '#a9a5ff', // purple-ish
];

export const DASHES = [
  [4, 0], // continous line
  [4, 1],
  [4, 2],
  [2, 1],
  [2, 2],
  [8, 4],
  [8, 2],
  [8, 1],
];

/**
 * Generates plots using different marks (lines, points, bars, etc) on different layers
 * on a canvas that is auto-sized to match its parent node size.
 */
class VegaTimeseriesPlot extends Component {
  static propTypes = {
    /** Width of the plot in pixels */
    width: PropTypes.number,

    /** Height of the plot in pixels */
    height: PropTypes.number,

    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     *  Will be ignored if both props.width and props.height are provided */
    containerNode: PropTypes.node,

    /** Object with data separated on different keys to be plotted in different layers.
     * Passed directly as <VegaLite data={layers} ...>
     */
    layers: PropTypes.shape({
      /** List of {name, x, y} with points of lines to be plotted as lines
       *  - name distinguishes a mark from another
       *  - x,y are the plot-axis coordinates of a point in that line
       */
      lines: PropTypes.arrayOf(PropTypes.object),
      /**
       * ------ PENDING see example-------
       * List of {name, x, y} with points of lines to be plotted as lines with points
       *  - name distinguishes a mark from another
       *  - x,y are the plot-axis coordinates of a point in that line
       */
      pointLines: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y}` of bars to be plotted.
       *  - name distinguishes a mark from another
       *  - x,y are the plot-axis coordinates of a point in that line
       */
      bars: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y, angle}` of line plot with arrow direction to be plotted.
       *  - name distinguishes a mark from another
       *  - x,y are the plot-axis coordinates of a point in that line
       */
      arrows: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y, y2}` of area plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x,y,y2 are the plot-axis coordinates of a point in that area
       */
      areas: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y, y2}` of area plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x,y,y2 are the plot-axis coordinates of a point in that area
       */
      spreads: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, lowclouds, midclouds, hiclouds}` of area plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x,y1,y2, y3 are the plot-axis coordinates of a point in that area
       */
      clouds: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, x2 or deltatime, y, y2}` of rect plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x,x2 or deltatime,y,y2 are the plot-axis coordinates of a point in rect
       */
      rects: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, mean, delta}` of bar plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x,mean,delta are the plot-axis coordinates of a point in bar
       */
      bigotes: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,

    /**
     * Defines the styles of each mark to be plotted.
     */
    marksStyles: PropTypes.arrayOf(
      PropTypes.shape({
        /** (All layers) `name` attribute of the data to apply these styles.
         * Rows of data with no name-matching markStyle will not be rendered.
         */
        name: PropTypes.string.isRequired,
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
      }),
    ).isRequired,

    /** Title of the x axis */
    xAxisTitle: PropTypes.string,

    /** Title of the y axis */
    yAxisTitle: PropTypes.string,

    /** If true, x axis labels will be rendered as timestamps */
    temporalXAxis: PropTypes.bool,

    /** Dictionary with units of measurements.
     * Will be rendered in the title as [<unit>]
     */
    units: PropTypes.shape({
      /** For the x axis */
      x: PropTypes.string,
      /** For the y axis */
      y: PropTypes.string,
    }),

    /** classname to be appended to the default one in <VegaLite ...> */
    className: PropTypes.string,
  };

  static defaultProps = {
    layers: {},
    temporalXAxis: true,
    className: '',
    xAxisTitle: 'time',
    yAxisTitle: 'y axis title',
  };

  constructor(props) {
    super(props);
    this.resizeObserver = undefined;
    this.state = {
      containerWidth: props.width ?? 400,
      containerHeight: props.height ?? 240,
      spec: {
        width:
          props.width !== undefined && props.height !== undefined
            ? props.width
            : 500,
        height:
          this.props.width !== undefined && this.props.height !== undefined
            ? props.height
            : 240,
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        config: {
          background: null,
          title: { color: '#ddd' },
          style: {
            'guide-label': {
              fill: '#ddd',
            },
            'guide-title': {
              fill: '#ddd',
            },
          },
          axis: {
            domainColor: '#626262',
            gridColor: '#424242',
            tickColor: null,
            domain: true,
            /* domainColor: '#000',
            tickColor: '#000' */
          },
          axisX: {
            titlePadding: 16,
            titleFontWeight: 750,
            // labelAngle: -45,
            labelFontWeight: 750,
            tickCount: 5,
          },
          view: {
            strokeWidth: 1,
            step: 23
          }
        },
        layer: [
        ]
      },
    };
  }

  makeAxisTitle = (title, units) => {
    return `${title.toUpperCase()} ${units ? `[${units}]` : ''}`;
  };

  makeStyleEncoding = () => {
    const marksStyles = this.props.marksStyles.filter((l) => l.name !== '' && !l.labelOnly);
    const names = marksStyles.map((style) => style.name);

    return {
      fill: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: marksStyles.map((style) => {
            if (style.filled !== undefined && !style.filled) {
              return 'none';
            }
            return style.color ?? COLORS[0];
          }),
        },
        legend: null,
      },
      shape: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: marksStyles.map((style) => style.shape ?? SHAPES[0]),
        },
        legend: null,
      },
      color: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: marksStyles.map((style) => style.color ?? COLORS[0]),
        },
        legend: null,
      },
      stroke: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: marksStyles.map((style) => style.color ?? COLORS[0]),
        },
        legend: null,
      },
      strokeDash: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: marksStyles.map((style) => style.dash ?? DASHES[0]),
        },
        legend: null,
      },
    };
  };

  makeLineLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
      mark: {
        type: 'line',
        clip: true,
      },
      encoding: {
        x: {
          field: 'x',
          type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
          axis: {
            title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
            format: '%H:%M:%S',
          },
          scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
        },
        y: {
          field: 'y',
          type: 'quantitative',
          axis: {
            title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
          },
        },
        color: styleEncoding.color,
        strokeDash: styleEncoding.strokeDash,
      },
    };
  };

  makePointsLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
      mark: {
        type: 'point',
        size: 80,
        clip: true,
      },
      encoding: {
        x: {
          field: 'x',
          type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
        },
        y: {
          field: 'y',
          type: 'quantitative',
          // scale: {
          //   type: 'linear',
          //   zero: false,
          // },
        },
        stroke: styleEncoding.stroke,
        fill: styleEncoding.fill,
        shape: styleEncoding.shape,
      },
    };
  };

  makeBarLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName },
      mark: {
        type: 'bar',
        size: 20
      },
      encoding: {
        x: {
          field: 'x',
          type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
        },
        y: {
          field: 'y',
          type: 'quantitative',
        },
        color: styleEncoding.color,
      },
    };
  };

  makeArrowLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName },
      /* transform: [
        {
          calculate: '90',
          as: 'angle'
        },
      ], */
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: {
            type: 'text',
            dx: 0,
            dy: 0,
            fontSize: 24,
            color: "#d3e1eb"
          },
          encoding: {
            text: {
              value: '➟'
            },
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            angle: {
              field: 'angle',
              type: 'quantitative',
              scale: {domain: [360, 0]}
            }
          },
        }
      ]
    };
  };

  makeAreaLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName },
      /* transform: [
        {
          calculate: '(datum.y2 - datum.y)',
          as: 'y2'
        },
      ], */
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y2',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: {
            type: 'area',
            clip: true
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              aggregate: 'max',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
              scale: {
                domainMax: 100,
                domainMin: 0
              }
            },
            y2: {
              field: 'y2',
              aggregate: 'min',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            color: styleEncoding.color,
            opacity: {
              value: 0.6
            }
          }
        }
      ]
    };
  };

  makeSpreadLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName },
      transform: [
        {
          calculate: '(datum.mean + datum.delta)',
          as: 'y2'
        },
        {
          calculate: '(datum.mean - datum.delta)',
          as: 'y'
        },
        {
          calculate: '(datum.mean)',
          as: 'mean'
        },
      ],
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'mean',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: {
            type: 'area',
            clip: true
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              aggregate: 'min',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
              scale: {
                domainMax: 100,
                domainMin: 0
              }
            },
            y2: {
              field: 'y2',
              aggregate: 'max',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            color: styleEncoding.color,
            opacity: {
              value: 0.6
            }
          }
        }
      ]
    };
  };

  makeBigoteLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName },
       transform: [
        {
          calculate: '(datum.mean + datum.delta)',
          as: 'plus'
        },
        {
          calculate: '(datum.mean - datum.delta)',
          as: 'minus'
        },
        {
          calculate: '(datum.mean + datum.delta) - 2 > 0 ? (datum.mean + datum.delta) - 1 : 0',
          as: 'plus_limit'
        },
        {
          calculate: '(datum.mean - datum.delta) > 0 ? (datum.mean - datum.delta) + 1 : 0',
          as: 'minus_limit'
        }
      ],
      layer: [
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 2
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'plus',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            y2: {
              field: 'minus',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            color: styleEncoding.color
          }
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 20
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'plus',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            y2: {
              field: 'plus_limit',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            color: styleEncoding.color
          }
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 20
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'minus_limit',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              },
            },
            y2: {
              field: 'minus',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            color: styleEncoding.color
          }
        }
      ]
    };
  };

  makeRectLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    return {
      data: { name: dataName },
      transform: [
        {
          calculate: 'datum.x2 ? datum.x2 : ( datum.deltatime ? (datum.x + datum.deltatime) : (datum.x + 1800))',
          as: 'x2'
        },
      ],
      layer: [
        {
          mark: {
            type: 'rect',
            clip: true,
            strokeWidth: 3
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
             x2: {
              field: 'x2',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            y2: {
              field: 'y2',
              type: 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y),
              }
            },
            fill: styleEncoding.color,
            fillOpacity: {
              value: 0.5
            },
            stroke: styleEncoding.color,
          }
        }
      ]
    };
  };

  makeCloudLayer = (dataName) => {
    const markType = dataName.slice(0, -1);
    const markStyle = this.props.marksStyles.filter((l) => l.markType === markType);
    const color = markStyle[0].color.slice(0,7);
    
    return {
      data: { name: dataName },
      transform: [
        {
          fold: ['lowclouds', 'midclouds', 'hiclouds'], as: ['category', 'value']
        }
      ],
      layer: [
        {
          mark: {
            type: 'bar',
            clip: true,
            size: this.props.height ? (this.props.height - 58) / 3 : (240 - 58) / 3
          },
          encoding: {
            x: {
              field: 'x',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x),
                format: '%H:%M:%S',
              },
            },
            y: {
              type: 'ordinal',
              field: 'category',
              axis: {
                title: null,
              },
              sort: [
                'hiclouds', 'midclouds', 'lowclouds'
              ],
            },
            color: {
              field: 'value',
              type: 'quantitative',
              scale: {
                range: [color + '00', color + 'ff']
              },
              title: this.makeAxisTitle('Clouds', this.props.units?.y)
            }
          }
        }
      ]
    };
  };

  updateSpec = () => {
    console.log('VegaTimeSeriesPlot.updateSpec()');
    const layer = [];
    if (this.props.layers.clouds) layer.push(this.makeCloudLayer('clouds'));
    if (this.props.layers.areas) layer.push(this.makeAreaLayer('areas'));
    if (this.props.layers.spreads) layer.push(this.makeSpreadLayer('spreads'));
    if (this.props.layers.rects) layer.push(this.makeRectLayer('rects'));
    if (this.props.layers.bars) layer.push(this.makeBarLayer('bars'));
    if (this.props.layers.bigotes) layer.push(this.makeBigoteLayer('bigotes'));
    if (this.props.layers.pointLines) layer.push(this.makeLineLayer('pointLines'));
    if (this.props.layers.pointLines) layer.push(this.makePointsLayer('pointLines'));
    layer.push(this.makeLineLayer('lines'));
    if (this.props.layers.arrows) layer.push(this.makeArrowLayer('arrows'));

    /* const layer = [
      this.makeAreaLayer('areas'),
      this.makeSpreadLayer('spreads'),
      this.makeRectLayer('rects'),
      this.makeBarLayer('bars'),
      this.makeBigoteLayer('bigotes'),
      this.makeLineLayer('pointLines'),
      this.makePointsLayer('pointLines'),
      this.makeLineLayer('lines'),
      this.makeArrowLayer('arrows')
    ];
    if (this.props.layers.clouds) layer.push(this.makeCloudLayer('clouds')); */

    this.setState({
      spec: {
        width:
          this.props.width !== undefined && this.props.width !== null
            ? this.props.width
            : this.state.containerWidth,
        height:
          this.props.height !== undefined && this.props.height !== null
            ? this.props.height
            : this.state.containerHeight,
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        config: {
          background: null,
          title: { color: '#ddd' },
          style: {
            'guide-label': {
              fill: '#ddd',
            },
            'guide-title': {
              fill: '#ddd',
            },
          },
          axis: {
            domainColor: '#626262',
            gridColor: '#424242',
            tickColor: null,
          },
          axisX: {
            titlePadding: 16,
            titleFontWeight: 750,
            labelFontWeight: 750,
            tickCount: 5,
          },
        },
        layer: layer,
      },
    });
  };

  componentDidMount = () => {
    if (
      this.props.width === undefined && // width/height have more priority
      this.props.height === undefined
    ) {
      if (this.props.containerNode) {
        this.resizeObserver = new ResizeObserver((entries) => {
          const container = entries[0];

          console.log('componentDidUpdate() container.contentRect.height', container.contentRect.height )
          this.setState({
            containerHeight: container.contentRect.height,
            containerWidth: container.contentRect.width,
          });
        });
        this.resizeObserver.observe(this.props.containerNode);
      }
    }
    this.updateSpec();
  };

  shouldComponentUpdate = (prevProps, prevState) => {
    if (prevProps.containerNode !== this.props.containerNode) {
      return true;
    }
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      return true;
    }

    if (this.props.units?.x !== prevProps.units?.x || this.props.units?.y !== prevProps.units?.y) {
      return true;
    }
    return prevState !== this.state || JSON.stringify(this.props.layers) !== JSON.stringify(prevProps.layers);
  };

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.containerNode !== this.props.containerNode &&
      this.props.width === undefined && // width/height have more priority
      this.props.height === undefined
    ) {
      if (this.props.containerNode) {
        this.resizeObserver = new ResizeObserver((entries) => {
          const container = entries[0];
          
          console.log('componentDidUpdate() container.contentRect.height', container.contentRect.height );
          this.setState({
            containerHeight: container.contentRect.height,
            containerWidth: container.contentRect.width,
          });
        });
        this.resizeObserver.observe(this.props.containerNode);
      }
    }

    if (
      this.props.width !== undefined &&
      this.props.height !== undefined &&
      (this.props.width !== prevProps.width || this.props.height !== prevProps.height)
    ) {
      this.updateSpec();
    }

    if (this.props.units?.x !== prevProps.units?.x || this.props.units?.y !== prevProps.units?.y) {
      this.updateSpec();
    }
  };

  componentWillUnmount = () => {
    // this.props.unsubscribeToStreams();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  };

  render() {
    const { layers } = this.props;

    console.log('layers', layers);
    console.log('spec', this.state.spec);
    return (
      <VegaLite
        style={{
          display: 'flex'
        }}
        renderer="svg"
        spec={this.state.spec}
        data={layers}
        className={[styles.plotContainer, this.props.className].join(' ')}
        actions={false}
      />
    );
  }
}

export default VegaTimeseriesPlot;
