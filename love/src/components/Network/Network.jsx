import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Network.module.css';
import NetworkSegment from './NetworkSegment';

export default class Network extends Component {
  static propTypes = {
    url: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      archivesMetadata: [],
    };
  }

  componentDidMount() {
    fetch('https://ma.ampath.net/esmond/perfsonar/archive/?event-type=histogram-rtt&format=json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          archivesMetadata: data,
        });
      });
  }

  render() {
    return (
      <div className={styles.container}>
        {this.state.archivesMetadata.map((metadata) => {
          return (
            <NetworkSegment key={metadata.url} metadata={metadata} />
          );
        })}
      </div>
    );
  }
}
