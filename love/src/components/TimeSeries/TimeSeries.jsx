import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import { subscribeToTelemetry } from '../../Utils';
import { unsubscribeToTelemetry } from '../../Utils';
import Vega from '../Vega/Vega';

export default class TimeSeries extends Component {

    constructor() {
        super();

        const fakeData = [
            {
                "value": 0.07488591422473134,
                "date": "Mon Jan 28 2019 17:11:47 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.5245901947239993,
                "date": "Mon Jan 28 2019 17:11:49 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.047757761098165874,
                "date": "Mon Jan 28 2019 17:11:51 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.9885446210571569,
                "date": "Mon Jan 28 2019 17:11:53 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.6206922871313166,
                "date": "Mon Jan 28 2019 17:11:56 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.8991292952427338,
                "date": "Mon Jan 28 2019 17:11:58 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.15595247737027262,
                "date": "Mon Jan 28 2019 17:12:00 GMT-0300 (Chile Summer Time)",
                "source": "source1"
            },
            {
                "value": 0.9845770842404732,
                "date": "Mon Jan 28 2019 17:12:02 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.5536720601516104,
                "date": "Mon Jan 28 2019 17:12:04 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.5664039246421997,
                "date": "Mon Jan 28 2019 17:12:06 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.9389258470247447,
                "date": "Mon Jan 28 2019 17:12:08 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.8902830351586631,
                "date": "Mon Jan 28 2019 17:12:10 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.3102594952440675,
                "date": "Mon Jan 28 2019 17:12:12 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.04128383319263551,
                "date": "Mon Jan 28 2019 17:12:14 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
            {
                "value": 0.7105892406862067,
                "date": "Mon Jan 28 2019 17:12:16 GMT-0300 (Chile Summer Time)",
                "source": "source2"
            },
        ]
        this.state = {
            telemetryName: "test",
            step: 0,
            data: fakeData,
            lastMessageData: [
                {
                    "value": 0.15595247737027262,
                    "date": "Mon Jan 28 2019 17:12:00 GMT-0300 (Chile Summer Time)",
                    "source": "source1"
                },
                {
                    "value": 0.9845770842404732,
                    "date": "Mon Jan 28 2019 17:12:02 GMT-0300 (Chile Summer Time)",
                    "source": "source2"
                }
            ]
        }
    }

    getSpec = (data, name) => {
        return {
            "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
            "description": "Google's stock price over time.",
            "data": {
                "values": data,
                "name": "asdsas"
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
                <Vega spec={this.getSpec(this.state.data, this.state.telemetryName.split('-')[2])}></Vega>
        )
    }
}
