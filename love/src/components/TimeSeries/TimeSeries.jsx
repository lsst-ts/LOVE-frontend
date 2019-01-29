import React, { Component } from 'react'
import RawTelemetryTable from '../HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import Vega from '../Vega/Vega';

export default class TimeSeries extends Component {

    constructor() {
        super();

        this.state = {
            telemetryName: "test",
            step: 0,
            date: new Date(),
            value: 0
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

    newGenerator = () => {
        var counter = -1;
        var previousY = [5, 5, 5, 5];
        return function () {
            counter++;
            const newVal = Math.cos(5*counter*Math.PI/180) + Math.random()*0.5;
            let date = new Date();;
            date = new Date(date.valueOf() + 1000000*counter-17.7*60*60*1000)
            return {
                date: date,
                value: newVal
            };
        };
    }

    componentDidMount = () =>{
        const valueGenerator =  this.newGenerator();
        window.setInterval( () => {
            const newVal = valueGenerator();
            this.setState({
                date: newVal.date,
                value: newVal.value
            });                
        }, 100);        
    }

    render() {
        return (
            this.state.step === 1 ?
                <RawTelemetryTable telemetries={this.props.telemetries} {...this.state} displaySelectionColumn checkedFilterColumn='units' onSetSelection={this.onSetSelection}></RawTelemetryTable>
                :
                <Vega spec={this.getSpec(this.state.data, this.state.telemetryName.split('-')[2])}
                      date={this.state.date} value={this.state.value}></Vega>
        )
    }
}
