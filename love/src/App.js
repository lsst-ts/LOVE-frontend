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
			telemetry: {
				name: "interestedProposal",
				parameters: {},
				receptionTimeStamp: "2018/11-23 21:12:24."
			}
		}
		

    const socket = sockette('ws://localhost:8000/ws/subscription/', {
      onopen: e => socket.json({ "option": "subscribe", "data": this.state.telemetry.name }),
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

      this.setState({telemetry: telemetry});
    }
  }

  render() {
    return (
      <div className="App">
        <RawTelemetryTable data={fakeData} telemetries={{'interestedProposal':this.state.telemetry}}web></RawTelemetryTable>
				<TelemetryLog telemetry={{...this.state.telemetry.parameters}} 
											telemetryName={this.state.telemetry.name}></TelemetryLog>
      </div>
    );
  }
}

export default App;


