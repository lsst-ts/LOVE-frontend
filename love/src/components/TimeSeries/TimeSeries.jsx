import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import ManagerInterface, {telemetryObjectToVegaList, getFakeHistoricalTimeSeries} from '../../Utils';
import Vega from '../Vega/Vega';

export default class TimeSeries extends Component {

    constructor() {
        super();

        this.state = {
            specDataType: "quantitative",
            telemetryName: "test",
            step: 0,
            lastMessageData: []
        }

        this.managerInterface = new ManagerInterface();

        this.historicalData = [];
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
                    "title": name
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
        if (typeof data.data === 'object') {
            let timestamp = new Date();
            timestamp = timestamp.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
            const newEntries = telemetryObjectToVegaList(data.data, this.state.selectedRows, timestamp)
            this.setState({
                lastMessageData: newEntries,
            })
        }
    }

    componentDidUpdate = (prevProps, prevState) =>{
        if(prevState.step !== this.state.step && this.state.step === 1){

            this.historicalData = getFakeHistoricalTimeSeries(
                                this.state.selectedRows, 
                                (new Date()).getTime() - 360 * 1000,
                                new Date());
            console.log(this.historicalData);
        }
    }
    render() {
        const columnsToDisplay = ['selection_column', 'component', 'stream', 'name', 'param_name', 'data_type', 'value', 'units'];
        return (
            this.state.step === 0 ?
                <RawTelemetryTable telemetries={this.props.telemetries} {...this.state} columnsToDisplay={columnsToDisplay} checkedFilterColumn='units' onSetSelection={this.onSetSelection}></RawTelemetryTable>
                :
                <>
                    <h1>Plot title</h1>
                    <Vega spec={this.getSpec(this.state.lastMessageData, this.state.telemetryName.split('-')[2])}
                        lastMessageData={this.state.lastMessageData}
                        dateStart={(new Date()).getTime() - 360 * 1000}
                        dateEnd={new Date()}
                        historicalData={this.historicalData}></Vega>
                </>
        )
    }
}

