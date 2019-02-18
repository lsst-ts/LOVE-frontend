import React, { Component } from 'react'
import DateSelection from './DateSelection/DateSelection';
import TimeWindow from './TimeWindow/TimeWindow';
import PropTypes from 'prop-types';
import styles from './TimeSeriesControls.module.css'
import GearIcon from '../../icons/GearIcon/GearIcon'

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

    constructor() {
        super();
    }

    handleChangeChk = () => {
        if(this.props.isLive)
            this.props.setLiveMode(false);
        else
            this.props.setLiveMode(true);
    }

    render() {
        return (
            <div className={styles.timeseriesControlsContainer}>
                <div className={styles.switchContainer}>
                    <span className={[styles.modeSelection, this.props.isLive ? styles.highlightText : ''].join(' ')} onClick={() => this.props.setLiveMode(true)} >Live</span>
                    <label className={styles.switch}>
                        <input type="checkbox" alt="Live/query mode toggle" checked={!this.props.isLive} onChange={this.handleChangeChk}/>
                        <span className={[styles.slider, styles.round].join(' ')}></span>
                    </label>
                    <span className={[styles.modeSelection, !this.props.isLive ? styles.highlightText : ''].join(' ')} onClick={() => this.props.setLiveMode(false)} >Query</span>
                </div>

                {
                    this.props.isLive ?
                        <TimeWindow setTimeWindow={this.props.setTimeWindow} timeWindow={this.props.timeWindow}></TimeWindow>
                        :
                        <DateSelection setHistoricalData={this.props.setHistoricalData}></DateSelection>
                }
                <div onClick={this.props.goBack}  className={styles.gearIconContainer}>
                    <GearIcon active></GearIcon>
                </div>
            </div>
        )
    }
}
