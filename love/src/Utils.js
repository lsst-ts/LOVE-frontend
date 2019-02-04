import sockette from 'sockette';
let socket;
export function subscribeToTelemetry(name, callback) {
    socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
        onopen: e => socket.json({ "option": "subscribe", "data": name }),
        onmessage: callback,
    });
};

export function unsubscribeToTelemetry(name, callback) {
    // socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
    //     onopen: e => socket.json({ "option": "unsubscribe", "data": name }),
    //     onmessage: callback,
    // });
    socket.json({ "option": "unsubscribe", "data": name })
};
