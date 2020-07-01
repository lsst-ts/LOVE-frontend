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
    }).isRequired,

    /**
     * Defines the styles of each mark to be plotted.
     */
    marksStyles: PropTypes.arrayOf(
      PropTypes.shape({
        /** (All layers) `name` attribute of the data to apply these styles.
         * Rows of data with no name-matching markStyle will not be rendered.
         */
        name: PropTypes.string,
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
      containerWidth: 500,
      containerHeight: 200,
      spec: {},
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
          scale: this.props.xDomain
            ? {
                domain: this.props.xDomain,
              }
            : undefined,
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

  updateSpec = () => {
    this.setState({
      spec: {
        width:
          this.props.width !== undefined && this.props.height !== undefined
            ? this.props.width
            : this.state.containerWidth,
        height:
          this.props.width !== undefined && this.props.height !== undefined
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
            gridColor: '#626262',
            tickColor: null,
          },
          axisX: {
            titlePadding: 16,
            titleFontWeight: 750,
            // labelAngle: -45,
            labelFontWeight: 750,
            tickCount: 5,
          },
        },
        layer: [
          // this.makeBarLayer('bars'),
          this.makeLineLayer('lines'),
          // this.makeLineLayer('pointLines'),
          // this.makePointsLayer('pointLines'),
        ],
      },
    });
  };

  componentDidMount = () => {
    this.updateSpec();
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

    if (
      this.props.width !== undefined &&
      this.props.height !== undefined &&
      (this.props.width !== prevProps.width || this.props.height !== prevProps.height)
    ) {
      this.updateSpec();
    }

    if (this.props.units !== prevProps.units) {
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
          display: 'flex',
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
