import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './ObservingLogMessages.module.css';
import TextField from '../TextField/TextField';
import DateSelection from '../TimeSeries/TimeSeriesControls/DateSelection/DateSelection';
import DateTime from '../GeneralPurpose/DateTime/DateTime';
import Toggle from '../GeneralPurpose/Toggle/Toggle';
import TimeWindow from '../GeneralPurpose/TimeWindow/TimeWindow';
import moment from 'moment';

const TIME_FILTER_LIVE = 'TIME_FILTER_LIVE';
const TIME_FILTER_QUERY = 'TIME_FILTER_QUERY';

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
      timeFilterMode: TIME_FILTER_LIVE,
      timeFilterDateStart: null,
      timeFilterDateEnd: null,
      timeFilterWindowSize: Infinity,
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

  setLiveMode = (flag) => {
    console.log(flag);
    if (flag) {
      this.setState({
        timeFilterMode: TIME_FILTER_LIVE,
      });
      return;
    }

    this.setState({
      timeFilterMode: TIME_FILTER_QUERY,
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
                <Toggle isLive={this.state.timeFilterMode === TIME_FILTER_LIVE} setLiveMode={this.setLiveMode} />
                {this.state.timeFilterMode === TIME_FILTER_QUERY && (
                  <>
                    <div className={styles.filter}>
                      <span className={styles.filterLabel}> from </span>
                      <DateTime viewMode="time" inputProps={{ placeholder: 'Initial date' }} />
                    </div>
                    <div className={styles.filter}>
                      <span className={styles.filterLabel}> to </span>
                      <DateTime viewMode="time" inputProps={{ placeholder: 'Final date' }} />
                    </div>
                  </>
                )}

                {this.state.timeFilterMode === TIME_FILTER_LIVE && <TimeWindow enabledOptions={['10s', '1m', '1d']} />}
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
