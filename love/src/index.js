/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Simulator from 'websocket-playback';
import { WEBSOCKET_SIMULATION, WEBSOCKET_SIMULATION_FILE, SUBPATH } from 'Config.js';
import AppContainer from './App.container';
import ConfirmationModal from './components/GeneralPurpose/ConfirmationModal/ConfirmationModal';
import * as serviceWorker from './serviceWorker';
import { doGetTokenFromStorage } from './redux/actions/auth';
import store from './redux/store';
import { getWebSocket } from './redux/selectors';
import './index.css';

store.dispatch(doGetTokenFromStorage());

/**
 * Replaces the behavior of window.confirm(message) whenever
 * there is an URL change in BrowserRouter
 * @param {string} message to be displayed
 * @param {func} callback, used by BrowserRouter
 *  calling with true will confirm the url change
 *  calling with false will block it
 *  must be used as `callback(window.confirm(message))`
 */
const getUserConfirmation = (message, callback) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const closeModal = (allowUrlChange) => {
    ReactDOM.unmountComponentAtNode(container);
    callback(allowUrlChange);
  };

  ReactDOM.render(
    <ConfirmationModal
      isOpen={true}
      message={message}
      confirmText="Confirm"
      cancelText="Cancel"
      confirmCallback={() => closeModal(true)}
      cancelCallback={() => closeModal(false)}
    />,
    container,
  );
};

if (WEBSOCKET_SIMULATION) {
  const interval = setInterval(() => {
    const webSocket = getWebSocket(store.getState());
    if (webSocket !== null && webSocket.ws && webSocket.ws.onmessage) {
      const sim = new Simulator();
      sim.runSimulation(`/websocket-simulations/${WEBSOCKET_SIMULATION_FILE}`, 200, webSocket.ws.onmessage);
      clearInterval(interval);
    }
  }, 500);
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={SUBPATH} getUserConfirmation={getUserConfirmation}>
      <AppContainer />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
