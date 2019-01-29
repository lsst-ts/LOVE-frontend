import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import { subscribeToTelemetry } from '../../Utils';
import { unsubscribeToTelemetry } from '../../Utils';
import Vega from '../Vega/Vega';

export default class TimeSeries extends Component {

    constructor() {
        super();

        this.state = {
            telemetryName: "test",
            step: 0,
            lastMessageData : [{
                date: new Date(),
                value: 0,
                source: 1
            }]
            
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
                },
                "color": {
                    "field": "source",
                    "type": "nominal"
                }

            }
        }
    }

    onSetSelection = (selectedRows) => {
        const streams = selectedRows.map((rowKey) => {
            return rowKey.split('-')[1];
        });
        const streamsSet = new Set(streams);
        streamsSet.forEach((stream) => {
            subscribeToTelemetry(stream, this.onReceiveMsg);
        });
        this.setState({
            telemetryName: selectedRows[0],
            subscribedStreams: streamsSet,
            selectedRows: selectedRows,
            step: 1
        });
    }

    componentWillUnmount = () => {
        this.state.subscribedStreams.forEach((stream) => {
            unsubscribeToTelemetry(stream, (msg) => console.log(msg));
        });
    }

    onReceiveMsg = (msg) => {
        let data = JSON.parse(msg.data);
        let newEntries = [];
        if (typeof data.data === 'object') {
            let timestamp = new Date();
            timestamp = timestamp.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
            Object.keys(data.data).forEach((stream) => {
                Object.entries(data.data[stream]).forEach((entry) => {
                    const key = ['scheduler', stream, entry[0]].join('-');
                    // console.log(key, this.state.selectedRows);
                    // console.log(this.state.selectedRows.includes(key));
                    if (this.state.selectedRows.includes(key)) {
                        const newEntry = {
                            "value": entry[1],
                            "date": timestamp,
                            "source": key
                        }
                        newEntries.push(newEntry);
                    }
                });
            });
            this.setState({
                lastMessageData: newEntries,
            })
        }
    }
    render() {
        return (
            this.state.step === 0 ?
                <RawTelemetryTable telemetries={this.props.telemetries} {...this.state} displaySelectionColumn checkedFilterColumn='units' onSetSelection={this.onSetSelection}></RawTelemetryTable>
                :
                <Vega spec={this.getSpec(this.state.data, this.state.telemetryName.split('-')[2])}
                      lastMessageData={this.state.lastMessageData}></Vega>
        )
    }
}

