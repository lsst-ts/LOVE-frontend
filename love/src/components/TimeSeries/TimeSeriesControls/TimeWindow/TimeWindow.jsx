import React, { PureComponent } from 'react';
import styles from './TimeWindow.module.css';
import PropTypes from 'prop-types';

export default class TimeWindow extends PureComponent {
  static propTypes = {
    /** Function to be called when changing the time window*/
    setTimeWindow: PropTypes.func.isRequired,
  };
  static defaultProps = {
    setTimeWindow: () => {
      return 0;
    },
  };
  constructor() {
    super();
    this.state = {
      isCustom: false,
    };
  }

  handleCustomInput = (e) => {
    const timeWindow = e.target.value;
    this.props.setTimeWindow(timeWindow);
  };

  handleTimeWindowSelection = (timeWindow, isCustom) => {
    this.props.setTimeWindow(parseFloat(timeWindow));
    this.setState({
      isCustom,
    });
  };

  render() {
    return (
      <div className={styles.timeWindowOptionsContainer}>
        <span className={styles.timeWindowTitle}>Time window: </span>
        <div className={styles.timeWindowOption}>
          <input
            type="radio"
            value={60}
            checked={!this.state.isCustom && this.props.timeWindow === 60}
            onChange={(e) => this.handleTimeWindowSelection(e.target.value, false)}
          />
          <label onClick={() => this.handleTimeWindowSelection(60, false)}>1h</label>
        </div>
        <div className={styles.timeWindowOption}>
          <input
            type="radio"
            value={15}
            checked={!this.state.isCustom && this.props.timeWindow === 15}
            onChange={(e) => this.handleTimeWindowSelection(e.target.value, false)}
          />
          <label onClick={() => this.handleTimeWindowSelection(15, false)}>15min</label>
        </div>
        <div className={styles.timeWindowOption}>
          <input
            type="radio"
            value={1}
            checked={!this.state.isCustom && this.props.timeWindow === 1}
            onChange={(e) => this.handleTimeWindowSelection(e.target.value, false)}
          />
          <label onClick={() => this.handleTimeWindowSelection(1, false)}>1min</label>
        </div>
        <div className={styles.timeWindowOption}>
          <input
            type="radio"
            value={this.props.timeWindow}
            checked={this.state.isCustom}
            onChange={(e) => this.handleTimeWindowSelection(e.target.value, true)}
          />
          <label onClick={() => this.handleTimeWindowSelection(this.props.timeWindow, true)}>Custom</label>
          <div
            className={[styles.customTimeWindowContainer, this.state.isCustom ? styles.customVisible : ''].join(' ')}
          >
            <span>: </span>
            <input
              className={styles.customTimeWindowInput}
              type="text"
              value={this.props.timeWindow}
              onChange={this.handleCustomInput}
            />
            <span> minutes</span>
          </div>
        </div>
      </div>
    );
  }
}
