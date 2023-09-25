/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import styles from './Network.module.css';
import { formatTimestamp } from '../../Utils';
export default class NetworkSegment extends Component {
  static propTypes = {
    /** One of the archive dictionaries coming  */
    metadata: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData = () => {
    const { metadata } = this.props;
    const baseURL = metadata.url.split(metadata.uri)[0];
    const event = metadata['event-types'].filter((e) => {
      return e['event-type'] === 'histogram-rtt';
    })[0];
    const summary = event.summaries.filter((sum) => {
      return sum['summary-type'] === 'statistics' && sum['summary-window'] === '0';
    })[0];
    const url = `${baseURL}${summary.uri}?time-range=3600`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          data: data[data.length - 1],
        });
      });
  };

  render() {
    const { metadata } = this.props;
    const { data } = this.state;
    const maxValue = data?.val?.maximum ? Math.round(data?.val?.maximum * 100) / 100 : '?';
    const minValue = data?.val?.maximum ? Math.round(data?.val?.minimum * 100) / 100 : '?';
    const meanValue = data?.val?.maximum ? Math.round(data?.val?.mean * 100) / 100 : '?';
    const ts = data?.ts ? formatTimestamp(data?.ts * 1000) : '-';
    const valid = maxValue !== '?' && minValue !== '?' && meanValue !== '?';
    return (
      <div className={[styles.segmentContainer, valid === false ? styles.error : ''].join(' ')}>
        <div className={styles.timestampContainer}>
          <span className={styles.highlight}>{ts}</span>
        </div>
        <div className={styles.endpointsContainer}>
          <span>Source: </span>
          <span className={[styles.highlight, styles.ip].join(' ')}>{metadata.source} </span>
          <span>Destination: </span>
          <span className={[styles.highlight, styles.ip].join(' ')}>{metadata.destination} </span>
        </div>
        <div className={styles.valuesContainer}>
          <span>Max: </span>
          <span className={styles.highlight}>{maxValue} ms</span>
          <span>Min: </span>
          <span className={styles.highlight}>{minValue} ms</span>
          <span>Mean: </span>
          <span className={styles.highlight}>{meanValue} ms</span>
        </div>
      </div>
    );
  }
}
