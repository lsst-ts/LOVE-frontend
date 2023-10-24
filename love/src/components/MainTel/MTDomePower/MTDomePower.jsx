/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VegaLite } from 'react-vega';
import PowerPlot from './PowerPlot/PowerPlot';
import styles from './MTDomePower.module.css';
import { parseForPlotTimestamp, fixedFloat } from 'Utils';

export default class MTDomePower extends Component {
  static propTypes = {
    /** Louvers power draw (W) */
    powerDrawLouvers: PropTypes.number,
    /** LWS power draw (W) */
    powerDrawLWS: PropTypes.number,
    /** Shutters power draw (W) */
    powerDrawShutter: PropTypes.number,

    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     *  Will be ignored if both props.width and props.height are provided */
    containerNode: PropTypes.node,
  };

  static defaultProps = {
    powerLimit: 75,

    powerDrawLouvers: 0,
    powerDrawLWS: 0,
    powerDrawShutter: 0,
  };

  constructor(props) {
    super(props);
    this.resizeObserver = undefined;
    this.state = {
      containerWidth: 400,
      containerHeight: 200,
      spec: {},
      data: [],
      timestamp: 0,

      dataCS: [],
      dataRAD: [],
      dataOBC: [],
      dataFans: [],
      dataLouvers: [],
      dataLWS: [],
      dataShutters: [],
      dataED: [],
    };
  }

  updateSchema = () => {
    this.setState((state) => ({
      spec: {
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        width: this.props.width ?? state.containerWidth,
        height: this.props.height ?? state.containerHeight,
      },
      data: { ...this.props.schema.data },
    }));
  };

