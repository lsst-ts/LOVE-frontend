import React, { Component } from 'react';
import { VegaLite } from 'react-vega';
import styles from './VegaTimeSeriesPlot.module.css';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { field } from 'vega';


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
       * List of `{name, x, low, mid, hi}` of area plot to be plotted.
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
       * List of `{name, x, base, delta}` of bar plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x,base,delta are the plot-axis coordinates of a point in bar
       */
      bigotes: PropTypes.arrayOf(PropTypes.object),
      heatmaps: PropTypes.arrayOf(PropTypes.object),
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

    temporalXAxisFormat: PropTypes.string,

    /** classname to be appended to the default one in <VegaLite ...> */
    className: PropTypes.string,
    scaleIndependent: PropTypes.bool,
    scaleDomain: PropTypes.shape({
      domainMax: PropTypes.number,
      domainMin: PropTypes.number,
    }),
  };

  static defaultProps = {
    layers: {},
    temporalXAxis: true,
    className: '',
    xAxisTitle: 'time',
    yAxisTitle: 'y axis title',
    temporalXAxisFormat: '%H:%M:%S',
    scaleIndependent: false,
    scaleDomain: {},
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
          axisY: {minExtent: 30},
          view: {
            strokeWidth: 1,
            step: 23
          }
        },
        encoding: {
          x: {
            field: 'x',
            type: props.temporalXAxis ? 'temporal' : 'quantitative',
            timeUnit: props.temporalXAxisFormat,
            axis: {
              title: this.makeAxisTitle(props.xAxisTitle, undefined),
              format: props.temporalXAxisFormat,
            },
            scale: props.xDomain ? { domain: props.xDomain } : { type: 'utc' },
          },
        },
        layer: [
        ]
      },
    };
  }

  makeAxisTitle = (title, units) => {
    return `${title} ${units ? `[${units}]` : ''}`;
    // return `${title.toUpperCase()} ${units ? `[${units}]` : ''}`;
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
        legend: names,
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
    const markType = dataName.slice(0, -1);
    const markStyle = this.props.marksStyles.filter((l) => l.markType === markType);

    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.y ? ' [' + u.units?.y + ']' : ''));

    const paramColor = {};
    colors.forEach((c) => {
      paramColor[c.name] = c.color;
    });
    const paramUnit = {};
    units.forEach((u) => {
      paramUnit[u.name] = u.units;
    });

    return {
      data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY'
        },
        // {
        //   calculate: 'datum.colors[datum.name]',
        //   as: 'color'
        // }
      ],
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: namesUnits,
                orient: 'right',
                titleColor: colors.map((c) => c.color)[0],
              },
              scale: this.props.scaleDomain,
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: 'rule',
          params: [{
            name: 'hover',
            select: {type: 'point', on: 'mouseover'}
          }],
          encoding: {
            color: {
              condition: {
                param: 'hover',
                empty: false,
                value: 'white',
              },
              value: "transparent",
            },
            size: {value: 4},
            tooltip: [
              {
                field: 'labelY', title: 'name'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', labelExpr: 'datum.labelY', format: ".2f",
              }
            ]
          }
        }
      ]
    };
  };

  makePointsLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    const markType = dataName.slice(0, -1);
    const arr = Object.values(this.props.layers[dataName] ?? {});

    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.y ? ' [' + u.units?.y + ']' : ''));

    return {
      data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'point',
            size: 80,
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              title: namesUnits,
              axis: {
                orient: 'left',
              },
              scale: this.props.scaleDomain,
            },
            stroke: styleEncoding.stroke,
            fill: styleEncoding.fill,
            shape: styleEncoding.shape,
          },
        },
        {
          mark: {
          type: 'line',
          clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              title: namesUnits,
              axis: {
                titleColor: colors[0]?.color,
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: 'rule',
          params: [{
            name: 'hover',
            select: {type: 'point', on: 'mouseover'}
          }],
          encoding: {
            color: {
              condition: {
                param: 'hover',
                empty: false,
                value: 'white',
              },
              value: "transparent",
            },
            size: {value: 4},
            tooltip: [
              {
                field: 'labelY', title: 'name'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: ".2f",
              },
            ]
          }
        }
      ]
    };
  };

  makeBarLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    const markType = dataName.slice(0, -1);
    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.y ? ' [' + u.units?.y + ']' : ''));

    return {
      data: { name: dataName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'bar',
            size: 25
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              title: namesUnits,
              axis: {
                orient: 'left',
                titleColor: colors[0]?.color,
              },
            },
            color: styleEncoding.color,
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: ".2f",
              },
            ]
          },
        }
      ],
    };
  };

  makeArrowLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    const markType = dataName.slice(0, -1);
    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.angle ? ' [' + u.units?.angle + ']' : ''));

    return {
      data: { name: dataName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.angle + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: namesUnits,
                titleColor: colors[0]?.color,
                orient: 'left',
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: ".2f",
              },
            ]
          },
        },
        {
          mark: {
            type: 'text',
            dx: 0,
            fontSize: 24,
            color: "#d3e1eb"
          },
          encoding: {
            text: {
              value: '➟'
            },
            y: {
              field: 'y',
              type: 'quantitative',
            },
            angle: {
              field: 'angle',
              type: 'quantitative',
              scale: {domain: [360, 0]}
            },
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: '.2f'
              },
              {
                field: 'angle', format: '.2f'
              },
            ]
          },
        },
      ]
    };
  };

  makeAreaLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    const markType = dataName.slice(0, -1);

    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.y ? ' [' + u.units?.y + ']' : ''));
    
    return {
      data: { name: dataName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                title: namesUnits,
                orient: 'left',
                titleColor: colors[0]?.color,
                offset: 45,
              },
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
            tooltip: [
              {
                title: 'name', field :'labelY',
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: '.2f',
              },
            ]
          },
        },
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y2',
              type: 'quantitative',
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
            tooltip: [
              {
                title: 'name', field: 'labelY',
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: '.2f',
              },
            ]
          },
        },
        {
          mark: {
            type: 'area',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              aggregate: 'max',
              type: 'quantitative',
              axis: {
                title: '',
              }
            },
            y2: {
              field: 'y2',
              aggregate: 'min',
              type: 'quantitative',
              axis: {
                title: '',
              },
            },
            color: styleEncoding.color,
            opacity: {
              value: 0.3
            },
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: '.2f',
              },
              {
                field: 'y2', format: '.2f',
              },
            ]
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
          calculate: '(datum.base + datum.delta)',
          as: 'y2'
        },
        {
          calculate: '(datum.base - datum.delta)',
          as: 'y'
        },
        {
          calculate: 'datum.name + " [" + datum.units.base + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'base',
              type: 'quantitative',
              axis: {
                title: '',
              },
              scale: this.props.scaleDomain,
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
            y: {
              field: 'y',
              aggregate: 'min',
              type: 'quantitative',
              axis: {
                title: '',
              }
            },
            y2: {
              field: 'y2',
              aggregate: 'max',
              type: 'quantitative',
              axis: {
                title: '',
              },
            },
            color: styleEncoding.color,
            opacity: {
              value: 0.4
            },
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'base', format: '.2f',
              },
              {
                field: 'delta', format: '.2f'
              },
            ]
          }
        }
      ]
    };
  };

  makeBigoteLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();

    const markType = dataName.slice(0, -1);

    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.y ? ' [' + u.units?.y + ']' : ''));

    const color = '#bcddf7';
    return {
      data: { name: dataName },
      transform: [
        {
          calculate: '(datum.base + datum.delta)',
          as: 'plus'
        },
        {
          calculate: '(datum.base !== 0 || datum.delta !== 0) && (datum.base - datum.delta) > 0 ? datum.base - datum.delta : 0',
          as: 'minus'
        },
        {
          calculate: '(datum.base !== 0 || datum.delta !== 0) && (datum.base + datum.delta) - (datum.plus) * 0.05 > 0 ? (datum.base + datum.delta) - (datum.plus) * 0.05 : 0',
          as: 'plus_limit'
        },
        {
          calculate: '(datum.base !== 0 || datum.delta !== 0) && (datum.base - datum.delta) + (datum.plus) * 0.05 > 0 ? (datum.base - datum.delta) + (datum.plus) * 0.05 : 0',
          as: 'minus_limit'
        },
        {
          calculate: 'datum.name + " [" + datum.units.base + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'bar',
            size: 25
          },
          encoding: {
            y: {
              field: 'base',
              type: 'quantitative',
              axis: {
                title: namesUnits,
                titleColor: colors[0]?.title,
              },
            },
            color: styleEncoding.color,
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'base', format: '.2f'
              },
            ]
          },
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 25,
            color: color,
            
          },
          encoding: {
            y: {
              field: 'plus_limit',
              type: 'quantitative',
              title: '',
            },
            y2: {
              aggregate: 'max',
              field: 'plus',
              type: 'quantitative',
              title: '',
            },
            tooltip: [
              {
                title: 'name', field: 'labelY'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'base', format: '.2f'
              },
              {
                field: 'delta', format: '.2f'
              },
            ]
          }
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 25,
            color: color,
            
          },
          encoding: {
            y: {
              field: 'minus_limit',
              type: 'quantitative',
              title: '',
            },
            y2: {
              field: 'minus',
              type: 'quantitative',
              title: '',
            },
            tooltip: [
              {
                title: 'name', field: 'labelY',
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'base', format: '.2f'
              },
              {
                field: 'delta', format: '.2f'
              },
            ]
          }
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 3,
            color: color,
            
          },
          encoding: {
            y: {
              aggregate: 'max',
              field: 'plus',
              type: 'quantitative',
              title: '',
            },
            y2: {
              field: 'minus',
              type: 'quantitative',
              title: '',
            },
            tooltip: [
              {
                title: 'name', field: 'labelY',
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'base', format: '.2f'
              },
              {
                field: 'delta', format: '.2f'
              },
            ]
          }
        }
      ],
    };
  }

  makeRectLayer = (dataName) => {
    const styleEncoding = this.makeStyleEncoding();
    const markType = dataName.slice(0, -1);

    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));
    const colors = names.map((name) => ({name, color: this.props.marksStyles.filter((l) => l.markType === markType && l.name === name)[0].color}));
    
    const namesUnits = units.map((u) => u.name + (u.units?.y ? ' [' + u.units?.y + ']' : ''));

    return {
      data: { name: dataName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY'
        }
      ],
      layer: [
        {
          mark: {
            type: 'rect',
            clip: true,
            strokeWidth: 3
          },
          encoding: {
             x2: {
              field: 'x2',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, ''),//this.props.units[dataName]?.x),
                format: this.props.temporalXAxisFormat,
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: {
                orient: 'right',
                titleColor: colors[0]?.color,
                title: namesUnits,
                offset: 45,
              },
              scale: {
                // domain: [-1, 10],
                // rangeMin: 0,
              }
            },
            y2: {
              field: 'y2',
              type: 'quantitative',
              scale: {
                // domain: [-1, 10],
                // rangeMin: 0,
              }
            },
            fill: styleEncoding.color,
            fillOpacity: {
              value: 0.5
            },
            stroke: styleEncoding.color,
            tooltip: [
              {
                name: 'name', field: 'labelY',
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'x2',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'y', format: '.2f'
              }
            ]
          }
        }
      ]
    };
  };

  makeHeatmapLayer = (dataName) => {
    const markType = dataName.slice(0, -1);
    const markStyle = this.props.marksStyles.filter((l) => l.markType === markType);
    const color = markStyle[0].color.slice(0,7);

    const arr = Object.values(this.props.layers[dataName] ?? {});
    const names = [...new Set(arr.map((layer) => layer.name))];
    const units = names.map((name) => ({name: name, units: arr.filter((l) => l.name === name)[0].units}));

    const namesUnits = units.map((u) => u.name + (u.units?.low ? ' [' + u.units?.low + ']' : ''));

    const scale = {
      type:  "quantize",
      domain: [0, 100],
      zero: true,
      scheme: [color + '00', color + '10', color + '88' , color + 'bb', color + 'ff'],
    };

    return {
      data: { name: dataName },
      transform: [
        {
          calculate: '0',
          as: 'y0'
        },
        {
          calculate: '1',
          as: 'y1'
        },
        {
          calculate: '2',
          as: 'y2'
        },
        {
          calculate: '3',
          as: 'y3'
        },
      ],
      layer: [
        {
          mark: {
            type: 'rect',
          },
          encoding: {
            x2: {
              field: 'x2',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, ''),
                format: this.props.temporalXAxisFormat,
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y0',
              type: 'quantitative',
              axis: {
                grid: false,
                labels: false,
              }
            },
            y2: {
              field: 'y1',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              }
            },
            color: {
              scale: scale,
              field: 'low',
              type: 'quantitative',
              title: namesUnits,
            },
            tooltip: [
              {
                title: 'Lowclouds', field: 'low'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'x2',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              }
            ]
          }
        },
        {
          mark: {
            type: 'rect',
          },
          encoding: {
            x2: {
              field: 'x2',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, ''),
                format: this.props.temporalXAxisFormat,
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y1',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              }
            },
            y2: {
              field: 'y2',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              }
            },
            color: {
              scale: scale,
              field: 'mid',
              type: 'quantitative',
              title: namesUnits,
            },
            tooltip: [
              {
                title: 'Midclouds', field: 'mid'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'x2',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              }
            ]
          }
        },
        {
          mark: {
            type: 'rect',
          },
          encoding: {
            x2: {
              field: 'x2',
              type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(this.props.xAxisTitle, ''),
                format: this.props.temporalXAxisFormat,
              },
              scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y2',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              }
            },
            y2: {
              field: 'y3',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              }
            },
            color: {
              scale: scale,
              field: 'hi',
              type: 'quantitative',
              title: namesUnits,
            },
            tooltip: [
              {
                title: 'Hiclouds', field: 'hi'
              },
              {
                field: 'x',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              },
              {
                field: 'x2',
                type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
                format: this.props.temporalXAxisFormat
              }
            ]
          }
        }
      ]
    };
  }

  updateSpec = () => {
    const layer = [];
    if (this.props.layers.heatmaps) layer.push(this.makeHeatmapLayer('heatmaps'));
    if (this.props.layers.areas) layer.push(this.makeAreaLayer('areas'));
    if (this.props.layers.spreads) layer.push(this.makeSpreadLayer('spreads'));
    if (this.props.layers.rects) layer.push(this.makeRectLayer('rects'));
    if (this.props.layers.bars) layer.push(this.makeBarLayer('bars'));
    if (this.props.layers.bigotes) layer.push(this.makeBigoteLayer('bigotes'));
    if (this.props.layers.pointLines) layer.push(this.makePointsLayer('pointLines'));
    if (this.props.layers.lines) layer.push(this.makeLineLayer('lines'));
    if (this.props.layers.arrows) layer.push(this.makeArrowLayer('arrows'));

    if (layer.length === 0) {
      layer.push(this.makeLineLayer('lines'));
    }

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
          legend : {
            gradientLength: this.props.height - 45,
            gradientHorizontalMaxLength: this.props.height - 45,
            gradientVerticalMaxLength: this.props.height - 45,
          },
        },
        transform: [
          {
            calculate: 'datetime(datum.x)',
            as: 'convertedDatetime'
          }
        ],
        encoding: {
          x: {
            field: 'x',
            type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
            axis: {
              title: this.makeAxisTitle(this.props.xAxisTitle, undefined),
              format: this.props.temporalXAxisFormat,
            },
            scale: this.props.xDomain ? { domain: this.props.xDomain } : { type: 'utc' },
          },
        },
        layer: [
          ...layer,
        ],
        resolve: {
          scale: this.props.scaleIndependent ? { y: 'independent' } : {}
        }
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
          
          this.setState({
            containerHeight: container.contentRect.height,
            containerWidth: container.contentRect.width,
          });
        });
        this.resizeObserver.observe(this.props.containerNode);
      }
    }

    let updateSpec = false;

    if (
      this.props.width !== undefined &&
      this.props.height !== undefined &&
      (this.props.width !== prevProps.width || this.props.height !== prevProps.height)
    ) {
      updateSpec = true;
    }

    if (this.props.units?.x !== prevProps.units?.x || this.props.units?.y !== prevProps.units?.y) {
      updateSpec = true;
    }

    if (!isEqual(prevProps.layers, this.props.layers) ) {
      updateSpec = true;
    }

    if (updateSpec) {
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
    return (
      <VegaLite
        style={{
          display: 'flex'
        }}
        renderer='svg'
        spec={this.state.spec}
        data={layers}
        className={[styles.plotContainer, this.props.className].join(' ')}
        actions={false}
      />
    );
  }
}

export default VegaTimeseriesPlot;
