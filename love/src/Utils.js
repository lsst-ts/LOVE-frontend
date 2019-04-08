import sockette from 'sockette';

export const hasCommandPrivileges = false;
export const hasFakeData = true;

/* Backwards compatibility of Array.flat */
if (Array.prototype.flat === undefined) {
  // eslint-disable-next-line
  Object.defineProperty(Array.prototype, 'flat', {
    value(depth = 1) {
      return this.reduce(
        (flat, toFlatten) => flat.concat(Array.isArray(toFlatten) && depth - 1 ? toFlatten.flat(depth - 1) : toFlatten),
        [],
      );
    },
  });
}

export default class ManagerInterface {
  constructor() {
    this.callback = null;
    this.socket = null;
    this.socketPromise = null;
    this.subscriptions = [];
    this.connectionIsOpen = false;
  }

  static getApiBaseUrl() {
    return `http://${window.location.hostname}/manager/api/`;
  }

  static getWebsocketsUrl() {
    return `ws://${window.location.hostname}/manager/ws/subscription?token=`;
  }

  static getHeaders() {
    const token = ManagerInterface.getToken();
    if (token) {
      return new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      });
    }
    return new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
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

  static requestToken(username, password) {
    const url = `${this.getApiBaseUrl()}get-token/`;
    const data = {
      username,
      password,
    };
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        const { token } = response;
        if (token !== undefined && token !== null) {
          ManagerInterface.saveToken(token);
        }
        return token;
      });
  }

  static validateToken() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}validate-token/`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server. Logging out\n', response);
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        const { detail } = resp;
        if (detail === 'Token is valid') {
          return true;
        }
        // console.log('Session expired. Logging out');
        this.removeToken();
        return false;
      });
    });
  }

  subscribeToStream = (category, csc, stream, callback) => {
    this.callback = callback;
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not available or invalid, skipping connection');
      return;
    }
    this.subscriptions.push([category, csc, stream]);
    if (this.socketPromise === null && this.socket === null) {
      this.socketPromise = new Promise((resolve) => {
        const connectionPath = ManagerInterface.getWebsocketsUrl() + token;
        // eslint-disable-next-line
        console.log('Openning websocket connection to: ', connectionPath);
        this.socket = sockette(connectionPath, {
          onopen: () => {
            this.connectionIsOpen = true;
            this.subscriptions.forEach((sub) => {
              this.socket.json({
                option: 'subscribe',
                category: sub[0],
                csc: sub[1],
                stream: sub[2],
              });
            });
          },
          onmessage: (msg) => {
            if (this.callback) this.callback(msg);
            resolve();
          },
          onclose: () => {
            this.connectionIsOpen = false;
          },
        });
      });
    } else {
      this.socketPromise.then(() => {
        this.subscriptions.forEach((sub) => {
          this.socket.json({
            option: 'subscribe',
            category: sub[0],
            csc: sub[1],
            stream: sub[2],
          });
        });
      });
    }
  };

  unsubscribeToStream = (category, csc, stream, callback) => {
    const subscriptionKeys = this.subscriptions.map(JSON.stringify);
    const index = subscriptionKeys.indexOf(JSON.stringify([category, csc, stream]));
    if (index > -1) this.subscriptions.splice(index, 1);
    if (this.connectionIsOpen) {
      this.socket.json({
        option: 'unsubscribe',
        category,
        csc,
        stream,
      });
      this.callback = callback;
    }
  };

  subscribeToTelemetry = (csc, stream, callback) => {
    this.subscribeToStream('telemetry', csc, stream, callback);
  };

  unsubscribeToTelemetry = (csc, stream, callback) => {
    this.unsubscribeToStream('telemetry', csc, stream, callback);
  };

  subscribeToEvents = (csc, stream, callback) => {
    this.subscribeToStream('event', csc, stream, callback);
  };

  unsubscribeToEvents = (csc, stream, callback) => {
    this.unsubscribeToStream('event', csc, stream, callback);
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
  Object.keys(telemetries).forEach((csc) => {
    Object.keys(telemetries[csc]).forEach((stream) => {
      Object.entries(telemetries[csc][stream]).forEach((entry) => {
        const key = [csc, stream, entry[0]].join('-');
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
  });

  return newEntries;
};

export const tableRowListToTimeSeriesObject = (selectedRows) => {
  const telemetries = {};

  selectedRows.forEach((row) => {
    const [csc, stream, parameter] = row.key.split('-');
    if (telemetries[csc] === undefined) {
      telemetries[csc] = {};
    }
    if (telemetries[csc][stream] === undefined) {
      telemetries[csc][stream] = {};
    }

    telemetries[csc][stream][parameter] = {
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
  const { dataType } = selectedRows[0].value;
  const stringValues = ['a', 'b', 'c'];
  const telemetries = tableRowListToTimeSeriesObject(selectedRows);
  let timestep = 2000;
  const timeWindow = new Date(dateEnd).getTime() - new Date(dateStart).getTime();
  let arraySize = timeWindow / timestep;
  if (arraySize > 1000) {
    arraySize = 1000;
    timestep = timeWindow / 1000;
  }

  const time = new Array(arraySize);
  const tStart = new Date(dateStart).getTime();
  for (let i = 0; i < arraySize; i += 1) {
    let currentDate = new Date(tStart + i * timestep);
    let dateString = [currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, currentDate.getUTCDate()].join('/');

    currentDate = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
    const hours = currentDate.getHours();
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
          value.value =
            ((Math.cos((dateValue / 24 / 60 / 60 / 1000) * 2 * Math.PI) + 1) / 2) * 0.7 + Math.random() * 0.3;
        }
      });
      return currentValue;
    })
    .flat();
};
