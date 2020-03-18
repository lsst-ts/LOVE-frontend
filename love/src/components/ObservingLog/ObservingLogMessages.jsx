import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './ObservingLogMessages.module.css';
import TextField from '../TextField/TextField';
import DateSelection from '../TimeSeries/TimeSeriesControls/DateSelection/DateSelection';
import DateTime from '../GeneralPurpose/DateTime/DateTime';
import Toggle from '../GeneralPurpose/Toggle/Toggle';
import moment from 'moment';

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
    this.state = {
      filter: '',
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  changeFilter = (event) => {
    this.setState({
      filter: event.target.value,
    });
  };

  render() {
    return (
      <Panel title="Observing Log" className={styles.panel}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.filterContainer}>
              <h3 className={styles.filterTitle}>Filters</h3>

              <div className={styles.filters}>
                <span className={styles.filterLabel}>Time: </span>
                <Toggle/>
                <div className={styles.filter}>
                  <span className={styles.filterLabel}> from </span>
                  <DateTime viewMode='time' inputProps={{ placeholder: 'Initial date' }} />
                </div>
                <div className={styles.filter}>
                  <span className={styles.filterLabel}> to </span>
                  <DateTime viewMode='time' inputProps={{ placeholder: 'Final date' }} />
                </div>
              </div>

              <div className={styles.filters}>
                <div className={styles.filter}>
                  <span className={styles.filterLabel}>Message: </span>
                  <TextField type="text" value={this.state.filter} onChange={this.changeFilter} />
                </div>
              </div>
            </div>
          </div>
          {this.props.logMessages.map((msg) => {
            const filter =
              this.state.filter === '' ||
              new RegExp(this.state.filter, 'i').test(msg.message.value) ||
              new RegExp(this.state.filter, 'i').test(msg.user.value);

            return (
              filter && (
                <div key={Math.random()} className={styles.logMessageWrapper}>
                  <div className={styles.logMessage}>
                    <div className={styles.topSection}>
                      <span>{msg.user.value}</span>
                      <span>{new Date(msg.private_rcvStamp.value * 1000).toLocaleString()}</span>
                    </div>
                    <div className={styles.messageSection}>
                      <span>{msg.message.value}</span>
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </Panel>
    );
  }
}
