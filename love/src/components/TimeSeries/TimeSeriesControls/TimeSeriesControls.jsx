import React, { Component } from 'react'
import DateSelection from './DateSelection/DateSelection';
import TimeWindow from './TimeWindow/TimeWindow';
import PropTypes from 'prop-types';

export default class TimeSeriesControls extends Component {
    static propTypes = {
        /** Display time window in live mode if true, otherwise display date selection*/
        liveMode: PropTypes.bool,
        /** Function to be called when changing the time window*/
        setTimeWindow: PropTypes.func.isRequired,
    }
    static defaultProps = {
        liveMode: false,
    }

    render() {
        return (
            <div>
                {
                    this.props.liveMode ?
                        <TimeWindow setTimeWindow={this.props.setTimeWindow} timeWindow={this.props.timeWindow}></TimeWindow>
                        :
                        <DateSelection></DateSelection>
                }
            </div>
        )
    }
}
