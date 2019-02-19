import sockette from 'sockette';

/* Backwards compatibility of Array.flat */
if (Array.prototype.flat === undefined) {
  Object.defineProperty(Array.prototype, 'flat', {
    value(depth = 1) {
      return this.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) && depth - 1 ? toFlatten.flat(depth - 1) : toFlatten), []);
    },
  });
}

export default class ManagerInterface {
  constructor(name, callback) {
    this.callback = callback;
    this.socket = null;
    this.socketPromise = null;
  }

  static getHeaders() {
    const token = ManagerInterface.getToken();
    if (token) {
      return new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      });
    } else {
      return new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });
    }
  }

  static getToken() {
    const token = localStorage.getItem('LOVE-TOKEN');
    if (token === null) {
      return null;
    }
    return JSON.parse(token);
  }

  static removeToken() {
    localStorage.removeItem('LOVE-TOKEN');
  }

  static saveToken(token) {
    if (token === null) {
      return false;
    }
    localStorage.setItem('LOVE-TOKEN', JSON.stringify(token));
    return true;
  }

  static requestToken(username: string, password: string) {
    const url = 'http://' + process.env.REACT_APP_WEBSOCKET_HOST + '/manager/api/get-token/';
    const data = {
      username: username,
      password: password
    }
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(response => {
        const token = response['token'];
        if (token !== undefined && token !== null) {
          ManagerInterface.saveToken(token);
          return true;
        } else {
          return false;
        }
      }
    );
  }

  static validateToken() {
    console.log('------------ Validating token');
    const token = ManagerInterface.getToken();
    if (token === null) {
      console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = 'http://' + process.env.REACT_APP_WEBSOCKET_HOST + '/manager/api/validate-token/';
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    })
    .then(response => response.json())
    .then(response => {
      const detail = response['detail'];
      if (detail === 'Token is valid') {
        console.log('valid token');
        return true;
      } else {
        console.log('invalid token');
        this.removeToken();
        return false;
      }
    })
    .catch((error) => {
      console.log('Got error: ', error);
      console.error(error);
    });
  }

  subscribeToTelemetry = (name, callback) => {
    this.callback = callback;
    const token = ManagerInterface.getToken();
    if (token === null) {
      console.log('Token not available or invalid, skipping connection');
      return;
    }
    if (this.socketPromise === null && this.socket === null) {
      this.socketPromise = new Promise((resolve) => {
        const connectionPath = `ws://${process.env.REACT_APP_WEBSOCKET_HOST}/manager/ws/subscription?token=${token}`;
        console.log('Openning websocket connection to: ', connectionPath);
        this.socket = sockette(connectionPath, {
          onopen: () => {
            this.socket.json({
              option: 'subscribe',
              data: name,
            });
          },
          onmessage: (msg) => {
            this.callback(msg);
            resolve();
          },
        });
      });
    } else {
      this.socketPromise.then(() => {
        this.socket.json({
          option: 'subscribe',
          data: name,
        });
      });
    }
  };

  unsubscribeToTelemetry = (name, callback) => {
    this.socket.json({
      option: 'unsubscribe',
      data: name,
    });
    this.callback = callback;
  };
}

/**
 * Creates a list of vega friendly objects with values
 * for each parameter in parametersNames extracted from a
 * telemetries object received from the LOVE-manager
 * @param {object} telemetries
 * @param {Array} parametersNames
 * @param {date} timestamp
 */
export const telemetryObjectToVegaList = (telemetries, parametersNames, timestamp) => {
  const newEntries = [];

  Object.keys(telemetries).forEach((stream) => {
    Object.entries(telemetries[stream]).forEach((entry) => {
      const key = ['scheduler', stream, entry[0]].join('-');
      if (parametersNames.map((r) => r.key).includes(key)) {
        const newEntry = {
          value: Array.isArray(entry[1].value) ? entry[1].value[0] : entry[1].value,
          date: timestamp,
          source: key.split('-')[2],
          dataType: entry[1].dataType,
        };
        newEntries.push(newEntry);
      }
    });
  });

  return newEntries;
};

export const tableRowListToTimeSeriesObject = (selectedRows) => {
  const telemetries = {};

  selectedRows.forEach((row) => {
    const [, stream, parameter] = row.key.split('-');

    if (telemetries[stream] === undefined) {
      telemetries[stream] = {};
    }

    telemetries[stream][parameter] = {
      value: row.value.value,
      dataType: row.value.dataType,
    };
  });

  return telemetries;
};

/**
 * Returns the value for a fake unit name, based on the name of a telemetry
 * @param {string} name
 */
export const getFakeUnits = (name) => {
  const fakeUnits = ['unit1', 'unit2', 'unit3', 'unit4'];
  return fakeUnits[name.charCodeAt(0) % 4];
};

export const getFakeHistoricalTimeSeries = (selectedRows, dateStart, dateEnd) => {
  const dataType = selectedRows[0].value.dataType;
  const stringValues = ['a', 'b', 'c'];
  const telemetries = tableRowListToTimeSeriesObject(selectedRows);
  let timestep = 2000;
  let arraySize = (new Date(dateEnd).getTime() - new Date(dateStart).getTime()) / timestep;
  if (arraySize > 1000) {
    arraySize = 1000;
    timestep = (new Date(dateEnd).getTime() - new Date(dateStart).getTime()) / arraySize;
  }
  const time = new Array(arraySize);
  const tStart = new Date(dateStart).getTime();
  const dateOffset = new Date().getTimezoneOffset() / 60;
  for (let i = 0; i < arraySize; i += 1) {
    const currentDate = new Date(tStart + i * timestep);
    let dateString = [currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, currentDate.getUTCDate()].join('/');

    const hours = currentDate.getHours() + dateOffset;
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    dateString += ` ${hours}:${minutes}:${seconds}`;
    time[i] = dateString;
  }

  return time
    .map((t) => {
      const currentValue = telemetryObjectToVegaList(telemetries, selectedRows, t);
      const dateValue = new Date(t).getTime();

      currentValue.forEach((value) => {
        if (dataType === 'String') {
          // eslint-disable-next-line
          value.value = stringValues[Math.floor(Math.random() * stringValues.length)];
        } else {
          // eslint-disable-next-line
          value.value = ((Math.cos((dateValue / 24 / 60 / 60 / 1000) * 2 * Math.PI) + 1) / 2) * 0.7 + Math.random() * 0.3;
        }
      });
      return currentValue;
    })
    .flat();
};