  setResizeObserver = () => {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.setState({ containerWidth: width, containerHeight: height }, () => this.updateSchema());
    });

    if (this.props.containerNode.current) {
      this.resizeObserver.observe(this.props.containerNode.current);
    }
  };

  componentDidMount = () => {
    this.props.subscribeToStreams();
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        timestamp: prevState.timestamp + 1000,
      }));
    }, 1000);
  };

  componentWillUnmount = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    //Calibration Screen
    if (prevProps.timestampCalibration !== this.props.timestampCalibration) {
      const newValue = {
        system: '01-calibration',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawCalibration / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataCS: [...prevState.dataCS, newValue].slice(-10) }));
    }

    //RAD
    if (prevProps.timestampRAD !== this.props.timestampRAD) {
      const newValue = {
        system: '04-rad',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawRAD / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataRAD: [...prevState.dataRAD, newValue].slice(-10) }));
    }

    //OBC
    if (prevProps.timestampOBC !== this.props.timestampOBC) {
      const newValue = {
        system: '05-obc',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawOBC / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataOBC: [...prevState.dataOBC, newValue].slice(-10) }));
    }

    //Fans
    if (prevProps.timestampFans !== this.props.timestampFans) {
      const newValue = {
        system: '03-fans',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawFans / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataFans: [...prevState.dataFans, newValue].slice(-10) }));
    }

    //Louvers
    if (prevProps.timestampLouvers !== this.props.timestampLouvers) {
      const newValue = {
        system: '08-louvers',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawLouvers / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataLouvers: [...prevState.dataLouvers, newValue].slice(-10) }));
    }

    //LWS
    if (prevProps.timestampLWS !== this.props.timestampLWS) {
      const newValue = {
        system: '07-lws',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawLWS / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataLWS: [...prevState.dataLWS, newValue].slice(-10) }));
    }

    //Shutters
    if (prevProps.timestampShutter !== this.props.timestampShutter) {
      const newValue = {
        system: '06-shutters',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawShutter / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataShutters: [...prevState.dataShutters, newValue].slice(-10) }));
    }

    //Electronics
    if (prevProps.timestampElectronics !== this.props.timestampElectronics) {
      const newValue = {
        system: '02-electronics',
        date: parseForPlotTimestamp(this.state.timestamp * 1000),
        count: this.props.powerDrawElectronics / 1000,
      };

      this.setState((prevState) => ({ data: [...prevState.data, newValue].slice(-80) }));
      this.setState((prevState) => ({ dataED: [...prevState.dataED, newValue].slice(-10) }));
    }
  };

  wattToKiloWatt = (watt) => {
    if (watt === undefined) {
      return 0;
    } else {
      const kiloWatt = watt / 1000;
      return kiloWatt;
    }
  };

  render() {
    //Consume telemetries and convert to kW//
    const powerDrawCalibration = this.wattToKiloWatt(this.props.powerDrawCalibration);
    const powerDrawRAD = this.wattToKiloWatt(this.props.powerDrawRAD);
    const powerDrawOBC = this.wattToKiloWatt(this.props.powerDrawOBC);
    const powerDrawFans = this.wattToKiloWatt(this.props.powerDrawFans);
    const powerDrawLouvers = this.wattToKiloWatt(this.props.powerDrawLouvers);
    const powerDrawLWS = this.wattToKiloWatt(this.props.powerDrawLWS);
    const powerDrawShutter = this.wattToKiloWatt(this.props.powerDrawShutter);
    const powerDrawElectronics = this.wattToKiloWatt(this.props.powerDrawElectronics);

    //Sum of all systems power draw//
    const powerTotal =
      powerDrawCalibration +
      powerDrawRAD +
      powerDrawOBC +
      powerDrawFans +
      powerDrawLouvers +
      powerDrawLWS +
      powerDrawShutter +
      powerDrawElectronics;

    //Plot height and width. Should make this responsive(!)//
    const height = 600;
    const width = 600;

    //Power draw limit. Should make this configurabele(!)//
    //Need to add a Warning and Danger limit too//
    const limit = 75;

    //The font height. Used to calculate the distance between each y axis system label.
    const fontHeight = 20;

    //Plot height without its axis info. Used to measure the relative plot height for the y axis system labels.
    const height2 = height - 34;

    //Calculating the position for lateral labels.

    const powerDrawLouvers2 =
      -fontHeight * 6.5 +
      height2 -
      ((powerDrawLouvers * height) / limit < fontHeight ? fontHeight : (powerDrawLouvers * height) / limit);
    const powerDrawLWS2 =
      powerDrawLouvers2 +
      fontHeight -
      ((powerDrawLWS * height) / limit < fontHeight ? fontHeight : (powerDrawLWS * height) / limit);
    const powerDrawShutter2 =
      powerDrawLWS2 +
      fontHeight -
      ((powerDrawShutter * height) / limit < fontHeight ? fontHeight : (powerDrawShutter * height) / limit);
    const powerDrawOBC2 =
      powerDrawShutter2 +
      fontHeight -
      ((powerDrawOBC * height) / limit < fontHeight ? fontHeight : (powerDrawOBC * height) / limit);
    const powerDrawRAD2 =
      powerDrawOBC2 +
      fontHeight -
      ((powerDrawRAD * height) / limit < fontHeight ? fontHeight : (powerDrawRAD * height) / limit);
    const powerDrawFans2 =
      powerDrawRAD2 +
      fontHeight -
      ((powerDrawFans * height) / limit < fontHeight ? fontHeight : (powerDrawFans * height) / limit);
    const powerDrawElectronics2 =
      powerDrawFans2 +
      fontHeight -
      ((powerDrawElectronics * height) / limit < fontHeight ? fontHeight : (powerDrawElectronics * height) / limit);
    const powerDrawCalibration2 =
      powerDrawElectronics2 +
      fontHeight -
      ((powerDrawCalibration * height) / limit < fontHeight ? fontHeight : (powerDrawCalibration * height) / limit);

    //The Plot Info
    const spec = {
      //////////////////////////
      // 1.0.0 Basic Encoding //
      //////////////////////////
      encoding: {
        // 1.1.0 axis //
        x: {
          field: 'date',
          type: 'temporal',
          title: 'Time',
          color: '#788e9b',
          axis: {
            zindex: 1,
            labelColor: '#788e9b',
            title: 0,
          },
        },
        y: {
          field: 'count',
          type: 'quantitative',
          title: 'kW',
          color: '#788e9b',
          axis: {
            zindex: 1,
            labelColor: '#788e9b',
            title: 0,
          },
        },

        // 1.2.0 - Color //
        color: {
          field: 'system',
          type: 'nominal',
          legend: null,
        },

        // 1.3.0 - Conditional Opacity //
        opacity: {
          condition: {
            param: 'hover',
            value: 1,
          },
          value: 0.2,
        },
      },

      ////////////////////////
      // 2.0.0 Datum layers //
      ////////////////////////
      layer: [
        // 2.1.0 Invisible Stroke for easier Selection //
        {
          params: [
            {
              name: 'hover',
              select: {
                type: 'point',
                fields: ['system'],
              },
            },
          ],
          mark: {
            type: 'area',
            stroke: 'transparent',
          },
          encoding: {
            y: {
              aggregate: 'sum',
              field: 'count',
              scale: {
                domain: [0, limit],
              },
              stack: 'zero',
            },
          },
        },

        // 2.2.0 Area Mark //
        {
          mark: {
            type: 'area',
            strokeWidth: 2,
            color: '#27434f',
          },
          encoding: {
            y: {
              field: 'count',
              scale: {
                domain: [0, limit],
              },
              stack: 'zero',
            },
            color: {
              field: 'system',
              type: 'nominal',
              legend: null,
              scale: { range: ['#27434f', '#27434f'] },
            },
          },
        },

        // 2.3.0 Line Mark //
        {
          mark: {
            type: 'line',
            strokeWidth: 2,
            stroke: '#59717c',
          },
          encoding: {
            y: {
              field: 'count',
              scale: {
                domain: [0, limit],
              },
              stack: 'zero',
            },
            color: {
              field: 'system',
              type: 'nominal',
              legend: null,
              scale: { range: ['#27434f', '#27434f'] },
            },
          },
        },
      ],

      //////////////////
      // 3.0.0 Config //
      //////////////////
      config: {
        //Grid config
        axis: {
          gridOpacity: 0.2,
          gridColor: '#c1ced2',
          gridWidth: 0.5,
        },
        //No border for plot
        view: { stroke: null },
      },

      //Size
      width: width,
      height: height,

      //Responsiveness
      autosize: {
        type: 'fit',
        contains: 'padding',
      },

      ////////////////
      // 4.0.0 DATA //
      ////////////////
      data: {
        values: this.state.data,
      },
    };

    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <VegaLite
            style={{ display: 'flex' }}
            renderer="svg"
            spec={spec}
            className={[styles.plotContainer, this.props.className].join(' ')}
            actions={false}
          />
          <div className={styles.systemList}>
            <div
              style={{ top: `${powerDrawCalibration2}px` }}
              className={this.props.powerDrawCalibration === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawCalibration, 1)} kW`}</span>
              {` Calibration`}
            </div>
            <div
              style={{ top: `${powerDrawElectronics2}px` }}
              className={this.props.powerDrawElectronics === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawElectronics, 1)} kW`}</span>
              {` Electronics`}
            </div>
            <div
              style={{ top: `${powerDrawFans2}px` }}
              className={this.props.powerDrawFans === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawFans, 1)} kW`}</span>
              {` Fans`}
            </div>
            <div
              style={{ top: `${powerDrawRAD2}px` }}
              className={this.props.powerDrawRAD === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawRAD, 1)} kW`}</span>
              {` RAD`}
            </div>
            <div
              style={{ top: `${powerDrawOBC2}px` }}
              className={this.props.powerDrawOBC === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawOBC, 1)} kW`}</span>
              {` OBC`}
            </div>
            <div
              style={{ top: `${powerDrawShutter2}px` }}
              className={this.props.powerDrawShutter === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawShutter, 1)} kW`}</span>
              {` Shutters`}
            </div>
            <div
              style={{ top: `${powerDrawLWS2}px` }}
              className={this.props.powerDrawLWS === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawLWS, 1)} kW`}</span>
              {` LWS`}
            </div>
            <div
              style={{ top: `${powerDrawLouvers2}px` }}
              className={this.props.powerDrawLouvers === undefined ? styles.disabled : ''}
            >
              <span className={styles.kwBold}>{`${fixedFloat(powerDrawLouvers, 1)} kW`}</span>
              {` Louvers`}
            </div>
          </div>
          <div style={{ width: 0 }}>
            <div
              style={{ top: `${height2 * 0.5}px`, left: `${width * -0.5 - 280}px`, width: 140 }}
              className={styles.powerTotal}
            >
              {`${fixedFloat(powerTotal, 2)} kW`}
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <PowerPlot
            powerDraw={fixedFloat(powerDrawCalibration, 1)}
            data={this.state.dataCS}
            title={'Calibration Screen'}
            className={this.props.powerDrawCalibration === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={0.75}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawRAD, 1)}
            data={this.state.dataRAD}
            title={'Rear Access Door'}
            className={this.props.powerDrawRAD === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={3}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawOBC, 1)}
            data={this.state.dataOBC}
            title={'Overhead Bridge Crane'}
            className={this.props.powerDrawOBC === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={6}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawFans, 1)}
            data={this.state.dataFans}
            title={'Fans'}
            className={this.props.powerDrawFans === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={25}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawLouvers, 1)}
            data={this.state.dataLouvers}
            title={'Louvers'}
            className={this.props.powerDrawLouvers === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={69}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawLWS, 1)}
            data={this.state.dataLWS}
            title={'Light Wind Screen'}
            className={this.props.powerDrawLWS === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={68}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawShutter, 1)}
            data={this.state.dataShutters}
            title={'Shutters'}
            className={this.props.powerDrawShutter === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={6}
          />
          <PowerPlot
            powerDraw={fixedFloat(powerDrawElectronics, 1)}
            data={this.state.dataED}
            title={'Electronic Devices'}
            className={this.props.powerDrawElectronics === undefined ? styles.disabled : ''}
            height={200}
            width={150}
            limit={1}
          />
        </div>
      </div>
    );
  }
}
