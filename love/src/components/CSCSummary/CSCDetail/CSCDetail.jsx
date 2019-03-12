import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCDetail.module.css';

export default class CSCDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    data: {},
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.CSCDetailContainer}>
        <div>{this.props.name}</div>
        {/* <div>{JSON.stringify(this.props.data)}</div> */}
      </div>
    );
  }
}
