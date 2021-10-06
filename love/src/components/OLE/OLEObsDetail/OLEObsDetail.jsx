import React, { Component } from 'react';
import styles from './OLEObsDetail.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';

class OLEObsDetail extends Component {
  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    return (
      <div>
        <div className={styles.oleh3}>
          <h3>Messages(1)</h3>
        </div>
        <div className={styles.oleContainer}>
          <span>Flag</span>
          <Select></Select>

          <span>User</span>
          <Select></Select>

          <span>Date & Time</span>
          <Select></Select>

          <span>Msg ID</span>
          <Select></Select>

          <Input></Input>
        </div>
      </div>
    );
  }
}

export default OLEObsDetail;
