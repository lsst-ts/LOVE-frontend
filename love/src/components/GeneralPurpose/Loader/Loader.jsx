import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Loader.module.css';

export default class Loader extends Component {
  static propTypes = {
    display: PropTypes.bool,
  };

  render() {
    return this.props.display && <div className={styles.container}>
    <div className={styles.loader} />
      
      <div className={styles.text}>
        {this.props.message}
      </div>
      </div>;
  }
}
