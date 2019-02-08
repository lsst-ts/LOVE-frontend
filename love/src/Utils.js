import sockette from 'sockette';

export default class ManagerInterface {
    constructor(name, callback) {
        this.callback = callback;
        this.socket = null;
        this.socketPromise = null;
    }

    subscribeToTelemetry = (name, callback) => {
        this.callback = callback;
        if (this.socketPromise === null && this.socket === null) {
            this.socketPromise = new Promise((resolve, reject) => {
                this.socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
                    onopen: e => this.socket.json({ "option": "subscribe", "data": name }),
                    onmessage: (msg) => {
                        this.callback(msg);
                        resolve();
                    },
                });
                console.log(this.socket)
            })
        }
        else{
            this.socketPromise.then(() => {
                this.socket.json({ "option": "subscribe", "data": name });
            });

        }
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