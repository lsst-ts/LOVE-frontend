import React, { Component } from 'react'

export default class TelemetryLog extends Component {

    render() {
       
        const ntelemetry = Object.keys(this.props.telemetry).length+1;

        return (
            <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <th> Component</th>
                            <th>Telemetry</th>
                            <th>Parameter</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td rowSpan={ntelemetry.toString()}> Scheduler</td>
                            <td rowSpan={ntelemetry.toString()}> interestedProposal</td>
                            
                        </tr>   
                        {Object.keys(this.props.telemetry).map(
                                (key) =>{
                                    let value = this.props.telemetry[key];
                                    if (Array.isArray(value) ){
                                        value = value.join(",   ");
                                    }
                                    return <tr key={key}>
                                                <td >{key}</td> 
                                                <td> {value}</td> 
                                            </tr>;
                                } 
                        )}

                    </tbody>
                </table>
                <div>

                </div>
            </React.Fragment>

        )
    }
}
