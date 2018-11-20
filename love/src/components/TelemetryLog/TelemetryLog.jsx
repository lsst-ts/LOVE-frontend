import React, { Component } from 'react'

export default class TelemetryLog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            log: ['a','b','1'],
        };
    }



    render() {
        // console.log(Object.keys(this.props.telemetry))
        return (
            <div>
                {/* {this.props.data.map((x) => <p key={x}>{x}</p>)} */}
                {Object.keys(this.props.telemetry).map((x) => <p key={x}>{x}: {this.props.telemetry[x]}</p>)}
                {this.props.scale}
            </div>
        )
    }
}
