import React, { Component } from 'react';
import './App.css';
import sockette from 'sockette';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';
import RawTelemetryTable from './components/HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import fakeData from './components/HealthStatusSummary/RawTelemetryTable/fakeData';
class App extends Component {

  constructor() {
    super();
    this.state ={
			telemetries: {
				'interestedProposal':{
          parameters: {},
          receptionTimeStamp: "2018/11-23 21:12:24."
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
				name: "interestedProposal",
				parameters: {...data.data},
				receptionTimestamp: timestamp
			}

      this.setState({telemetries: Object.assign(this.state.telemetries, telemetry)});
    }
  }

  render() {
    return (
      <div className="App">
        <RawTelemetryTable data={fakeData} telemetries={this.state.telemetries} web></RawTelemetryTable>
				{/* <TelemetryLog telemetry={{...this.state.telemetry.parameters}} 
											telemetryName={this.state.telemetry.name}></TelemetryLog> */}
      </div>
    );
  }
}

export default App;


