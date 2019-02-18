import React, { PureComponent } from 'react';
import styles from './TimeWindow.module.css';
import PropTypes from 'prop-types';
import {UID} from 'react-uid';


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
    const timewindowPresets = [
      [60,'1h'],
      [15, '15min'],
      [1, '1min']
    ];
    return (
      <div className={styles.timeWindowOptionsContainer}>
        <span className={styles.timeWindowTitle}>Time window: </span>
        <div className={styles.timeWindowOption}>
          {timewindowPresets.map((preset)=>{
            const [duration,label] = preset;
            return (<UID key={label}>
              { id => (
                <div className={styles.timeWindowOption}>
                  <input
                    type="radio"
                    value={duration}
                    id={id}
                    checked={!this.state.isCustom && this.props.timeWindow === duration}
                    onChange={(e) => this.handleTimeWindowSelection(e.target.value, false)}
                  />
                  <label htmlFor={id} onClick={() => this.handleTimeWindowSelection(duration, false)}>{label}</label>
                </div>
              )}          
            </UID>);

          })}
        </div>
        <div className={styles.timeWindowOption}>
          <UID>
            { id => (
              <React.Fragment>
                <input
                  type="radio"
                  value={this.props.timeWindow}
                  id={id}
                  checked={this.state.isCustom}
                  onChange={(e) => this.handleTimeWindowSelection(e.target.value, true)}
                />
                <label htmlFor={id} onClick={() => this.handleTimeWindowSelection(this.props.timeWindow, true)}>Custom</label>
              </React.Fragment>
            )}
          </UID>
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
