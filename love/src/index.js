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
