import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './EventLog.module.css';

export default class EventLog extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    subscribeToStream: PropTypes.func,
    errorCodeData: PropTypes.array,
    embedded: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    group: '',
    data: {},
    onCSCClick: () => 0,
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    errorCodeData: [],
    embedded: false,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.log(this.props);
    this.props.subscribeToStreams(this.props.cscList);
  };

  clearGroupErrorCodes = () => {
    //   this.props.cscList.forEach(({ name, salindex }) => {
    //     this.props.clearCSCErrorCodes(name, salindex);
    //   });
  };

  render() {
    const { props } = this;
    return <div className={styles.EventLogContainer}></div>;
  }
}
