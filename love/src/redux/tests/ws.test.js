import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { requestSALCommand, openWebsocketConnection } from '../actions/ws';

import { SALCommandStatus } from '../actions/ws';
import { getLastSALCommand } from '../selectors';

let store, server;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  // prevent fetch call for token
  localStorage.setItem('LOVE-TOKEN', 'love-token');
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
});

it('Should save the token in localstorage and the store, and set status=RECEIVED when fetched OK', async () => {
  await store.dispatch(
    requestSALCommand({
      cmd: 'cmd_closeShutter',
      params: {},
      component: 'ATDome',
    }),
  );

  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    component: 'ATDome',
  };

  await expect(server).toReceiveMessage({ option: 'cmd', type: 'command_data', ...commandObject });

  expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.REQUESTED,
    ...commandObject,
  });
});
