import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import ManagerInterface, { telemetryObjectToVegaList } from '../../Utils';
import Vega from '../Vega/Vega';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import moment from 'moment'
import { getFakeUnits } from '../../Utils'

export default class TimeSeries extends Component {

    constructor() {
        super();

        this.state = {
            specDataType: "quantitative",
            telemetryName: "test",
            step: 0,
            lastMessageData: [],
            dateStart: new Date().getTime() - 60 * 1000,
            dateEnd: new Date(),
            liveMode: true,
            timeWindow: {
                id: "1min",
                value: 1,
                unit: "minutes"
            }
        }

        this.managerInterface = new ManagerInterface();
    }

    getSpec = (data, name) => {
        return {
            "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
            "description": "Google's stock price over time.",
            "data": {
                "values": data,
                "name": "telemetries"
            },
            "mark": this.state.specDataType === "quantitative" ? "line" : "point",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "title": "date"
                },
                "y": {
                    "field": "value",
                    "type": this.state.specDataType,
                    "title": getFakeUnits(name)
                },
                "color": {
                    "field": "source",
                    "type": "nominal",
                    "legend": {
                        "title": "Parameter Names" + " ".repeat(32),
                    },
                }

            }
        }
    }

    getSpecDataType = (dataType) => {
        if (dataType === 'String')
            return "nominal";
        else
            return "quantitative";
    }

    onSetSelection = (selectedRows) => {
        const streams = selectedRows.map((rowKeyValue) => {
            return rowKeyValue.key.split('-')[1];
        });
        const streamsSet = new Set(streams);
        streamsSet.forEach((stream) => {
            this.managerInterface.subscribeToTelemetry(stream, this.onReceiveMsg);
        });
        this.setState({
            telemetryName: selectedRows[0].key,
            specDataType: this.getSpecDataType(selectedRows[0].value.dataType),
            subscribedStreams: streamsSet,
            selectedRows: selectedRows,
            step: 1
        });
    }

    componentWillUnmount = () => {
        this.state.subscribedStreams.forEach((stream) => {
            this.managerInterface.unsubscribeToTelemetry(stream, (msg) => console.log(msg));
        });
    }

    onReceiveMsg = (msg) => {
        let data = JSON.parse(msg.data);
        let dateEnd = new Date();
        let dateStart = moment(dateEnd).subtract(this.state.timeWindow.value, this.state.timeWindow.unit).toDate()
        if (typeof data.data === 'object') {
            let timestamp = new Date();
            timestamp = timestamp.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
            const newEntries = telemetryObjectToVegaList(data.data, this.state.selectedRows, timestamp);
            this.setState({
                lastMessageData: newEntries,
                dateStart: dateStart,
                dateEnd: dateEnd,
            });
        }
    }

    setTimeWindow = (timeWindow) => {
        this.setState({
            timeWindow: timeWindow,
        })
    }

    render() {
        const columnsToDisplay = ['selection_column', 'component', 'stream', 'name', 'param_name', 'data_type', 'value', 'units'];
        return (
            this.state.step === 0 ?
                <RawTelemetryTable telemetries={this.props.telemetries} {...this.state} columnsToDisplay={columnsToDisplay} checkedFilterColumn='units' onSetSelection={this.onSetSelection}></RawTelemetryTable>
                :
                <>
                    <h1>Plot title</h1>
                    <TimeSeriesControls liveMode={this.state.liveMode} setTimeWindow={this.setTimeWindow} timeWindow={this.state.timeWindow}></TimeSeriesControls>
                    <Vega spec={this.getSpec(this.state.lastMessageData, this.state.telemetryName.split('-')[2])}
                        lastMessageData={this.state.lastMessageData}
                        dateStart={this.state.dateStart}
                        dateEnd={this.state.dateEnd}></Vega>
                </>
        )
    }
}

