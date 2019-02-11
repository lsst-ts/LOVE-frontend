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
 * @param {Array} parametersKeys 
 * @param {date} timestamp 
 */
export const telemetryObjectToVegaList = (telemetries, selectedRows, timestamp) =>{

    const newEntries = [];

    Object.keys(telemetries).forEach((stream) => {
        Object.entries(telemetries[stream]).forEach((entry) => {
            const key = ['scheduler', stream, entry[0]].join('-');
            if (selectedRows.map((r) => r.key).includes(key)) {
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

};

export const tableRowListToTimeSeriesObject = (selectedRows) =>{
    let telemetries = {};

    selectedRows.forEach((row)=>{
        const [component, stream, parameter] = row.key.split('-');

        if(telemetries[stream] === undefined){
            telemetries[stream] = {}
        }


        telemetries[stream][parameter] = {
            value: row.value.value, 
            dataType: row.value.dataType
        };
    });

    return telemetries;
}

export const getFakeHistoricalTimeSeries = (selectedRows, dateStart, dateEnd) =>{

    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);

    const telemetries = tableRowListToTimeSeriesObject(selectedRows);

    const time = [];
    for(let t = dateStart.getTime(); t<=dateEnd.getTime(); t += 2*1000){
        const currentDate = new Date(t);
        let dateString = [currentDate.toLocaleDateString(undefined, {year:'numeric'}),
        currentDate.toLocaleDateString(undefined, {month:'numeric'}),
        currentDate.toLocaleDateString(undefined, {day:'2-digit'}) ].join('/');

        const dateOffset = (new Date()).getTimezoneOffset()/60;
        const hours = `0${currentDate.getHours()+dateOffset}`.slice(-2);
        const minutes = `0${currentDate.getMinutes()}`.slice(-2);
        const seconds = `0${currentDate.getSeconds()}`.slice(-2);
        dateString += ' '+hours+':'+minutes+':'+seconds;
        time.push(dateString);
    }

    console.log(time);
    return time.map( (t) =>{
        return telemetryObjectToVegaList(telemetries, selectedRows, t);
    }).flat();
};


