import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './WeatherStation.module.css';

export default class WeatherStation extends Component {
  static propTypes = {
    url: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      archivesMetadata: [],
    };
    this.azimuthPlotRef = React.createRef();
    this.elevationPlotRef = React.createRef();
  }

  componentDidMount = () => {
    // this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    // this.props.unsubscribeToStreams();
  };

  render() {
    console.log(this.props.salindex);
    const temperaturePlot = {
      airTemperature: {
        category: 'telemetry',
        csc: 'Environment',
        salindex: '1',
        topic: 'airTemperature',
        item: 'avg1M',
        type: 'line',
        accessor: (x) => x,
        color: 'hsl(201, 70%, 40%)',
      },
    };

    return (
      <div className={styles.container}>
        <div ref={this.elevationPlotRef} className={styles.elevationPlot}>
          <div>
            <PlotContainer
              inputs={temperaturePlot}
              containerNode={this.elevationPlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Elevation"
            />
          </div>
        </div>
      </div>
    );
  }
}
