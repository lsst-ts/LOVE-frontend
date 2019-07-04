import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { requestSALCommand, openWebsocketConnection } from '../actions/ws';

import { SALCommandStatus } from '../actions/ws';
import { getLastSALCommand, getScriptHeartbeats } from '../selectors';

let store, server;
beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  // prevent fetch call for token
  localStorage.setItem('LOVE-TOKEN', 'love-token');
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
  await store.dispatch(openWebsocketConnection());
});

afterEach(() => {
  server.close();
});

it('Should send a command to the server and save it on the state properly', async () => {
  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    component: 'ATDome',
  };

  await store.dispatch(requestSALCommand(commandObject));

  await expect(server).toReceiveMessage({ option: 'cmd', type: 'command_data', ...commandObject });

  expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.REQUESTED,
    ...commandObject,
  });
});

it('Should receive a Script Heartbeat from the server and save it on the state properly', async () => {
  const serverMessage = {
    data: {
      ScriptHeartbeats: {
        stream: {
          script_heartbeat: {
            salindex: 100017,
            lost: 1,
            last_heartbeat_timestamp: 1562258576.477827
          }
        },
      },
    },
    category: 'event',
  };
  server.send(serverMessage);
  const heartbeatsState = getScriptHeartbeats(store.getState());
  const expectedState = [
    {
      salindex: 100017,
      lost: 1,
      last_heartbeat_timestamp: 1562258576.477827
    }
  ];
  expect(JSON.stringify(heartbeatsState)).toEqual(JSON.stringify(expectedState));
});
