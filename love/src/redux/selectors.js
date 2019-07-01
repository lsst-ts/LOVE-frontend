export const getToken = (state) => state.auth.token;

export const getTokenStatus = (state) => state.auth.status;

export const getStreamData = (state, groupName) => {
  return state.ws.subscriptions.filter((s) => s.groupName === groupName)[0].data;
};

export const getCameraState = (state) => {
  return state.camera;
};

export const getLastSALCommand = (state) => {
  return state.ws.lastSALCommand;
}