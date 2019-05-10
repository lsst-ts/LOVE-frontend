import { OPEN_WS_CONNECTION, CHANGE_WS_STATE } from '../actions/actionTypes';
import  ManagerInterface, {sockette} from '../../Utils';

export const connectionStates = {
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ERROR: 'ERROR',
};

let ws;

const changeWebsocketConnectionState = (connectionState) => ({
  type: CHANGE_WS_STATE,
  connectionState
});

/**
 * Opens a new websocket connection assuming:
 * - authentication with backend went ok
 * - it does not matter if it was or was not connected before
 */
export const openWebsocketConnection = ()=> {
  const token = ManagerInterface.getToken();
  
  const connectionPath = ManagerInterface.getWebsocketsUrl() + token;

  return (dispatch, getState) => {
    changeWebsocketConnectionState(connectionStates.OPENING)

    ws = sockette(connectionPath, {
      onopen: () => {
        dispatch(changeWebsocketConnectionState(connectionStates.OPEN));
      },
      onmessage: (msg) => console.log(msg),
      onclose: () => console.log('closed'),
      onerror: () => console.log('error'),
    });
  };
}
