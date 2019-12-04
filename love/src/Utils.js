import React, { useState } from 'react';

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

export const sockette = (url, optsPar) => {
  /**
   MIT License
Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

  function noop() {}
  const opts = optsPar || {};

  let ws;
  let num = 0;
  const $ = {};
  const max = opts.maxAttempts || Infinity;
  let t;

  $.open = () => {
    ws = new WebSocket(url, opts.protocols || []);

    ws.onmessage = opts.onmessage || noop;

    ws.onopen = (e) => {
      (opts.onopen || noop)(e);
      num = 0;
    };

    ws.onclose = (e) => {
      // eslint-disable-next-line
      e.code === 1e3 || e.code === 1005 || $.reconnect(e);
      (opts.onclose || noop)(e);
    };

    ws.onerror = (e) => {
      // eslint-disable-next-line
      e && e.code === 'ECONNREFUSED' ? $.reconnect(e) : (opts.onerror || noop)(e);
    };
  };

  $.reconnect = (e) => {
    if (max >= num) {
      num += 1;
      t = setTimeout(() => {
        (opts.onreconnect || noop)(e);
        $.open();
      }, opts.timeout || 1e3);
    } else (opts.onmaximum || noop)(e);
  };

  $.json = (x) => {
    ws.send(JSON.stringify(x));
  };

  $.send = (x) => {
    ws.send(x);
  };

  $.close = (x, y) => {
    clearTimeout(t);
    if (x === 4000) {
      ws.onclose = (e) => (opts.onclose || noop)(e);
      ws.onerror = (e) => (opts.onerror || noop)(e);
    }
    ws.close(x, y);
  };

  $.open(); // init

  return $;
};

export default class ManagerInterface {
  constructor() {
    this.callback = null;
    this.socket = null;
    this.socketPromise = null;
    this.subscriptions = [];
    this.connectionIsOpen = false;
  }

  static getApiBaseUrl() {
    return `http://${window.location.host}/manager/api/`;
  }

  static getUifBaseUrl() {
    return `http://${window.location.host}/manager/ui_framework/`;
  }

  static getWebsocketsUrl() {
    return `ws://${window.location.host}/manager/ws/subscription?token=`;
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
    return token;
  }

  static removeToken() {
    localStorage.removeItem('LOVE-TOKEN');
  }

  static saveToken(token) {
    if (token === null) {
      return false;
    }
    localStorage.setItem('LOVE-TOKEN', token);
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

  logout = () => {
    if (this.socket) this.socket.close(4000);
    this.socket = null;
    this.socketPromise = null;
  };

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
            resolve();
          },
          onmessage: (msg) => {
            if (this.callback) this.callback(msg);
          },
          onclose: () => {
            this.connectionIsOpen = false;
            resolve();
          },
          onerror: () => {
            resolve();
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

export const saveGroupSubscriptions = (Component) => {
  return () => {
    const [subscriptionsList, setSubscriptionsList] = useState([]);

    const saveSubscriptionLocally = (groupName) => {
      if (!subscriptionsList.includes(groupName)) {
        setSubscriptionsList([...subscriptionsList, groupName]);
      }
    };

    const removeSubscriptionLocally = (groupName) => {
      setSubscriptionsList(subscriptionsList.filter((name) => name !== groupName));
    };

    return (
      <Component
        subscriptionsList={subscriptionsList}
        saveSubscriptionLocally={saveSubscriptionLocally}
        removeSubscriptionLocally={removeSubscriptionLocally}
      />
    );
  };
};

export const flatMap = (a, cb) => [].concat(...a.map(cb));

export const timeDifference = (current, previous) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return '< 1 minute ago';
  }
  if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} minutes ago`;
  }
  if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} hours ago`;
  }
  if (elapsed < msPerMonth) {
    return `approximately ${Math.round(elapsed / msPerDay)} days ago`;
  }
  return `approximately ${Math.round(elapsed / msPerMonth)} months ago`;
};

export const timeDiff = (t1, t2) => {
  const future = t1 > t2;
  const diff = future? new Date(new Date(t2) - new Date(t1)) : new Date(new Date(t1) - new Date(t2));
  const hour = diff.getUTCHours();
  const min = diff.getUTCMinutes();
  const sec = diff.getUTCSeconds();
  const day = diff.getUTCDate() - 1;
  const diffStr = day + " days " + hour + "h " + min + "m " + sec + 's';
  return future? 'in ' + diffStr : diffStr + ' ago';

  // const msPerMinute = 60 * 1000;
  // const msPerHour = msPerMinute * 60;
  // const msPerDay = msPerHour * 24;
  // const msPerMonth = msPerDay * 30;
  //
  // const future = t1 <= t2;
  // const dt = future? t2 - t1 : t1 -  t2;
  // let returnValue = '';
  //
  // if (dt < msPerMinute) {
  //   returnValue = '< 1 minute';
  // }
  // else if (dt < msPerHour) {
  //   returnValue = `${Math.round(dt / msPerMinute)} minutes`;
  // }
  // else if (dt < msPerDay) {
  //   const hours = Math.floor(dt / msPerHour);
  //   const minutes = Math.round((dt - hours*msPerHour) / msPerMinute);
  //   returnValue = `${hours} hours and ${minutes} minutes`;
  // }
  // else if (dt < msPerMonth) {
  //   const days = Math.floor(dt / msPerDay);
  //   const hours = Math.round((dt - days*msPerDay) / msPerHour);
  //   returnValue = `approx. ${days} days and ${hours} hours`;
  // } else {
  //   returnValue = `approx. ${Math.round(dt / msPerMonth)} months`;
  // }
  //
  // if (future) {
  //   return 'In ' + returnValue;
  // } else {
  //   return returnValue + ' ago';
  // }

};
