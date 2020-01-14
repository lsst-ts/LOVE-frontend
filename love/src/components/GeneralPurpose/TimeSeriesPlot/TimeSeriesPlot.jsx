import React, { Component } from 'react';
import * as vega from 'vega';
import vegae from 'vega-embed';
import PropTypes from 'prop-types';
import styles from './TimeSeriesPlot.module.css';

/**
 * Simple wrapper around the Vega-lite visualization package.
 * It receives the plot spec and embeds the plot in the DOM using React refs.
 */
export default class TimeSeriesPlot extends Component {
  constructor() {
    super();
    this.vegaContainer = React.createRef();
    this.vegaEmbedResult = null;
    this.data = {};
    this.state = {
      specDataType: 'quantitative',
      specName: 'stream',
    };
  }

  static vegaSchema = 'https://vega.github.io/schema/vega-lite/v3.json'; // 'https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json'

  static propTypes = {
    /**
     * Object that defines the properties to be used by Vega-lite
     */
    spec: PropTypes.object,
    dateStart: PropTypes.any,
    dateEnd: PropTypes.any,
    lastMessageData: PropTypes.array,
    historicalData: PropTypes.array,
    telemetryName: PropTypes.string,
    dataType: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    spec: {
      $schema: TimeSeriesPlot.vegaSchema,
      description: 'A simple bar chart with embedded data.',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
          { a: 'C', b: 43 },
          { a: 'D', b: 91 },
          { a: 'E', b: 81 },
          { a: 'F', b: 53 },
          { a: 'G', b: 19 },
          { a: 'H', b: 87 },
          { a: 'I', b: 52 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: { field: 'a', type: 'ordinal' },
        y: { field: 'b', type: 'quantitative' },
      },
    },
    dataLabel: '',
    dateInterval: 60000,
    encoding: {},
    width: 300,
    height: 100,
    dateEnd: Infinity,
    dateStart: -Infinity,
  };

  componentDidUpdate = (prevProps) => {
    const dateInterval = this.props.dateInterval;

    this.props.dataSources.map((dataSource) => {
      const accessor = this.props.accessors[dataSource];
      const data = this.props.streamStates[dataSource].data;
      const timestamp = this.props.streamStates[dataSource].timestamp;
      const dataLabel = dataSource;

      let shouldUpdatePlot = false;
      const value = data ? accessor(data) : undefined;

      const vegaData = {
        value: value,
        timestamp: timestamp,
        source: dataLabel,
        dataType: 'quantitative',
      };
      if (prevProps.timestamp !== timestamp) {
        if (this.data[dataSource] === undefined) this.data[dataSource] = [];
        this.data[dataSource].push(vegaData);

        shouldUpdatePlot = true;
      }

      const currDate = new Date();
      if (this.vegaEmbedResult && shouldUpdatePlot) {
        this.data[dataSource] = this.data[dataSource].filter((data) => {
          const dateDiff = currDate - data.timestamp;
          return dateDiff < dateInterval;
        });

        vega
          .changeset()
          .remove(() => true)
          .insert(this.data[dataSource]);

        // this.vegaEmbedResult.view.change(dataLabel, changeSet).run();
      }
      return 0;
    });
    if (
      this.props.dataSources !== prevProps.dataSources ||
      this.props.groupNames !== prevProps.groupNames ||
      this.props.layers !== prevProps.layers ||
      this.props.encoding !== prevProps.encoding ||
      this.props.accessors !== prevProps.accessors
    ) {
      this.reloadPlot();
    }
  };

  getCSSColorByVariableName = (varName) => getComputedStyle(this.vegaContainer.current).getPropertyValue(varName);

  remountPlot = (dataSpec) => {
    this.data = {};
    const labelFontSize = 14;
    const titleFontSize = 16;
    const spec = Object.assign(
      {
        config: {
          padding: 15,
          axis: {
            labelColor: this.getCSSColorByVariableName('--base-font-color'),
            titleColor: this.getCSSColorByVariableName('--base-font-color'),
            grid: false,
          },
          legend: {
            labelColor: this.getCSSColorByVariableName('--base-font-color'),
            titleColor: this.getCSSColorByVariableName('--base-font-color'),
            // labelFontSize,
            // titleFontSize,
            titleLimit: 160 * titleFontSize,
            labelLimit: 15 * labelFontSize,
            orient: 'right',
          },
          view: {
            width: this.props.width,
            height: this.props.height,
            fill: this.getCSSColorByVariableName('--second-secondary-background-color'),
            stroke: 'none',
            strokeWidth: 0,
          },
        },
      },
      dataSpec,
    );

    vegae(this.vegaContainer.current, spec, { renderer: 'svg', actions: false }).then((vegaEmbedResult) => {
      this.vegaEmbedResult = vegaEmbedResult;
    });
  };

  changeSpec = (data, name) => {
    const dataType = this.getSpecDataType(this.props.dataType);
    const encoding = this.props.encoding;
    const layers = Object.keys(this.props.layers).map((layerName) => {
      const layer = this.props.layers[layerName];
      // const color = layer.encoding ? layer.encoding.color : undefined;
      return {
        data: {
          values: data,
          name: layerName,
        },
        mark: { type: dataType === 'quantitative' ? 'line' : 'point', ...layer.mark },
        encoding: {
          x: {
            field: 'timestamp',
            type: 'temporal',
            title: 'date',
            axis: {
              format: '%X',
              labelOverlap: 'parity',
            },
            ...encoding.x,
          },
          y: {
            field: 'value',
            type: dataType,
            title: this.props.dataLabel,
            ...encoding.y,
          },
          color: {
            field: 'source',
            type: 'nominal',
            legend: {
              title: `Parameter Names${' '.repeat(32)}`,
            },
            ...encoding.color,
          },
        },
      };
    });

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      description: "Google's stock price over time.",
      // data: {
      //   values: data,
      //   name: 'telemetries',
      // },
      layer: layers,
    };
  };

  getSpecDataType = (dataType) => {
    if (dataType === 'String') return 'nominal';
    return 'quantitative';
  };

  reloadPlot = () => {
    this.remountPlot(
      this.changeSpec(
        [
          {
            value: undefined,
            timestamp: new Date(),
            source: this.props.dataLabel,
            dataType: 'quantitative',
          },
        ],
        this.props.dataLabel,
      ),
    );
  };

  componentDidMount = () => {
    this.reloadPlot();
    this.props.dataSources.map((dataSource) => {
      const groupName = this.props.groupNames[dataSource];
      this.props.subscribeToStream(groupName);
      return 0;
    });
  };

  componentWillUnmount = () => {
    this.props.dataSources.map((dataSource) => {
      const groupName = this.props.groupNames[dataSource];
      this.props.unsubscribeToStream(groupName);
      return 0;
    });
  };

  render() {
    if (this.vegaEmbedResult) {
      // const changeSet = vega.changeset();
      // this.vegaEmbedResult.view.change('telemetries', changeSet).run();

      this.props.dataSources.map((dataSource) => {
        const changeSet = vega
          .changeset()
          .remove(() => true)
          .insert(this.data[dataSource]);

        this.vegaEmbedResult.view.change(dataSource, changeSet).run();
        return 0;
      });
    }
    return <div className={styles.vegaContainer} ref={this.vegaContainer} />;
  }
}
