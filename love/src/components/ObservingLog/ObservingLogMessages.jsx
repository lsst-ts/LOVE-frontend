import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './ObservingLogMessages.module.css';

export default class ObservingLogInput extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
    /** Username of logged user */
    logMessages: PropTypes.array,
  };

  static defaultProps = {
    alarms: [],
  };

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  render() {
    return (
      <Panel title="Observing Log" className={styles.panel}>
        <div className={styles.container}>
          {this.props.logMessages.map((msg) => {
            return (
              <div key={Math.random()} className={styles.logMessageWrapper}>
                <div className={styles.logMessage}>
                  <div className={styles.topSection}>
                    <span>{msg.user.value}</span>
                    <span>{new Date(msg.private_rcvStamp.value*1000).toLocaleString()}</span>
                  </div>
                  <div className={styles.messageSection}>
                    <span>{msg.message.value}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }
}
