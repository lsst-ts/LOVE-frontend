export const getToken = (state) => state.auth.token;

export const getStreamData = (state, groupName) => {
    return state.ws.subscriptions.filter(s =>s.groupName === groupName)[0].data;
};