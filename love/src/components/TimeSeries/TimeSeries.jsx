import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';

export default class TimeSeries extends Component {

    render() {
        return (
            <RawTelemetryTable telemetries={this.props.telemetries} {...this.state} displaySelectionColumn checkedFilterColumn='units'></RawTelemetryTable>
        )
    }
}
