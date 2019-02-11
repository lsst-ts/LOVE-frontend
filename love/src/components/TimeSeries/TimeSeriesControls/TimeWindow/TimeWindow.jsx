import React, { PureComponent } from 'react'
import styles from './TimeWindow.module.css'
import PropTypes from 'prop-types';

export default class TimeWindow extends PureComponent {
    static propTypes = {
        /** Function to be called when changing the time window*/
        setTimeWindow: PropTypes.func.isRequired,
    }
    static defaultProps = {
        setTimeWindow: () => {return 0;},
    }
    constructor() {
        super();
        this.state = {
            customValue: 5,
            timeWindow: {
                id: '1h',
                value: 1,
                unit: "hours"
            }
        }
        this.timeWindows = (id) => {
            switch (id) {
                case '1h':
                    return {
                        id: '1h',
                        value: 1,
                        unit: "hours"
                    };
                case '15min':
                    return {
                        id: '15min',
                        value: 15,
                        unit: "minutes"
                    };
                case '1min':
                    return {
                        id: '1min',
                        value: 1,
                        unit: "minutes"
                    };
                case 'custom':
                    return {
                        id: 'custom',
                        value: this.state.customValue,
                        unit: "minutes"
                    };
            }
        }
    }

    handleCutomInput = (e) => {
        const timeWindow = {
            id: 'custom',
            value: e.target.value,
            unit: "minutes"
        };
        this.props.setTimeWindow(timeWindow);
        this.setState({
            customValue: e.target.value,
            timeWindow: timeWindow
        });
    }

    handleTimeWindowSelection = (e) => {
        const timeWindow = this.timeWindows(e.target.value);
        this.props.setTimeWindow(timeWindow);
        this.setState({
            timeWindow: timeWindow,
        });
    }

    render() {
        return (
            <div className={styles.timeWindowOptionsContainer}>
                <span className={styles.timeWindowTitle}>Time window: </span>
                <div className={styles.timeWindowOption}>
                    <input id="first-option" type="radio" name="time-window" value="1h" checked={this.state.timeWindow.id === "1h"} onChange={this.handleTimeWindowSelection} />
                    <label htmlFor="first-option">1h</label>
                </div>
                <div className={styles.timeWindowOption}>
                    <input id="second-option" type="radio" name="time-window" value="15min" checked={this.state.timeWindow.id === "15min"} onChange={this.handleTimeWindowSelection} />
                    <label htmlFor="second-option">15min</label>
                </div>
                <div className={styles.timeWindowOption}>
                    <input id="third-option" type="radio" name="time-window" value="1min" checked={this.state.timeWindow.id === "1min"} onChange={this.handleTimeWindowSelection} />
                    <label htmlFor="third-option">1min</label>
                </div>
                <div className={styles.timeWindowOption}>
                    <input id="fourth-option" type="radio" name="time-window" value="custom" checked={this.state.timeWindow.id === "custom"} onChange={this.handleTimeWindowSelection} />
                    <label htmlFor="fourth-option">Custom</label>
                    <div className={[styles.customTimeWindowContainer, this.state.timeWindow.id === "custom" ? styles.customVisible : ""].join(' ')}>
                        <span>: </span>
                        <input className={styles.customTimeWindowInput} id="custom-option" type="text" value={this.state.customValue} onChange={this.handleCutomInput} />
                        <span> minutes</span>
                    </div>
                </div>
            </div>
        )
    }
}
