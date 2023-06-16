import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MainTelESS.module.css';

export default class MainTelESS extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {};

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    return (
      <></>
    );
  }
}
