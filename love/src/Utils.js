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

/**
 * Creates a list of vega friendly objects with values 
 * for each parameter in parametersNames extracted from a 
 * telemetries object received from the LOVE-manager
 * @param {object} telemetries 
 * @param {Array} parametersNames 
 * @param {date} timestamp 
 */
export const telemetryObjectToVegaList = (telemetries, parametersNames, timestamp) =>{

    const newEntries = [];

    Object.keys(telemetries).forEach((stream) => {
        Object.entries(telemetries[stream]).forEach((entry) => {
            const key = ['scheduler', stream, entry[0]].join('-');
            if (parametersNames.map((r) => r.key).includes(key)) {
                const newEntry = {
                    "value": Array.isArray(entry[1].value) ? entry[1]['value'][0]: entry[1]['value'],
                    "date": timestamp,
                    "source": key.split('-')[2],
                    "dataType": entry[1]['dataType'],
                }
                newEntries.push(newEntry);
            }
        });
    });

    return newEntries;

}