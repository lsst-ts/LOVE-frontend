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
      this.socketPromise = new Promise((resolve) => {
        this.socket = sockette(`ws://${process.env.REACT_APP_WEBSOCKET_HOST}/ws/subscription/`, {
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
  const telemetries = tableRowListToTimeSeriesObject(selectedRows);

  const arraySize = (new Date(dateEnd).getTime() - new Date(dateStart).getTime()) / 2000;
  const time = new Array(arraySize);
  const tStart = new Date(dateStart).getTime();
  const dateOffset = new Date().getTimezoneOffset() / 60;
  for (let i = 0; i < arraySize; i += 1) {
    const currentDate = new Date(tStart + i * 2000);
    let dateString = [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getUTCDate()].join('/');

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
        // eslint-disable-next-line
        value.value = (Math.cos(((dateValue / 45) * Math.PI) / 360) + 1) / 2 - 0.3 + Math.random() * 0.3;
      });
      return currentValue;
    })
    .flat();
};
