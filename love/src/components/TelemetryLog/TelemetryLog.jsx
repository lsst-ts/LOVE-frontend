import React, { Component } from 'react'

export default class TelemetryLog extends Component {

    render() {
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
                            <td> Comp name</td>
                            <td> Tel name</td>
                            <td>{Object.keys(this.props.telemetry).map( 
                                (key)=> <p key={key}>{key}</p>
                            )}</td>
                            <td>
                                {Object.keys(this.props.telemetry).map( 
                                    (key)=> <p key={key}>{this.props.telemetry[key]}</p>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    
                </div>
            </React.Fragment>

        )
    }
}
