import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { signals, effects } from '../../Config';

export default class GIS extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    console.log(signals);
    return (
      <div className={styles.div}>
        <div className={styles.div2}></div>
        <div className={styles.div2}></div>
      </div>
    );
  }
}
