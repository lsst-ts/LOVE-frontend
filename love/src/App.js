import React, { Component } from 'react';
import './App.css';
import sockette from 'sockette';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';
import RawTelemetryTable from './components/HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';

class App extends Component {

  constructor() {
    super();
    this.state ={
      telemetryName: "interestedProposal"
		}
		this.data = {
			'scheduler': {
				'domeConfig': {
					'timestamp': '2022/04/25 20:03:10',
					'nParams': 3,
					'parameters': [
						{
							'name': 'Altitude max speed',
							'param_name': 'altitude_maxspeed',
							'data_type': 'double',
							'value': 1,
							'units': 'm/s'
						},
						{
							'name': 'Altitude acceleration',
							'param_name': 'altitude_accel',
							'data_type': 'double',
							'value': 2,
							'units': 'm/s²'
						},
						{
							'name': 'Altitude deceleration',
							'param_name': 'altitude_decel',
							'data_type': 'double',
							'value': 3,
							'units': 'm/s²'
						},
					]
				},
				'cloud': {
					'timestamp': '2022/04/25 20:04:10',
					'nParams': 2,
					'parameters': [
						{
							'name': 'timestamp',
							'param_name': 'timestamp',
							'data_type': 'timestamp',
							'value': '2022/04/25 10:04:10',
							'units': 'YYYY/MM/DD HH:MM:SS'
						},
						{
							'name': 'cloud',
							'param_name': 'cloud',
							'data_type': 'double',
							'value': 2.0,
							'units': '?'
						},
					]
				},
			}
		}

    const socket = sockette('ws://localhost:8000/ws/subscription/', {
      onopen: e => socket.json({ "option": "subscribe", "data": this.state.telemetryName }),
      onmessage: this.receiveMsg,
    });
    socket.onmessage = (e => console.log('Receirewrewrweved:', e));
    window.socket = socket;
  }

  receiveMsg = (msg) => {
    let data = JSON.parse(msg.data);
    if(typeof data.data === 'object'){

      this.setState({ ...data.data});
    }
  }

  render() {
    return (
      <div className="App">
        <RawTelemetryTable data={this.data}></RawTelemetryTable>
				<TelemetryLog telemetry={{...this.state}} 
											telemetryName={this.state.telemetryName}></TelemetryLog>
      </div>
    );
  }
}

export default App;


