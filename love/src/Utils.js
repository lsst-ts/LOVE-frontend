/* eslint camelcase: 0 */

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import { WEBSOCKET_SIMULATION } from 'Config.js';
import { SALCommandStatus } from 'redux/actions/ws';

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
      // console.log('******** \nonclose, e: ', e);
      // e.code === 1e3 || e.code === 1005 || $.reconnect(e);
      (opts.onclose || noop)(e);
    };

    ws.onerror = (e) => {
      // eslint-disable-next-line
      // e && e.code === 'ECONNREFUSED' ? $.reconnect(e) : (opts.onerror || noop)(e);
      (opts.onerror || noop)(e);
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
    if (ws.readyState === 1) ws.send(JSON.stringify(x));
  };

  $.send = (x) => {
    if (ws.readyState === 1) ws.send(x);
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
  $.ws = ws;
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

  static getMediaBaseUrl() {
    return `http://${window.location.host}/manager`;
  }

  static getApiBaseUrl() {
    return `http://${window.location.host}/manager/api/`;
  }

  static getUifBaseUrl() {
    return `http://${window.location.host}/manager/ui_framework/`;
  }

  static getWebsocketsUrl() {
    // Connect to a fake local ip when simulating, to avoid getting real messages
    if (WEBSOCKET_SIMULATION) return 'ws://0.0.0.1/';
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
    return localStorage.getItem('LOVE-TOKEN');
  }

  static removeToken() {
    localStorage.removeItem('LOVE-TOKEN');
  }

  static requestConfigValidation(config, schema) {
    return fetch(`${ManagerInterface.getApiBaseUrl()}validate-config-schema/`, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        schema,
        config,
      }),
    });
  }

  static getXMLMetadata() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}salinfo/metadata`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getTopicData(categories = null) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    let queryParam = null;
    if (typeof categories === 'string') {
      queryParam = categories;
    } else if (Array.isArray(categories)) {
      queryParam = categories.join(' ');
    }
    const url = queryParam
      ? `${this.getApiBaseUrl()}salinfo/topic-data?categories=${queryParam}`
      : `${this.getApiBaseUrl()}salinfo/topic-data`;

    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getConfigFilesList() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}configfile`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getConfigFileContent(index) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}configfile/${index}/content`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getEmergencyContactList(/* index */) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}emergencycontact`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getEFDTimeseries(start_date, time_window, cscs, resample) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}efd/timeseries`;
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        start_date,
        time_window,
        cscs,
        resample,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static runATCSCommand(commandName, params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}tcs/aux`;
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        command_name: commandName,
        params,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        toast.error('Session expired. Logging out.');
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.ack);
        });
      }
      return response.json().then((resp) => {
        toast.info(resp.ack);
        return resp;
      });
    });
  }

  static getATCSDocstrings() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}tcs/docstrings`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getAuthList() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}authlist/`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getAuthListRequests() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}authlistrequest/`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static requestAuthListAuthorization(targetCSC, username, hostname, restrictionDuration) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      // console.log('Token not found during validation');
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}authlistrequest/`;
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        target_csc: targetCSC,
        username,
        hostname,
        restriction_duration: restrictionDuration,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static setAuthListRequestStatus(authRequestId, status) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}authlistrequest/${authRequestId}/`;
    return fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({
        status,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
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

const watcherSuccessfulCmds = {
  cmd_acknowledge: 'acknowledged',
  cmd_unacknowledge: 'unacknowledged',
  cmd_mute: 'muted',
  cmd_unmute: 'unmuted',
};

const watcherErrorCmds = {
  cmd_acknowledge: 'acknowledging',
  cmd_mute: 'muting',
  cmd_unmute: 'unmuting',
};

export const getNotificationMessage = (salCommand) => {
  const { cmd } = salCommand;
  const { result } = salCommand;
  const component = salCommand.component ?? salCommand.csc;

  if (salCommand.status === SALCommandStatus.REQUESTED) {
    return [`Requesting command ${salCommand.csc}.${salCommand.salindex}.${salCommand.cmd}`];
  }

  if (component === 'Watcher') {
    const alarm = salCommand.params.name;
    if (result === 'Done') {
      return [`Alarm '${alarm}' ${watcherSuccessfulCmds[cmd]} successfully`, result];
    }
    return [`Error ${watcherErrorCmds[cmd]} alarm '${alarm}', returned ${result}`, result];
  }

  if (result === 'Done') {
    return [`Command ${salCommand.csc}.${salCommand.salindex}.${salCommand.cmd} ran successfully`, result];
  }
  return [`Command ${salCommand.csc}.${salCommand.salindex}.${salCommand.cmd} returned ${result}`, result];
};

export const cscText = (csc, salindex) => {
  return csc + (salindex === 0 ? '' : `.${salindex}`);
};

export const parseTimestamp = (timestamp) => {
  if (timestamp instanceof DateTime) return timestamp;
  if (timestamp instanceof Date) return DateTime.fromJSDate(timestamp);
  if (typeof timestamp === 'number') return DateTime.fromMillis(timestamp);
  if (typeof timestamp === 'string') return DateTime.fromISO(timestamp);
  return null;
};

/**
 * Converts a timestamp into  "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 * @param {date-able} timestamp, if float it must be in milliseconds
 * @param {string} location, optional location to append to the timestamp, TAI by default
 */
export const formatTimestamp = (timestamp, location = 'TAI') => {
  const t = parseTimestamp(timestamp);
  return `${t.toUTC().toFormat('yyyy/MM/dd HH:mm:ss')} ${location}`;
};

/**
 * Converts a timestamp into  "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 * @param {date-able} timestamp, if float it must be in milliseconds
 * @param {string} location, optional location to append to the timestamp, empty by default
 */
export const isoTimestamp = (timestamp, location = null) => {
  const t = parseTimestamp(timestamp);
  return [t.toUTC().toISO(), location || null].join(' ');
};

/**
 * Converts seconds to a human readable difference like 'a few seconds ago'
 * @param {date-able} timestamp, if float it must be in milliseconds
 * @param {number} taiToUtc, difference in seconds between TAI and UTC timestamps
 */
export const relativeTime = (timestamp, taiToUtc) => {
  const t_tai = parseTimestamp(timestamp);
  const t_utc = t_tai.plus({ second: taiToUtc }).toUTC();
  const delta = t_utc.toRelative();
  return delta;
};

export const getStringRegExp = (str) => {
  try {
    return new RegExp(str, 'i');
  } catch (e) {
    return new RegExp('');
  }
};

export const siderealSecond = 1.00273788;

export const takeScreenshot = (callback) => {
  const el = document.children[0];
  html2canvas(el, {
    allowTaint: true,
    useCORS: true,
    foreignObjectRendering: true,
    backgroundColor: null,
    y: 0,
    x: 0,
    logging: false,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    ignoreElements: (e) => {
      return e.tagName === 'NOSCRIPT';
    },
  }).then((canvas) => {
    callback(canvas.toDataURL('image/png'));
  });
};

/**
 * Parse plot inputs and convert them to a format the EFD API understands.
 * The transformation is done from:
 * [
 *   {name: {csc, salindex, topic, item}}
 * ]
 * to:
 * {
 *   csc: {
 *     index: {
 *       topic: [item]
 *     }
 *   }
 * }
 */
export const parsePlotInputs = (inputs) => {
  const cscs = {};
  Object.values(inputs).forEach((input) => {
    const cscDict = cscs?.[input.csc];
    const indexDict = cscs?.[input.csc]?.[input.salindex];
    const topicDict = cscs?.[input.csc]?.[input.salindex]?.[input.topic];
    let newTopicDict = topicDict ?? [];
    let newIndexDict = indexDict ?? {};
    const newCSCDict = cscDict ?? {};
    if (topicDict) {
      newIndexDict[input.topic].push(input.item);
      return;
    }
    newIndexDict[input.topic] = [input.item];

    newTopicDict = newIndexDict[input.topic];
    if (indexDict) {
      newCSCDict[input.salindex][input.topic] = newTopicDict;
      newIndexDict = newCSCDict[input.salindex];
    } else {
      newIndexDict = {
        [input.topic]: newTopicDict,
      };
      newCSCDict[input.salindex] = newIndexDict;
    }
    if (cscDict) {
      cscs[input.csc][input.salindex] = newIndexDict;
    } else {
      cscs[input.csc] = {
        [input.salindex]: newIndexDict,
      };
    }
  });
  return cscs;
};

/**
 * Reformat data coming from the commander, from:
 * {
 *   "csc-index-topic": {
 *     "item":[{"ts":"2021-01-26 19:15:00+00:00","value":6.9}]
 *   }
 * }
 * to:
 * {
 *   "csc-index-topic": {
 *     "item": [{<tsLabel>:"2021-01-26 19:15:00+00:00",<valueLabel>:6.9}]
 *   }
 * }
 */
export const parseCommanderData = (data, tsLabel = 'x', valueLabel = 'y') => {
  const newData = {};
  Object.keys(data).forEach((topicKey) => {
    const topicData = data[topicKey];
    const newTopicData = {};
    Object.keys(topicData).forEach((propertyKey) => {
      const propertyDataArray = topicData[propertyKey];
      newTopicData[propertyKey] = propertyDataArray.map((dataPoint) => {
        const tsString = dataPoint?.ts.split(' ').join('T');
        return { [tsLabel]: parseTimestamp(tsString), [valueLabel]: dataPoint?.value };
      });
    });
    newData[topicKey] = newTopicData;
  });
  return newData;
};

export function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function degrees(radians) {
  return (radians * 180) / Math.PI;
}

export function fixedFloat(x, points = 3) {
  return Number.parseFloat(x).toFixed(points);
}
