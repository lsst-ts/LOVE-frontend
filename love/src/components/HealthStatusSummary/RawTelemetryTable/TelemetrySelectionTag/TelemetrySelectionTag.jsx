import React, { Component } from 'react'
import styles from './TelemetrySelectionTag.module.css';


export default class TelemetrySelectionTag extends Component {

    remove = ()=>{
        this.props.remove(this.props.telemetryKey);
    }
    render(){
        return <span className={styles.tagContainer} title={this.props.telemetryKey}> 
                    {this.props.telemetryName}
                    <span 
                        className={styles.remove} 
                        title={'Remove '+this.props.telemetryKey} 
                        onClick={this.remove}>X</span>
                </span>
    }
}
