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
import styles from './PowerPlot.module.css';

export default class PowerPlot extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Louvers power draw (W) */
    powerDrawLouvers: PropTypes.number,
    /** LWS power draw (W) */
    powerDrawLightWindScreen: PropTypes.number,
    /** Shutters power draw (W) */
    powerDrawShutter: PropTypes.number,
    /** ClassName style to be asigned to the Power Plot */
    className: PropTypes.string,
  };

  static defaultProps = {
    powerDraw: 50,
    height: 600,
    width: 600,
    limit: 75,
    title: 'Title',
    data: [],
  };

  render() {
    const powerDraw = this.props?.powerDraw;

    const height = this.props?.height;
    const width = this.props?.width;
    const title = this.props?.title;

    const limit = this.props?.limit;

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
          axis: {
            zindex: 1,
            labels: 0,
            ticks: 0,
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
            ticks: 0,
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
          value: 1,
        },
      },

      ////////////////////////
      // 2.0.0 Datum layers //
      ////////////////////////
      layer: [
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
        values: [
          {
            system: this.props.data[0]?.system ?? 0,
            count: this.props.data[0]?.count ?? 0,
            date: '2020-01-01 10:10:00',
          },
          {
            system: this.props.data[1]?.system ?? 0,
            count: this.props.data[1]?.count ?? 0,
            date: '2020-01-01 10:11:00',
          },
          {
            system: this.props.data[2]?.system ?? 0,
            count: this.props.data[2]?.count ?? 0,
            date: '2020-01-01 10:12:00',
          },
          {
            system: this.props.data[3]?.system ?? 0,
            count: this.props.data[3]?.count ?? 0,
            date: '2020-01-01 10:13:00',
          },
          {
            system: this.props.data[4]?.system ?? 0,
            count: this.props.data[4]?.count ?? 0,
            date: '2020-01-01 10:14:00',
          },
          {
            system: this.props.data[5]?.system ?? 0,
            count: this.props.data[5]?.count ?? 0,
            date: '2020-01-01 10:15:00',
          },
          {
            system: this.props.data[6]?.system ?? 0,
            count: this.props.data[6]?.count ?? 0,
            date: '2020-01-01 10:16:00',
          },
          {
            system: this.props.data[7]?.system ?? 0,
            count: this.props.data[7]?.count ?? 0,
            date: '2020-01-01 10:17:00',
          },
          {
            system: this.props.data[8]?.system ?? 0,
            count: this.props.data[8]?.count ?? 0,
            date: '2020-01-01 10:18:00',
          },
          {
            system: this.props.data[9]?.system ?? 0,
            count: this.props.data[9]?.count ?? 0,
            date: '2020-01-01 10:19:00',
          },
        ],
      },
    };

    return (
      <div className={[styles.container, this.props.className].join(' ')}>
        <div className={styles.plot}>
          <VegaLite
            style={{ display: 'flex' }}
            renderer="svg"
            spec={spec}
            className={styles.plotContainer}
            actions={false}
          />
          <div style={{ width: 0 }}>
            <div style={{ top: `${height * 0.5 - 25}px`, left: `${width * -0.5 - 25}px` }} className={styles.powerDraw}>
              {`${powerDraw} kW`}
            </div>
          </div>
        </div>
        <div className={styles.titleContainer}>
          <div style={{ width: `${width}px` }} className={styles.title}>
            {title}
          </div>
        </div>
      </div>
    );
  }
}
