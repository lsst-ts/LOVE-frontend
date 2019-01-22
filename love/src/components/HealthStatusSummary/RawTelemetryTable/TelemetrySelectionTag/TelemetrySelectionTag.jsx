import React, { Component } from 'react'



export default class TelemetrySelectionTag extends Component {
    render(){
        return <span> {this.props.telemetryName}</span>
    }
}
