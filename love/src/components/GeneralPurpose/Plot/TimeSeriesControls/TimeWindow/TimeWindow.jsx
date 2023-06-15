import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { UID } from 'react-uid';
import TextField from 'components/TextField/TextField';
import styles from './TimeWindow.module.css';

export default class TimeWindow extends PureComponent {
  static propTypes = {
    /** Function to be called when changing the time window */
    setTimeWindow: PropTypes.func.isRequired,
    /** Time window in minutes */
    timeWindow: PropTypes.number,// PropTypes.string,
  };

  static defaultProps = {
    setTimeWindow: () => 0,
  };

  constructor() {
    super();
    this.state = {
      isCustom: false,
    };
  }

  handleCustomInput = (e) => {
    const timeWindow = e.target.value <= 60 ? e.target.value : 60;
    this.props.setTimeWindow(timeWindow);
  };

  handleTimeWindowSelection = (timeWindow, isCustom) => {
    this.props.setTimeWindow(parseFloat(timeWindow));
    this.setState({
      isCustom,
    });
  };

  render() {
    const timewindowPresets = [
      ['60', '1h'],
      ['15', '15min'],
      ['1', '1min'],
    ];
    return (
      <div className={styles.timeWindowOptionsContainer}>
        <span className={styles.timeWindowTitle}>Time window: </span>
        {timewindowPresets.map((preset) => {
          const [duration, label] = preset;
          return (
            <UID key={label}>
              {(id) => (
                <div className={styles.timeWindowOption}>
                  <div className={styles.timeWindowOption}>
                    <input
                      type="radio"
                      value={duration}
                      id={id}
                      checked={!this.state.isCustom && this.props.timeWindow == duration}
                      onChange={(e) => this.handleTimeWindowSelection(e.target.value, false)}
                    />
                    <label htmlFor={id} onClick={() => this.handleTimeWindowSelection(duration, false)}>
                      {label}
                    </label>
                  </div>
                </div>
              )}
            </UID>
          );
        })}
        <div className={styles.timeWindowOption}>
          <UID>
            {(id) => (
              <React.Fragment>
                <input
                  type="radio"
                  value={this.props.timeWindow}
                  id={id}
                  checked={this.state.isCustom}
                  onChange={(e) => this.handleTimeWindowSelection(e.target.value, true)}
                />
              </React.Fragment>
            )}
          </UID>
          <UID>
            {(id) => (
              <>
                <label htmlFor={id} onClick={() => this.handleTimeWindowSelection(this.props.timeWindow, true)}>
                  Custom
                </label>
                <div
                  className={[styles.customTimeWindowContainer, this.state.isCustom ? styles.customVisible : ''].join(
                    ' ',
                  )}
                >
                  <label htmlFor={id}>: </label>
                  <TextField
                    id={id}
                    className={styles.customTimeWindowInput}
                    type="text"
                    value={this.props.timeWindow}
                    onChange={this.handleCustomInput}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                  <label htmlFor={id}> minutes</label>
                </div>
              </>
            )}
          </UID>
        </div>
      </div>
    );
  }
}
