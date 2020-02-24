import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppContainer from './App.container';
import ConfirmationModal from './components/GeneralPurpose/ConfirmationModal/ConfirmationModal';
import * as serviceWorker from './serviceWorker';
import { doGetTokenFromStorage } from './redux/actions/auth';
import { requestGroupSubscription } from './redux/actions/ws';
import { Provider } from 'react-redux';
import store from './redux/store';

store.dispatch(doGetTokenFromStorage());
store.dispatch(requestGroupSubscription('heartbeat-manager-0-stream'));

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
      confirmText="Accept"
      cancelText="Cancel"
      confirmCallback={() => closeModal(true)}
      cancelCallback={() => closeModal(false)}
    />,
    container,
  );
};
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter getUserConfirmation={getUserConfirmation}>
      <AppContainer />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
