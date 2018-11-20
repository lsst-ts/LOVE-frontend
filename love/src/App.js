import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import sockette from 'sockette';

class App extends Component {

  constructor() {
    super();
    // this.socket = openSocket('ws://localhost:8000/ws/subscription/');
    const socket = sockette('ws://localhost:8000/ws/subscription/', {
      onopen: e => socket.json({"option": "subscribe", "data": "avoidanceRegions"}),
      onmessage: (e => console.log('Received:', e)),
    });
    socket.onmessage = (e => console.log('Received:', e));
  }

  receiveMsg(msg){
    console.log(msg);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
