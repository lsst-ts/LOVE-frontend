/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import MapFlightTracker from './MapFlightTracker';
import Value from '../GeneralPurpose/SummaryPanel/Value';
import Title from '../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import Button from '../GeneralPurpose/Button/Button';
import isEqual from 'lodash';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import ZoomInIcon from 'components/icons/Zoom/ZoomInIcon';
import ZoomOutIcon from 'components/icons/Zoom/ZoomOutIcon';
import moment from 'moment';
import { aircraftTrackerStateToMap, aircraftTrackerStatetoStyle } from 'Config';
import styles from './FlightTracker.module.css';

const RADIO_ALERT = 100;
const RADIO_WARNING = 160;

export default class FlightTracker extends Component {
  static propTypes = {
    /** Number about the status availabled of the Aircraft Tracker CSC */
    status: PropTypes.number,
    /** Array of all detected aircrafts with their information */
    aircrafts: PropTypes.arrayOf(
      PropTypes.objectOf({
        id: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        altitude: PropTypes.number,
        track: PropTypes.number,
        distance: PropTypes.number,
        speed: PropTypes.number,
      }),
    ),
  };

  static defaultProps = {
    status: 0,
    aircrafts: [],
  };

  constructor(props) {
    super(props);
    this.pollingInterval = null;
    this.countPollingIterval = null;
    this.state = {
      lastUpdate: 0,
      zoom: '200',
      aircraftInRadius: 0,
    };
  }

  /**
   * @param {*} position: list with latitude and lonegitude
   * @param {*} radio: radio to explore
   * @returns float, that represent the distance to the observatory
   * THis function uses Haversine formula.
   */
  planeDistance = (position) => {
    const origin = [-30.240476801377167, -70.73709442008416];
    const earthRadius = 6371; // in km
    const angle1 = (origin[0] * Math.PI) / 180; // in radians
    const angle2 = (position[0] * Math.PI) / 180;
    const deltaAngle1 = ((position[0] - origin[0]) * Math.PI) / 180;
    const deltaAngle2 = ((position[1] - origin[1]) * Math.PI) / 180;

    const a = Math.sin(deltaAngle1 / 2) ** 2 + Math.cos(angle1) * Math.cos(angle2) * Math.sin(deltaAngle2 / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = earthRadius * c; // in km
    return d;
  };

  componentDidUpdate = (prevProps) => {
    if (!isEqual(prevProps.aircrafts, this.props.aircrafts)) {
      const aircraftInRadius = this.props.aircrafts.filter(
        (aircraft) => aircraft.id !== undefined && aircraft.id !== null && aircraft.id !== '',
      ).length;
      this.setState({
        aircraftInRadius: aircraftInRadius,
        lastUpdate: Date.now(),
      });
    }
  };

  componentDidMount = () => {
    const aircraftInRadius = this.props.aircrafts.filter(
      (aircraft) => aircraft.id !== undefined && aircraft.id !== null && aircraft.id !== '',
    ).length;
    this.setState({
      aircraftInRadius: aircraftInRadius,
      lastUpdate: Date.now(),
    });
  };

  /**
   * Function to set zoom state by the button Zoom In
   */
  zoomIn = () => {
    const { zoom } = this.state;
    if (zoom === '200') this.setState({ zoom: '160' });
    else if (zoom === '160') this.setState({ zoom: '100' });
  };

  /**
   * Function to set zoom state by the button Zoom Out
   */
  zoomOut = () => {
    const { zoom } = this.state;
    if (zoom === '100') this.setState({ zoom: '160' });
    else if (zoom === '160') this.setState({ zoom: '200' });
  };

  /**
   * Function to determine the status of the aircraft, from the distance to the radar
   */
  distanceStatus = (distance) => {
    if (distance < RADIO_ALERT) return 'alert';
    if (distance < RADIO_WARNING) return 'warning';
    return 'running';
  };

  render() {
    const headers = [
      {
        field: 'id',
        title: 'AirCraft ID',
        type: 'string',
        render: (value) => {
          return value ?? '-';
        },
      },
      {
        field: 'distance',
        title: 'Distance To Center',
        type: 'array',
        className: styles.statusColumn,
        render: (value) => {
          if (value)
            return (
              <StatusText small status={this.distanceStatus(value)}>
                {value.toString() + ' km'}
              </StatusText>
            );
          else return '-';
        },
      },
      {
        field: 'latitude',
        title: 'Latitude',
        render: (value) => {
          if (value) return Math.round(value * 100) / 100;
          else return '-';
        },
      },
      {
        field: 'longitude',
        title: 'Longitude',
        render: (value) => {
          if (value) return Math.round(value * 1000) / 1000;
          else return '-';
        },
      },
      {
        field: 'speed',
        title: 'Ground Speed',
        type: 'string',
        render: (value) => {
          if (value) return value + ' mph';
          else return '-';
        },
      },
    ];

    const { aircrafts, status } = this.props;

    const dateNow = Date.now();

    const zoomOut = this.state.zoom === '200' ? <ZoomOutIcon block={true}></ZoomOutIcon> : <ZoomOutIcon></ZoomOutIcon>;
    const zoomIn = this.state.zoom === '100' ? <ZoomInIcon block={true}></ZoomInIcon> : <ZoomInIcon></ZoomInIcon>;
    const inRadius = this.state.aircraftInRadius > 0 ? 'warning' : 'ok';

    return (
      <div className={styles.ftComponent}>
        <div className={styles.container}>
          <div className={styles.statusDiv}>
            <div className={styles.statusDivElement}>
              <div className={styles.statusElement}>
                <Title>Monitoring status</Title>
              </div>
              <div className={styles.statusElement}>
                <StatusText
                  title={'Monitoring status'}
                  status={aircraftTrackerStatetoStyle[aircraftTrackerStateToMap[status]]}
                  small
                >
                  {aircraftTrackerStateToMap[status]}
                </StatusText>
              </div>
            </div>
            <div className={styles.statusDivElement}>
              <div className={styles.statusElement}>
                <Title>Aircraft in Radius</Title>
              </div>
              <div className={styles.statusElement}>
                <Value>
                  <StatusText title={'Aircraft in Radius'} status={inRadius} small>
                    {this.state.aircraftInRadius}
                  </StatusText>
                </Value>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mapContainer}>
          <MapFlightTracker planes={aircrafts} zoom={this.state.zoom} distanceStatus={this.distanceStatus} />
          <div className={styles.zoomDiv}>
            <Button
              className={styles.iconBtn}
              title="Zoom"
              onClick={this.zoomOut}
              disabled={this.state.zoom === '200'}
              status="transparent"
            >
              {zoomOut}
            </Button>
            <Button
              className={styles.iconBtn}
              title="ZoomOut"
              onClick={this.zoomIn}
              disabled={this.state.zoom === '100'}
              status="transparent"
            >
              {zoomIn}
            </Button>
          </div>
        </div>
        <br></br>
        <div className={styles.divElement}>
          <div className={styles.table}>
            <SimpleTable headers={headers} data={aircrafts}></SimpleTable>
          </div>
          <div className={styles.divLastUp}>
            <span>LAST UPDATE: {moment(dateNow).format('HH:mm:ss')}</span>
            <span></span>
            <span>UPDATE DELAY: {Math.round((dateNow - this.state.lastUpdate) / 1000)} SEC</span>
          </div>
        </div>
      </div>
    );
  }
}
