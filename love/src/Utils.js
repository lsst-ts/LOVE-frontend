import sockette from 'sockette';

export function subscribeToTelemetry(name, callback) {
    const socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
        onopen: e => socket.json({ "option": "subscribe", "data": name }),
        onmessage: callback,
    });
};

export function unsubscribeToTelemetry(name, callback) {
    const socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
        onopen: e => socket.json({ "option": "unsubscribe", "data": name }),
        onmessage: callback,
    });
};
