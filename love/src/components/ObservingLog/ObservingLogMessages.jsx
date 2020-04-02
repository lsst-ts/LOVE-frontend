import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ObservingLogMessages.module.css';
import TextField from '../TextField/TextField';
import DateTime from '../GeneralPurpose/DateTime/DateTime';
import Toggle from '../GeneralPurpose/Toggle/Toggle';
import TimeWindow from '../GeneralPurpose/TimeWindow/TimeWindow';
import { formatTimestamp } from '../../Utils';

const TIME_FILTER_LIVE = 'TIME_FILTER_LIVE';
const TIME_FILTER_QUERY = 'TIME_FILTER_QUERY';

const timeWindowOptions = {
  '1min': 60,
  '1h': 60 * 60,
  '6h': 6 * 60 * 60,
  '1d': 24 * 60 * 60,
  '1m': 30 * 24 * 60 * 60,
  All: Infinity,
};

// const timeWindowOptions = {
//   '1s': 1,
//   '5s': 5,
//   '10s': 10,
//   '20s': 20,
//   '40s': 40,
//   All: Infinity,
// };

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
      contentFilter: '',
      userFilter: '',
      timeFilterMode: TIME_FILTER_LIVE,
      timeFilterDateStart: new Date(new Date() - 24 * 60 * 60 * 1000),
      timeFilterDateEnd: new Date(),
      timeFilterWindow: Infinity,
      containerWidth: null,
      containerHeight: null,
    };

    this.liveModeInterval = null;

    this.containerRef = React.createRef();

    this.resizeObserver = null;
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();

    this.observer.disconnect();
  };

  changeContentFilter = (event) => {
    this.setState({
      contentFilter: event.target.value,
    });
  };

  changeUserFilter = (event) => {
    this.setState({
      userFilter: event.target.value,
    });
  };

  setLiveMode = () => {
    const now = new Date();
    this.setState({
      timeFilterMode: TIME_FILTER_LIVE,
      timeFilterDateStart: isFinite(this.state.timeFilterWindow)
        ? new Date(now - this.state.timeFilterWindow * 1000)
        : new Date(0),
      timeFilterDateEnd: now,
    });
  };

  changeTimeMode = (isLiveMode) => {
    // cleanup first, to avoid duplicates
    if (this.liveModeInterval) {
      clearInterval(this.liveModeInterval);
    }
    const now = new Date();

    if (isLiveMode) {
      // start live mode
      this.setLiveMode();
      this.liveModeInterval = setInterval(this.setLiveMode, 1000);
      return;
    }

    // start query mode
    this.setState({
      timeFilterMode: TIME_FILTER_QUERY,
    });

    if (!isFinite(this.state.timeFilterWindow)) {
      // default startDate to timewindow if finite, or 1 day ago if infinite
      this.setState({
        timeFilterDateStart: new Date(now - 24 * 60 * 60 * 1000),
      });
    }

    if (!isFinite(this.state.timeFilterWindow)) {
      // default endDate to now
      this.setState({
        timeFilterDateEnd: new Date(now + 24 * 60 * 60 * 1000),
      });
    }
  };

  setTimeWindow = (value) => {
    const now = new Date();

    this.setState({
      timeFilterWindow: value,
      timeFilterDateStart: isFinite(value) ? new Date(now - value * 1000) : new Date(0),
      timeFilterDateEnd: now,
    });
  };

  changeDateStart = (value) => {
    this.setState({
      timeFilterDateStart: value.toDate(),
    });
  };

  changeDateEnd = (value) => {
    this.setState({
      timeFilterDateEnd: value.toDate(),
    });
  };

  componentWillUnmount = () => {
    if (this.liveModeInterval) {
      clearInterval(this.liveModeInterval);
    }
  };

  componentDidMount = () => {
    if (this.state.timeFilterMode === TIME_FILTER_LIVE) {
      this.setLiveMode(this.state.timeWindow);
      this.liveModeInterval = setInterval(this.setLiveMode, 1000);
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      const container = entries[0];
      console.log(container.contentRect);
      this.setState({
        containerWidth: container.contentRect.width,
        containerHeight: container.contentRect.height,
      });
    });

    this.resizeObserver.observe(this.containerRef.current);
  };
  render() {
    const filteredMessages = this.props.logMessages.filter((msg) => {
      const messageDate = new Date((msg.private_rcvStamp.value + this.props.taiToUtc) * 1000);
      const contentFilter =
        this.state.contentFilter === '' || new RegExp(this.state.contentFilter, 'i').test(msg.message.value);
      const userFilter = this.state.userFilter === '' || new RegExp(msg.user.value, 'i').test();
      const timeFilter = messageDate > this.state.timeFilterDateStart && messageDate < this.state.timeFilterDateEnd;
      const filter = contentFilter && userFilter && timeFilter;
      return filter;
    });

    return (
      <div ref={this.containerRef} className={styles.container}>
        <div className={styles.header}>
          <div className={styles.filterContainer}>
            <h3 className={styles.filterTitle}>Filters</h3>

            <div className={styles.filters}>
              <div className={styles.filter}>
                <span className={styles.filterLabel}>Mode: </span>
                <Toggle isLive={this.state.timeFilterMode === TIME_FILTER_LIVE} setLiveMode={this.changeTimeMode} />
              </div>
              {this.state.timeFilterMode === TIME_FILTER_QUERY && (
                <div className={styles.horizontalFilter}>
                  <DateTime
                    viewMode="time"
                    inputProps={{ placeholder: 'Initial date' }}
                    value={this.state.timeFilterDateStart}
                    onChange={this.changeDateStart}
                    dateFormat="YYYY/MM/DD"
                    timeFormat="HH:mm:ss"
                  />
                  <span className={styles.to}>to</span>
                  <DateTime
                    viewMode="time"
                    inputProps={{ placeholder: 'Final date' }}
                    value={this.state.timeFilterDateEnd}
                    onChange={this.changeDateEnd}
                    dateFormat="YYYY/MM/DD"
                    timeFormat="HH:mm:ss"
                  />
                </div>
              )}

              {this.state.timeFilterMode === TIME_FILTER_LIVE && (
                <div className={styles.filter}>
                  <span className={styles.filterLabel}>Time window: </span>
                  <TimeWindow
                    options={timeWindowOptions}
                    timeWindow={this.state.timeFilterWindow}
                    setTimeWindow={this.setTimeWindow}
                  />
                </div>
              )}
            </div>

            <div className={styles.filters}>
              <div className={styles.filter}>
                <span className={styles.filterLabel}>By content: </span>
                <TextField type="text" value={this.state.contentFilter} onChange={this.changeContentFilter} />
              </div>

              <div className={styles.filter}>
                <span className={styles.filterLabel}>By user name: </span>
                <TextField type="text" value={this.state.userFilter} onChange={this.changeUserFilter} />
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles.filterTitle}>Messages</h3>

        {filteredMessages.length > 0 &&
          filteredMessages.map((msg) => {
            const messageDate = formatTimestamp(msg.private_rcvStamp.value * 1000);

            return (
              <div key={Math.random()} className={styles.logMessageWrapper}>
                <div className={styles.logMessage}>
                  <div className={styles.topSection}>
                    <span>{msg.user.value}</span>
                    <span className={this.state.containerWidth < 400 ? styles.tinyMessageDate : ''}>{messageDate}</span>
                  </div>
                  <div className={styles.messageSection}>
                    <span>{msg.message.value}</span>
                  </div>
                </div>
              </div>
            );
          })}
        {filteredMessages.length === 0 && <span> No message meets all the filtering criteria.</span>}
      </div>
    );
  }
}
