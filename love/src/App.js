import React, { Component } from 'react';
import './App.css';
import sockette from 'sockette';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';
import RawTelemetryTable from './components/HealthStatusSummary/RawTelemetryTable/RawTelemetryTable';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';

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
		
    this.subscribeToTelemetry('all', this.receiveAllMsg);
  }

  subscribeToTelemetry = (name, callback) =>{
    const socket = sockette('ws://'+process.env.REACT_APP_WEBSOCKET_HOST+'/ws/subscription/', {
      onopen: e => socket.json({ "option": "subscribe", "data": name }),
      onmessage: callback,
    });
  }

  receiveAllMsg = (msg) => {
    let data = JSON.parse(msg.data);		
		if(typeof data.data === 'object'){
      
      let newTelemetries = Object.assign({}, this.state.telemetries);
      let timestamp = new Date();
      timestamp = timestamp.toISOString().slice(0,20).replace("-","/").replace("T", " ");
      Object.entries(data.data).forEach((entry)=>{
        console.log(entry);
        let [telemetryName, parameters] = entry;
        let telemetry = {};
        telemetry[telemetryName] = {
          parameters:  parameters,
          receptionTimestamp: timestamp
        }
        Object.assign(newTelemetries, telemetry);
      }, this);
      
      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({telemetries: newTelemetries});
    }
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
        <HealthStatusSummary telemetries={this.state.telemetries}> </HealthStatusSummary>
	   </div>
    );
  }
}

export default App;


			// <TelemetryLog telemetry={{...this.state.telemetry.parameters}} 
				// 							telemetryName={this.state.telemetry.name}></TelemetryLog>
   
