import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import ManagerInterface from '../../Utils';

import { validateToken } from '../actions/auth';

let store, server;
beforeEach(() => {
  fetch.resetMocks()
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  localStorage.setItem('LOVE-TOKEN', '"love-token"');
  server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
});

afterEach(() => {
  localStorage.removeItem('LOVE-TOKEN');
});

it('Should not change the token state when the token is valid', async () => {

  const url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
  fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));

  let r;
  const a = async ()=>{r = fetch('https://google.com').then(res => res.json());}
  await a();
  console.log(r);
  
  // const originalState = store.getState();
  // store.dispatch(openWebsocketConnection());
  // store.dispatch(validateToken());

  // server.send({
  //   status: 200,


  // })
  // const newState = store.getState();
});
