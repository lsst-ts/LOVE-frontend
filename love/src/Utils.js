import sockette from 'sockette';

export default class ManagerInterface{
    constructor(name,callback){
        this.socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/', {
            onopen: e => this.socket.json({ "option": "subscribe", "data": name }),
            onmessage: callback,
        });
    }    

    unsubscribeToTelemetry = (name, callback) =>{
        this.socket.json({ "option": "unsubscribe", "data": name })
    }
}

export function subscribeToTelemetry(){
    console.log('adsfafds')
}

export function unsubscribeToTelemetry(){
    console.log('adsfafds')
}