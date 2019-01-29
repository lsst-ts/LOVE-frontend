import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import Vega from '../Vega/Vega';

export default class TimeSeries extends Component {

    constructor() {
        super();

        const fakeData = [
            {
                "value": 0.07488591422473134,
                "date": "Mon Jan 28 2019 17:11:47 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.5245901947239993,
                "date": "Mon Jan 28 2019 17:11:49 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.047757761098165874,
                "date": "Mon Jan 28 2019 17:11:51 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.9885446210571569,
                "date": "Mon Jan 28 2019 17:11:53 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.6206922871313166,
                "date": "Mon Jan 28 2019 17:11:56 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.8991292952427338,
                "date": "Mon Jan 28 2019 17:11:58 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.15595247737027262,
                "date": "Mon Jan 28 2019 17:12:00 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.9845770842404732,
                "date": "Mon Jan 28 2019 17:12:02 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.5536720601516104,
                "date": "Mon Jan 28 2019 17:12:04 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.5664039246421997,
                "date": "Mon Jan 28 2019 17:12:06 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.9389258470247447,
                "date": "Mon Jan 28 2019 17:12:08 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.8902830351586631,
                "date": "Mon Jan 28 2019 17:12:10 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.3102594952440675,
                "date": "Mon Jan 28 2019 17:12:12 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.04128383319263551,
                "date": "Mon Jan 28 2019 17:12:14 GMT-0300 (Chile Summer Time)"
            },
            {
                "value": 0.7105892406862067,
                "date": "Mon Jan 28 2019 17:12:16 GMT-0300 (Chile Summer Time)"
            },
        ]
        this.state = {
            telemetryName: "test",
            step: 0,
            data: fakeData,
        }
    }

    getSpec = (data, name) => {
        return {
            "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
            "description": "Google's stock price over time.",
            "data": {
                "values": data,
                "name": "telemetries"
            },
            "mark": "line",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "title": "date"
                },
                "y": {
                    "field": "value",
                    "type": "quantitative",
                    "title": name
                }
            }
        }
    }

    onSetSelection = (selectedRows) => {
        console.log(selectedRows)
        this.setState({
            telemetryName: selectedRows[0],
            step: 1
        })
    }

    render() {
        return (
            this.state.step === 0 ?
                <RawTelemetryTable telemetries={this.props.telemetries} {...this.state} displaySelectionColumn checkedFilterColumn='units' onSetSelection={this.onSetSelection}></RawTelemetryTable>
                :
                <Vega spec={this.getSpec(this.state.data, this.state.telemetryName.split('-')[2])}></Vega>
        )
    }
}
