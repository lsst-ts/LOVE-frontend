import sockette from 'sockette';

export default class ManagerInterface {
    constructor(name, callback) {
        this.callback = callback;
        this.socket = null;
    }

    subscribeToTelemetry = (name, callback) => {
        this.callback = callback;
        if (this.socket === null){
            this.socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
                onopen: e => this.socket.json({ "option": "subscribe", "data": name }),
                onmessage: this.callback,
            });
            return;
        }
        this.socket.json({ "option": "subscribe", "data": name })
    }

    unsubscribeToTelemetry = (name, callback) => {
        this.socket.json({ "option": "unsubscribe", "data": name })
        this.callback = callback;
    }
}

export function subscribeToTelemetry() {
    console.log('adsfafds')
}

export function unsubscribeToTelemetry() {
    console.log('adsfafds')
}