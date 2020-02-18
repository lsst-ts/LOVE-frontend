import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppContainer from './App.container';
import * as serviceWorker from './serviceWorker';
import { doGetTokenFromStorage } from './redux/actions/auth';
import { requestGroupSubscription } from './redux/actions/ws';
import { Provider } from 'react-redux';
import store from './redux/store';

store.dispatch(doGetTokenFromStorage());
store.dispatch(requestGroupSubscription('heartbeat-manager-0-stream'));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
