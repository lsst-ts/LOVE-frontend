import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VegaLite } from 'react-vega';
import styles from './HeatMap.module.css';

export default class HeatMap extends Component {
  static propTypes = {
    /**
     * Info of the current mic to plot
     */
    infoPlot: PropTypes.object,
    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     */
    containerNode: PropTypes.object,
    /**
     * True, if we want show te heaty map on the plegable bar.
     */
    showHeatMap: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      infoPlot: null,
      containerWidth: 400,
      containerHeight: 160,
      spec: {
        width: 400,
        height: 160,
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        data: { name: 'table' },
        mark: { type: 'rect' },
        encoding: {
          x: { field: 't', type: 'temporal', axis: { title: 'TIME', format: '%H:%M:%S', grid: true } },
          y: {
            field: 'f',
            type: 'quantitative',
            axis: { title: 'FREQUENCY [Hz]', grid: true },
            scale: { domain: [0, this.bufferLength + 1] },
          },
          color: {
            type: 'quantitative',
            field: 'amp',
            scale: { scheme: 'spectral' },
            legend: { labelColor: '#ddd', labelFontSize: 14, titleColor: '#ddd', title: 'dB', gradientLength: 200 },
          },
        },
        config: {
          background: null,
          axis: {
            gridColor: '#424242',
            tickColor: null,
            titleColor: '#ddd',
            labelColor: '#ddd',
            titleFontWeight: 750,
            labelFontWeight: 750,
            titlePadding: 16,
          },
        },
      },
    };

    this.resizeObserver = undefined;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.containerNode !== this.props.containerNode) {
      if (this.props.containerNode) {
        this.resizeObserver = new ResizeObserver((entries) => {
          const container = entries[0];
          this.setState({
            height: container.contentRect.height, // - 60,
            width: container.contentRect.width, // - 120,
          });
        });

        this.resizeObserver.observe(this.props.containerNode);
      }
    }

    if (this.props.infoPlot !== null) {
      if (this.props.infoPlot.timeDomain !== undefined) {
        const { timeDomain, windowTimePlot, bufferLength } = this.props.infoPlot;
        const prevTimeDomain = prevProps.infoPlot?.timeDomain;
        if (timeDomain !== false) {
          if (prevTimeDomain !== timeDomain) {
            this.constructSpec(timeDomain, windowTimePlot, bufferLength);
          }
        }
      }
    }
  };

  /**
   * Function that update the spec inpu to Vega Lite Heat Map.
   * @param {Array} timeDomain, x-axis heat map.
   * @param {number} windowTimePlot, x-axis amount of elements.
   * @param {number} bufferLength, y-axis amount of elements.
   */
  constructSpec = (timeDomain, windowTimePlot, bufferLength) => {
    const height = this.state.height;
    const width = this.state.width;
    const spec = {
      spec: {
        width: width,
        height: height,
        data: { name: 'table' },
        mark: { type: 'rect' },
        autosize: { resize: 'true' },
        encoding: {
          x: {
            field: 't_min',
            type: 'temporal',
            axis: { title: 'TIME', format: '%H:%M:%S', tickCount: windowTimePlot - 1, grid: true },
            scale: { domain: timeDomain },
          },
          x2: {
            field: 't_max',
            type: 'temporal',
          },
          y: {
            field: 'f_min',
            type: 'quantitative',
            axis: { title: 'FREQUENCY [Hz]', grid: true, labels: true },
            scale: { domain: [0, bufferLength + 1] },
          },
          y2: { field: 'f_max', type: 'quantitative' },
          color: {
            type: 'quantitative',
            field: 'amp',
            scale: { scheme: 'spectral' },
            legend: { labelColor: '#ddd', labelFontSize: 10, titleColor: '#ddd', title: 'dB', gradientLength: height },
          },
        },
        config: {
          background: null,
          axis: {
            gridColor: '#424242',
            tickColor: null,
            titleColor: '#ddd',
            labelColor: '#ddd',
            titleFontWeight: 750,
            labelFontWeight: 750,
            titlePadding: 16,
          },
        },
      },
    };
    this.setState({ spec: spec.spec });
  };

  componentWillUnmount = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  };

  render() {
    if (!this.props.infoPlot) {
      return <></>;
    }
    const { data3D } = this.props.infoPlot;
    const { showHeatMap } = this.props;
    return (
      <>
        {/* To resize, its really important preserve the structure since it is enunciated the Heat Map tag
      in the div with the container ref until this part. Then, to this work, NOT include anothers div on here,
      only which will enclose the Vega Lite Plot tag.*/}
        {/* <div className={styles.divVegaLite}> */}
          {showHeatMap ? (
            <VegaLite
              style={{ display: 'flex' }}
              renderer="svg"
              spec={this.state.spec}
              data={data3D}
              actions={false}
            />
          ) : (
            <></>
          )}
        {/* </div> */}
      </>
    );
  }
}