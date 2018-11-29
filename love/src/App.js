import React, { Component } from 'react';
import './App.css';
import sockette from 'sockette';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';
import RawTelemetryTable from './components/HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
class App extends Component {

  constructor() {
    super();
    this.state ={
			telemetries: {
				'interestedProposal':{
          parameters: {},
          receptionTimeStamp: "2018/11/23 21:12:24."
        },
        "bulkCloud": {
          parameters: {
            "bulkCloud": 0.6713680575252166,
          "timestamp": 0.5309269973966433
          },
          receptionTimeStamp: "2018/11/25 12:21:12"
        }
			}
		}
		
    const socket = sockette('ws://localhost:8000/ws/subscription/', {
      onopen: e => socket.json({ "option": "subscribe", "data": 'interestedProposal' }),
      onmessage: this.receiveMsg,
    });
    socket.onmessage = (e => console.log('Receirewrewrweved:', e));
    window.socket = socket;
  }

  receiveMsg = (msg) => {
    let data = JSON.parse(msg.data);		
		if(typeof data.data === 'object'){
			let timestamp = new Date();
			timestamp = timestamp.toISOString().slice(0,20).replace("-","/").replace("T", " ");

			let telemetry = {
				"interestedProposal":{
          parameters: {...data.data},
          receptionTimestamp: timestamp
        }
      }
      let newTelemetries = Object.assign({}, this.state.telemetries, telemetry);
      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({telemetries: newTelemetries});
    }
  }

  render() {
    return (
      <div className="App">
        <RawTelemetryTable telemetries={this.state.telemetries} web></RawTelemetryTable>
				{/* <TelemetryLog telemetry={{...this.state.telemetry.parameters}} 
											telemetryName={this.state.telemetry.name}></TelemetryLog> */}
      </div>
    );
  }
}

export default App;


