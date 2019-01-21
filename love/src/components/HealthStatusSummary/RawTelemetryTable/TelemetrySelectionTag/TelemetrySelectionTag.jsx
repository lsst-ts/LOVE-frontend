import React, { Component } from 'react'
import styles from './TelemetrySelectionTag.module.css';


export default class TelemetrySelectionTag extends Component {
    render(){
        return <span className={styles.tagContainer} title={this.props.telemetryKey}> 
                    {this.props.telemetryName}
                    <span className={styles.close}>x</span>
                </span>
    }
}
