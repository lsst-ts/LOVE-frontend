/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import html2canvas from 'html2canvas';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import Moment from 'moment';
import {
  WEBSOCKET_SIMULATION,
  SUBPATH,
  ISO_INTEGER_DATE_FORMAT,
  AUTO_HYPERLINK_JIRA_PROJECTS,
  JIRA_TICKETS_BASE_URL,
  OLE_OBS_SYSTEMS,
  OLE_OBS_SUBSYSTEMS,
  OLE_OBS_SUBSYSTEMS_COMPONENTS,
  EFD_INSTANCES,
} from 'Config.js';

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

/* Backwards compatibility of Set.difference */
if (!Set.prototype.difference) {
  Set.prototype.difference = function (otherSet) {
    let _difference = new Set(this);
    for (let elem of otherSet) {
      _difference.delete(elem);
    }
    return _difference;
  };
}

/* Backwards compatibility of Set.union */
if (!Set.prototype.union) {
  Set.prototype.union = function (otherSet) {
    let _union = new Set(this);
    for (let elem of otherSet) {
      _union.add(elem);
    }
    return _union;
  };
}

/**
 * Applies a series of functions to a value, passing the result of each function as the argument to the next function.
 *
 * @param {...Function} fns - The functions to be applied.
 * @returns {Function} A new function that applies the given functions in sequence.
 */
export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

/**
   MIT License
Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
export const sockette = (url, optsPar) => {
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
      (opts.onclose || noop)(e);
    };

    ws.onerror = (e) => {
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

  $.open();
  $.ws = ws;
  return $;
};

/**
 * LOVE-manager interface
 * It is used to connect to the implemented endpoints
 */
export default class ManagerInterface {
  constructor() {
    this.callback = null;
    this.socket = null;
    this.socketPromise = null;
    this.subscriptions = [];
    this.connectionIsOpen = false;
  }

  static httpProtocol = window.location.protocol;
  static wsProtocol = ManagerInterface.httpProtocol === 'https:' ? 'wss:' : 'ws:';
  static httpLocation = `${ManagerInterface.httpProtocol}//${window.location.host}${SUBPATH}`;
  static wsLocation = `${ManagerInterface.wsProtocol}//${window.location.host}${SUBPATH}`;

  static getMediaBaseUrl() {
    return `${ManagerInterface.httpProtocol}//${window.location.host}`;
  }

  static getApiBaseUrl() {
    return `${ManagerInterface.httpLocation}/manager/api/`;
  }

  static getUifBaseUrl() {
    return `${ManagerInterface.httpLocation}/manager/ui_framework/`;
  }

  static getWebsocketsUrl() {
    // Connect to a fake local ip when simulating, to avoid getting real messages
    if (WEBSOCKET_SIMULATION) return 'ws://0.0.0.1/';
    return `${ManagerInterface.wsLocation}/manager/ws/subscription?token=`;
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

  static getSimpleHeaders() {
    const token = ManagerInterface.getToken();
    if (token) {
      return new Headers({
        Authorization: `Token ${token}`,
      });
    }
    return new Headers({});
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

  static getUsers() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}user/`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static getXMLMetadata() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}salinfo/metadata`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
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
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server.);
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getControlLocation() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}controllocation/?selected`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
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
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}configfile/`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
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
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}configfile/${index}/content`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static setSelectedConfigFile(id) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}config-set`;
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        config_id: id,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
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
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}emergencycontact`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getEFDStatus(url) {
    if (!url) {
      return new Promise(function (resolve, _) {
        resolve({ label: 'EFD Status URL is not present in LOVE Configuration File', style: 'invalid' });
      });
    }
    return fetchWithTimeout(url, { method: 'GET' })
      .then((result) => {
        if (result.status !== 200) {
          throw new Error('EFD service not available');
        }

        return { label: 'EFD status is healthy', style: 'ok' };
      })
      .catch((err) => {
        console.warn(err);
        return { label: 'Error retrieving EFD status', style: 'alert', error: err };
      });
  }

  static getSALStatus(url, expectedKafkaBrokers = []) {
    if (!url) {
      return new Promise(function (resolve, _) {
        resolve({ label: 'SAL Status URL is not present in LOVE Configuration File', style: 'invalid' });
      });
    }
    return fetchWithTimeout(url, { method: 'GET' })
      .then((result) => {
        if (result.status !== 200) {
          throw new Error('SAL service not available');
        }

        return result.json().then((res) => {
          if (!res.brokers) {
            throw new Error('Broker key is not present in the payload');
          }

          const sameBrokers = expectedKafkaBrokers.every((broker) => res.brokers.includes(broker));
          if (!Array.isArray(res.brokers) || res.brokers?.length === 0 || !sameBrokers) {
            throw new Error('Broker list is empty or does not match the expected brokers');
          }

          return { label: 'SAL status is healthy', style: 'ok' };
        });
      })
      .catch((err) => {
        console.warn(err);
        return { label: 'Error retrieving SAL status', style: 'alert', error: err };
      });
  }

  // EFD APIs
  static getEFDTimeseries(start_date, time_window, cscs, resample, efd_instance) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}efd/timeseries`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        start_date,
        time_window,
        cscs,
        resample,
        efd_instance,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.ack);
          return false;
        });
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getEFDLogs(start_date, end_date, cscs, efd_instance, scale = 'utc') {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}efd/logmessages`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        start_date,
        end_date,
        cscs,
        efd_instance,
        /* If using timestamps from SAL topics the scale must be "tai", otherwise "utc" */
        scale,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Server error.');
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.ack);
          return false;
        });
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getEFDClients() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}efd/efd_clients`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  // Reports APIs
  static getReportsM1M3BumpTests(actuator_id, start_date, end_date, efd_instance) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}reports/m1m3-bump-tests`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        actuator_id,
        start_date,
        end_date,
        efd_instance,
      }),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  // TCS APIs
  static runATCSCommand(commandName, params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}tcs/aux`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        command_name: commandName,
        params,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401) {
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
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}tcs/aux/docstrings`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static runMTCSCommand(commandName, params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}tcs/main`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        command_name: commandName,
        params,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401) {
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

  static getMTCSDocstrings() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}tcs/main/docstrings`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  // OLE APIs
  static getListExposureLogs(instrument, minObsDay, maxObsDay, registry = 1) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/exposures?instrument=${instrument}&registry=${registry}&order_by=-obs_id&limit=1500${
      (minObsDay ? `&min_day_obs=${minObsDay}` : '') + (maxObsDay ? `&max_day_obs=${maxObsDay}` : '')
    }`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static getListAllMessagesExposureLogs(minObsDay, maxObsDay) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/?order_by=-date_added&limit=1000${
      minObsDay && maxObsDay ? `&min_day_obs=${minObsDay}&max_day_obs=${maxObsDay}` : ''
    }`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static getListMessagesExposureLogs(obsId) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/?obs_id=${obsId}&order_by=-date_added`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static getRetrieveMessageExposureLogs(msgExposureId) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/${msgExposureId}/`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static createMessageExposureLogs(params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const formData = new FormData();
    for (const param in params) {
      if (param == 'file') continue;
      formData.append(param, params[param]);
    }

    // Files payload
    if (params.file instanceof FileList) {
      for (const file in params.file) {
        formData.append('file[]', params.file[file]);
      }
    } else {
      formData.append('file[]', params.file);
    }

    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
    }).then((response) => {
      if (response.status === 422) {
        return response.json().then((resp) => {
          toast.error(resp.detail);
          return false;
        });
      }

      return checkJSONResponse(response, () => {
        toast.success('Log added succesfully.');
      });
    });
  }

  static updateMessageExposureLogs(msgExposureId, params) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const formData = new FormData();
    for (const param in params) {
      if (param == 'file') continue;
      formData.append(param, params[param]);
    }

    // Files payload
    if (params.file instanceof FileList) {
      for (const file in params.file) {
        formData.append('file[]', params.file[file]);
      }
    } else {
      formData.append('file[]', params.file);
    }

    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/${msgExposureId}/`;
    return fetch(url, {
      method: 'PUT',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
    }).then((response) => {
      return checkJSONResponse(response, () => {
        toast.success('Log edited succesfully.');
      });
    });
  }

  static deleteMessageExposureLogs(msgExposureId) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/${msgExposureId}/`;
    return fetch(url, {
      method: 'DELETE',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response, () => {
        toast.success('Log deleted succesfully.');
      });
    });
  }

  static getListExposureInstruments() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/instruments`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static getListMessagesNarrativeLogs(from, to) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/?order_by=-date_begin&limit=1000${
      from ? `&min_date_begin=${from}` : ''
    }${to ? `&max_date_begin=${to}` : ''}`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static createMessageNarrativeLogs(params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const formData = new FormData();
    for (const param in params) {
      if (param == 'file') continue;
      formData.append(param, params[param]);
    }

    // Files payload
    if (params.file instanceof FileList) {
      for (const file in params.file) {
        formData.append('file[]', params.file[file]);
      }
    } else {
      formData.append('file[]', params.file);
    }

    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
    }).then((response) => {
      if (response.status === 422) {
        return response.json().then((resp) => {
          toast.error(resp.detail);
          return false;
        });
      }

      return checkJSONResponse(response, () => {
        toast.success('Log added succesfully.');
      });
    });
  }

  static updateMessageNarrativeLogs(msgNarrativeId, params) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const formData = new FormData();
    for (const param in params) {
      if (param == 'file') continue;
      formData.append(param, params[param]);
    }

    // Files payload
    if (params.file instanceof FileList) {
      for (const file in params.file) {
        formData.append('file[]', params.file[file]);
      }
    } else {
      formData.append('file[]', params.file);
    }

    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/${msgNarrativeId}/`;
    return fetch(url, {
      method: 'PUT',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
    }).then((response) => {
      return checkJSONResponse(response, () => {
        toast.success('Log edited succesfully.');
      });
    });
  }

  static deleteMessageNarrativeLogs(msgExposureId) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/${msgExposureId}/`;
    return fetch(url, {
      method: 'DELETE',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response, () => {
        toast.success('Log deleted succesfully.');
      });
    });
  }

  static getCurrentNightReport(telescope) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const currentDate = Moment().utc();
    const currentObsDayInt = parseInt(getObsDayFromDate(currentDate), 10);

    const url = `${this.getApiBaseUrl()}ole/nightreport/reports/?telescopes=${telescope}&min_day_obs=${currentObsDayInt}&max_day_obs=${
      currentObsDayInt + 1
    }`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  static saveCurrentNightReport(telescope, summary, telescope_status, confluence_url, observers_crew) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const url = `${this.getApiBaseUrl()}ole/nightreport/reports/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        telescope,
        summary,
        telescope_status,
        confluence_url,
        observers_crew,
      }),
    }).then((response) => {
      if (response.status === 422) {
        return response.json().then((resp) => {
          toast.error(resp.detail);
          return false;
        });
      }

      return checkJSONResponse(response, () => {
        toast.success('Report saved succesfully.');
      });
    });
  }

  static updateCurrentNightReport(nightreport_id, summary, telescope_status, confluence_url, observers_crew) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const url = `${this.getApiBaseUrl()}ole/nightreport/reports/${nightreport_id}/`;
    return fetch(url, {
      method: 'PUT',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        summary,
        telescope_status,
        confluence_url,
        observers_crew,
      }),
    }).then((response) => {
      return checkJSONResponse(response, () => {
        toast.success('Report updated succesfully.');
      });
    });
  }

  static sendCurrentNightReport(report_id) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const url = `${this.getApiBaseUrl()}ole/nightreport/send/${report_id}/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response, () => {
        toast.success('Report sent succesfully.');
      });
    });
  }

  static getHistoricNightReports(day_obs_start, day_obs_end, telescope) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const url = `${this.getApiBaseUrl()}ole/nightreport/reports/?telescopes=${telescope}&min_day_obs=${day_obs_start}&max_day_obs=${day_obs_end}`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  /**************************************************/

  static getListImageTags() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}imagetag/`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return checkJSONResponse(response);
    });
  }

  /** Methods to access Scripts configurations  */
  static getScriptConfiguration(scriptPath, scriptType) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    let params = scriptPath || scriptType ? '?' : '';
    if (scriptPath) params += `&path=${scriptPath}`;
    if (scriptType) params += `&type=${scriptType}`;
    const url = `${this.getApiBaseUrl()}scriptconfiguration/${params}`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static updateScriptSchema(id, configSchema, schema) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}scriptconfiguration/${id}/`;
    return fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({
        config_schema: configSchema,
        schema: schema,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.title);
          return false;
        });
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static postScriptConfiguration(scriptPath, scriptType, configName, configSchema, schema) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}scriptconfiguration/`;
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        script_path: scriptPath,
        script_type: scriptType,
        config_name: configName,
        config_schema: configSchema,
        schema: schema,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401) {
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.title);
          return false;
        });
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }
} // END ManagerInterface

/**
 * Function to execute the fetch method with a specified timeout
 * @param {string} url - URL to query
 * @param {object} options - Options to be added to the request
 * @param {number} timeout - Timeout of the request
 */
function fetchWithTimeout(url, options = {}, timeout = 2000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), timeout);
    }),
  ]);
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

/**
 * Returns the value for a fake unit name, based on the name of a telemetry
 * @param {string} name
 * @returns {string} unit name
 */
export const getFakeUnits = (name) => {
  const fakeUnits = ['unit1', 'unit2', 'unit3', 'unit4'];
  return fakeUnits[name.charCodeAt(0) % 4];
};

/**
 * Custom implementation of Array.prototype.flatMap()
 * It maps values of a using the cb callback
 * @param {*} a array to be flattened
 * @param {function} cb callback to be used on the map of a
 * @returns {Array} flattened array
 */
export const flatMap = (a, cb) => [].concat(...a.map(cb));

/**
 * Returns <CSC>:<salindex> format from input values
 * @param {string} csc CSC salname
 * @param {number|string} salindex CSC salindex
 * @returns {string} returns <CSC>:<salindex> string
 */
export const getNotificationMessage = (salCommand) => {
  const { cmd } = salCommand;
  const { result } = salCommand;
  const component = salCommand.component ?? salCommand.csc;

  const watcherSuccessfulCmds = {
    cmd_acknowledge: 'acknowledged',
    cmd_unacknowledge: 'unacknowledged',
    cmd_mute: 'muted',
    cmd_unmute: 'unmuted',
    cmd_makeLogEntry: 'logged',
  };

  const watcherErrorCmds = {
    cmd_acknowledge: 'acknowledging',
    cmd_mute: 'muting',
    cmd_unmute: 'unmuting',
    cmd_makeLogEntry: 'logging',
  };

  if (salCommand.status === 'REQUESTED') {
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

/**
 * Returns <CSC>:<salindex> format from input values
 * @param {string} csc CSC salname
 * @param {number|string} salindex CSC salindex
 * @returns {string} returns <CSC>:<salindex> string
 */
export const cscText = (csc, salindex) => {
  return csc + (salindex === 0 ? '' : `.${salindex}`);
};

/**
 * Parse a timestamp value to date format
 * if timestamp is instance of DateTime it returns the same value
 * if timestamp is instance of Date it returns DateTime from a date
 * if timestamp is typeof number it returns a DateTime from milliseconds number
 * if timestamp is typeof string it returns DateTime from ISO string
 * @param {DateTime|Date|number|string} timestamp timestamp to be formatted
 * @returns {DateTime} parsed timestamp to date format
 */
export const parseTimestamp = (timestamp) => {
  if (timestamp instanceof DateTime) return timestamp;
  if (timestamp instanceof Date) return DateTime.fromJSDate(timestamp);
  if (typeof timestamp === 'number') return DateTime.fromMillis(timestamp);
  if (typeof timestamp === 'string') return DateTime.fromISO(timestamp);
  return null;
};

/**
 * Returns value if it is integer or float fixed to 4 decimals
 * @param {number} value, number to convert
 * @returns {number|string} integer value or fixed float string of value
 */
export const defaultNumberFormatter = (value, precision = 4) => {
  if (Number.isNaN(value)) return value;
  return Number.isInteger(value) ? value : Number.parseFloat(value).toFixed(precision);
};

/**
 * Convert a timestamp into  "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 * @param {date-able} timestamp if float it must be in milliseconds
 * @param {string} location optional location to append to the timestamp, TAI by default
 * @returns {string} "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 */
export const formatTimestamp = (timestamp, location = 'TAI') => {
  const t = parseTimestamp(timestamp);
  return `${t.toUTC().toFormat('yyyy/MM/dd HH:mm:ss') + (location ? ' ' + location : '')}`;
};

/**
 * Convert a timestamp into  "YYYY-MM-DD HH:MM:SS" formatted string
 * @param {date-able} timestamp if float it must be in milliseconds
 * @returns {string} "YYYY-MM-DD HH:MM:SS" formatted string
 */
export const parseForPlotTimestamp = (timestamp) => {
  const t = parseTimestamp(timestamp);
  return `${t.toUTC().toFormat('yyyy-MM-dd HH:mm:ss')}`;
};

/**
 * Convert a timestamp into  "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 * @param {date-able} timestamp if float it must be in milliseconds
 * @param {string} location optional location to append to the timestamp, empty by default
 * @returns {string} ISO time string
 */
export const isoTimestamp = (timestamp, location = null) => {
  const t = parseTimestamp(timestamp);
  return [t.toUTC().toISO(), location || null].join(' ');
};

/**
 * Convert seconds to a human readable difference like 'a few seconds ago'
 * @param {date-able} timestamp if float it must be in milliseconds
 * @param {number} taiToUtc difference in seconds between TAI and UTC timestamps
 * @returns {string} human readable time
 */
export const relativeTime = (timestamp, taiToUtc) => {
  const t_tai = parseTimestamp(timestamp);
  const t_utc = t_tai.plus({ second: taiToUtc }).toUTC();
  const delta = t_utc.toRelative();
  return delta;
};

/**
 * Convert seconds to digital format as '00:00:00'
 * @param {number} time seconds to be converted
 * @returns {string} seconds in digitial format
 */
export const formatSecondsToDigital = (time) => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor((time % 3600) / 60);
  let hours = Math.floor(time / 3600);
  minutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
  seconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;
  hours = hours.toString().length === 1 ? `0${hours}` : hours;
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Function to convert digital format '00:00:00' to seconds
 * @param {string} time in digital format
 * @returns {number} digital time in seconds
 */
export const formatDigitalToSeconds = (time) => {
  const tokens = time.split(':');
  return parseInt(tokens[0], 10) * 3600 + parseInt(tokens[1], 10) * 60 + parseInt(tokens[2], 10);
};

/**
 * Convert hours to digital format as '00:00:00'
 * @param {number} time hours to be converted
 * @returns {string} hours in digitial format
 */
export const formatHoursToDigital = (time) => {
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  const seconds = Math.floor(((time - hours) * 60 - minutes) * 60);
  const hoursString = hours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');
  const secondsString = seconds.toString().padStart(2, '0');
  return `${hoursString}:${minutesString}:${secondsString}`;
};

/**
 * Function to calculate the difference between two dates in hours, using moment.js
 * @param {string} hour1 in format '00:00:00'
 * @param {string} hour2 in format '00:00:00'
 * @param {string} unit to calculate the difference
 * @returns {string} result diff in unit format
 */
export const diffHours = (hour1, hour2, unit) => {
  const date1 = Moment().add(formatDigitalToSeconds(hour1), 'seconds');
  const date2 = Moment().add(formatDigitalToSeconds(hour2), 'seconds');
  let diff = Moment(date1).diff(Moment(date2), unit);
  return diff;
};

/**
 * Function to transform a string to a regex expression
 * @param {string} str string to be transformed
 * @returns {RegExp} regex expression in base to str
 */
export const getStringRegExp = (str) => {
  try {
    return new RegExp(str, 'i');
  } catch (e) {
    return new RegExp('');
  }
};

/**
 * Function to take screenshots using html2canvas
 * @param {function} callback the callback to be executed after the screen is taken
 */
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
export const parsePlotInputsEFD = (inputs) => {
  const parsedInputs = {};
  Object.values(inputs).forEach((input) => {
    Object.values(input.values).forEach((value) => {
      // EFD receives topic names of events with the logevent_ prefix
      const topicName = value.category === 'telemetry' ? value.topic : `logevent_${value.topic}`;

      // Check if the cscDict exists, if not create it
      if (!parsedInputs[value.csc]) {
        parsedInputs[value.csc] = {};
      }

      // Check if the indexDict exists, if not create it
      if (!parsedInputs[value.csc][value.salindex]) {
        parsedInputs[value.csc][value.salindex] = {};
      }
      // Check if the topicDict exists, if not create it
      if (!parsedInputs[value.csc][value.salindex][topicName]) {
        parsedInputs[value.csc][value.salindex][topicName] = [];
      }

      //  Array index is used for queries to the EFD (influx)
      parsedInputs[value.csc][value.salindex][topicName].push(`${value.item}${value.isArray ? value.arrayIndex : ''}`);
    });
  });
  return parsedInputs;
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
      // Next line was added to support EFD Querying for Array type items (influx)
      const formattedPropertyKey = propertyKey.replace(/[\d\.]+$/, '');
      newTopicData[formattedPropertyKey] = propertyDataArray.map((dataPoint) => {
        const tsString = dataPoint?.ts.split(' ').join('T');
        const parsedTsString = parseTimestamp(tsString);
        return {
          units: { y: dataPoint?.units },
          [tsLabel]: parsedTsString,
          [valueLabel]: dataPoint?.value,
        };
      });
    });
    newData[topicKey] = newTopicData;
  });
  return newData;
};

/**
 * Function to transform degrees to radians
 * @param {number} degrees degrees to be transformed
 * @returns {number} radians equivalent
 */
export function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Function to transform radians to degrees
 * @param {number} radians radians to be transformed
 * @returns {number} degrees equivalent
 */
export function degrees(radians) {
  return (radians * 180) / Math.PI;
}

/**
 * Function to transform degress to Right Ascension hour-minute-seconds format
 * e.g. 180.55 -> 12:02:12
 * @param {number} degrees degrees to be transformed
 * @returns {string} Right Ascension hour format
 */
export function degreesToHMS(degrees) {
  const h = Math.floor(degrees / 15);
  const m = Math.floor((degrees % 15) * 4);
  const s = Math.floor(((degrees % 15) * 4 - m) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Function to transform degress to Declination degree-minute-seconds format
 * e.g. 180.55 -> +180° 02' 12"
 * @param {number} degrees degrees to be transformed
 * @returns {string} Declination hour format
 */
export function degreesToDMS(degrees) {
  const degreesAbsolute = Math.abs(degrees);
  const d = Math.floor(degreesAbsolute);
  const m = Math.floor((degreesAbsolute % 1) * 4);
  const s = Math.floor(((degreesAbsolute % 1) * 4 - m) * 60);
  const hourFormat =
    `${degrees >= 0 ? '+' : '-'}` +
    `${d.toString().padStart(2, '0')}°` +
    ` ${m.toString().padStart(2, '0')}'` +
    ` ${s.toString().padStart(2, '0')}"`;
  return hourFormat;
}

/**
 * Function to pase a number or string to float with fixed decimal points
 * as specified by the points param
 * @param {string|number} x value to be parsed to float
 * @param {number} points number of decimal digits to be fixed
 * @returns {string} string with the input value as a float fixed to the specified decimal points
 */
export function fixedFloat(x, points = 3) {
  return Number.parseFloat(x).toFixed(points);
}

/**
 * Function used to calculate the left duration from startDate + shift to current time.
 * If difference is negative the return value is 0
 * @param {moment} startDate the initial date
 * @param {number} shift the shift added to the startDate in seconds
 * @returns {number} left duration in seconds from startDate + shift to current time
 */
export function calculateTimeoutToNow(startDate, shift = 0) {
  const diff = Moment.duration(Moment().diff(startDate));
  const secondsLeft = shift - diff.asSeconds();
  return secondsLeft > 0 ? parseInt(secondsLeft, 10) : 0;
}

/**
 * Function used to get the user@host string .
 * @param {string} user user
 * @param {string} host host
 * @returns {string} user@host string
 */
export function getUserHost(user, host) {
  try {
    return `${user}@${host}`;
  } catch (e) {
    return '';
  }
}

/**
 * Function for get desplace in angle for the SVG
 * @param {number} from in degree to initial
 * @param {number} to in degree to end
 * @returns {number} displaced angle
 */
export function closestEquivalentAngle(from, to) {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return from + delta;
}

/**
 * Function used to open new tabs from a url.
 * @param {number} url URL to point the new tab
 */
export function openInNewTab(url) {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
}

/**
 * Function to get OLE Narrative and Exposure logs parameters from urls field.
 * @param {string[]} urls array of urls that comes from OLE message
 * @returns {string} string with first url with the condition if jira link
 */
export function getLinkJira(urls) {
  if (!urls) return '';
  const filtered = urls.filter((url) => url.includes(JIRA_TICKETS_BASE_URL));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return '';
}

/**
 * Function to get OLE Narrative and Exposure logs parameters from urls field.
 * @param {string[]} urls array of urls that comes from OLE message
 * @returns {string} string with first url that is not a jira link
 */
export function getFileURL(urls) {
  if (!urls) return '';
  const filtered = urls.filter((url) => !url.includes(JIRA_TICKETS_BASE_URL));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return '';
}

/**
 * Function to get OLE Narrative and Exposure logs parameters from urls field.
 * @param {string} urls array of urls that comes from OLE message
 * @returns {Array} array with all urls that are not jira links
 */
export function getFilesURLs(urls) {
  if (!urls) return [];
  const filtered = urls.filter((url) => !url.includes(JIRA_TICKETS_BASE_URL));
  return filtered;
}

/**
 * Function to get OLE Narrative and Exposure logs parameters from url.
 * @param {string} url string of url that comes from OLE message
 * @returns {string} string parse of the filename from url parameter
 */
export function getFilename(url) {
  if (url) {
    return url.substring(url.lastIndexOf('/') + 1);
  }
  return '';
}

/**
 * Function to map ATCamera statuses to styles
 * @param {string} status camera status
 * @returns {string} style name
 */
export const getCameraStatusStyle = (status) => {
  if (!status) return '';
  if (status.toLowerCase() === 'integrating') return 'running';
  if (status.toLowerCase() === 'reading_out') return 'running';
  if (status.toLowerCase() === 'ready') return 'ok';
  if (status.toLowerCase() === 'done') return 'ok';
  return '';
};

let booleanArray = undefined;
export function arrayRandomBoolean(len, probability = 0.1) {
  if (!booleanArray) {
    let arr = Array.from({ length: len }, (i) => false);
    arr = arr.map((v) => {
      const rnd = Math.floor(Math.random() * 100);
      if (rnd < probability * 100) return true;
      return false;
    });
    booleanArray = arr;
  }
  return booleanArray;
}

/**
 * Function to parse any dictionary to a SAL format
 * Example:
 * {
 *  "param1": <value>,
 *  "param2": <value>,
 * }
 * to:
 * {
 * "param1": {
 *  "value": <value>,
 *  },
 * "param2": {
 *  "value": <value>,
 *  },
 * }
 * @param {*} data, the dictionary to be parsed
 */
export function parseToSALFormat(data) {
  const newData = {};
  Object.keys(data).forEach((key) => {
    newData[key] = { value: data[key] };
  });
  return newData;
}

/**
 * Function to copy to clipboard
 * @param {string} text text to be copied
 * @param {func} effect effect to be applied
 */
export function copyToClipboard(text, effect) {
  navigator.clipboard.writeText(text);
  if (effect) effect();
}

/**
 * Function to trim a string to a specified length
 * @param {string} string text to be trimmed
 * @param {number} length length to be trimmed, 100 by default
 */
export function trimString(string, length = 100) {
  if (string.length > length) {
    return `${string.substring(0, length)}...`;
  }
  return string;
}

/**
 * Function to parse HTML, generated by react-quill, to Jira Markdown.
 * Check https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
 * for more info on the Jira Markdown format.
 * This function also parses Jira tickets names that are not hyperlinks. Allowed
 * JIRA projects are set in AUTO_HYPERLINK_JIRA_PROJECTS constant.
 * @param {string} html - The HTML string to be parsed
 * @returns {string} The parsed markdown string
 */
export function htmlToJiraMarkdown(html) {
  let markdown = html;

  // Parse text formats
  markdown = markdown.replace(/<strong>(.*)<\/strong>/g, (match, p1) => {
    return `*${p1}*`;
  });
  markdown = markdown.replace(/<em>(.*)<\/em>/g, (match, p1) => {
    return `_${p1}_`;
  });
  markdown = markdown.replace(/<u>(.*)<\/u>/g, (match, p1) => {
    return `+${p1}+`;
  });
  markdown = markdown.replace(/<s>(.*)<\/s>/g, (match, p1) => {
    return `-${p1}-`;
  });

  // Parse indentations
  // We need to ensure the following regex to be greedy to avoid parsing
  // multiple <p> tags followed by anothers
  markdown = markdown.replace(/<p class="ql-indent-1">(.*?)<\/p>/g, (match, p1) => {
    return `\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-2">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-3">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-4">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t\t\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-5">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t\t\t\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-6">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t\t\t\t\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-7">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t\t\t\t\t\t${p1}\r\n`;
  });
  markdown = markdown.replace(/<p class="ql-indent-8">(.*?)<\/p>/g, (match, p1) => {
    return `\t\t\t\t\t\t\t\t${p1}\r\n`;
  });

  // Parse headings
  // We need to ensure the following regex to be greedy to avoid parsing
  // multiples <h*> tags followed by anothers.
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, (match, p1) => {
    return `h1. ${p1}\r\n`;
  });
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, (match, p1) => {
    return `h2. ${p1}\r\n`;
  });
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, (match, p1) => {
    return `h3. ${p1}\r\n`;
  });
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, (match, p1) => {
    return `h4. ${p1}\r\n`;
  });
  markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, (match, p1) => {
    return `h5. ${p1}\r\n`;
  });
  markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, (match, p1) => {
    return `h6. ${p1}\r\n`;
  });

  // Parse links
  markdown = markdown.replace(
    /<a href="([^"]*)" rel="noopener noreferrer" target="_blank">([^<]*)<\/a>/g,
    (match, p1, p2) => {
      return `[${p2}|${p1}]`;
    },
  );

  // Parse code blocks
  markdown = markdown.replace(/<code>(.*)<\/code>/g, (match, p1) => {
    return `{code}${p1}{code}`;
  });
  markdown = markdown.replace(/<pre>(.*)<\/pre>/g, (match, p1) => {
    return `{code}${p1}{code}`;
  });

  // TODO: DM-41265
  // markdown = markdown.replace(/<ul>|<\/ul>|<ol>|<\/ol>|<li>/g, '');
  // markdown = markdown.replace(/<\/li>/g, '\n');

  // Parse &nbsp;
  // Ensure to remove special &nbsp; characters if present
  markdown = markdown.replace(/&nbsp;/g, ' ');

  // Parse rest of stuff
  markdown = markdown.replace(/<p>/g, '');
  markdown = markdown.replace(/<\/p>/g, '\r\n');
  markdown = markdown.replace(/<br>/g, '\r\n');

  return markdown;
}

/**
 * Function to parse Jira Markdown to HTML in the react-quill format
 * Check https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
 * for more info on the Jira Markdown format.
 * @param {string} markdown markdown to be parsed
 * @params {object} options options to be used on the parser, default: { codeFriendly: true }
 * @params {boolean} options.codeFriendly if true, text formatting is not applied
 * @returns {string} html string
 */
export function jiraMarkdownToHtml(markdown, options = { codeFriendly: true }) {
  if (!markdown) return '';

  const { codeFriendly } = options;
  let html = markdown;

  // Parse text formats
  if (!codeFriendly) {
    html = html.replace(/\*(.*)\*/g, (match, p1) => {
      return `<strong>${p1}</strong>`;
    });
    html = html.replace(/_(.*)_/g, (match, p1) => {
      return `<em>${p1}</em>`;
    });
    html = html.replace(/\+(.*)\+/g, (match, p1) => {
      return `<u>${p1}</u>`;
    });
    html = html.replace(/-(.*)-/g, (match, p1) => {
      return `<s>${p1}</s>`;
    });
  }

  // Parse headings
  html = html.replace(/h1\.\s(.*)/g, (match, p1) => {
    return `<h1>${p1}</h1>`;
  });
  html = html.replace(/h2\.\s(.*)/g, (match, p1) => {
    return `<h2>${p1}</h2>`;
  });
  html = html.replace(/h3\.\s(.*)/g, (match, p1) => {
    return `<h3>${p1}</h3>`;
  });
  html = html.replace(/h4\.\s(.*)/g, (match, p1) => {
    return `<h4>${p1}</h4>`;
  });
  html = html.replace(/h5\.\s(.*)/g, (match, p1) => {
    return `<h5>${p1}</h5>`;
  });
  html = html.replace(/h6\.\s(.*)/g, (match, p1) => {
    return `<h6>${p1}</h6>`;
  });

  // Parse links
  html = html.replace(/\[(.*?)\|(.*?)\]/g, (match, p1, p2) => {
    return `<a href="${p2}" rel="noopener noreferrer" target="_blank">${p1}</a>`;
  });

  // Parse code blocks
  html = html.replace(/\{code\}(.*)\{code\}/g, (match, p1) => {
    return `<code>${p1}</code>`;
  });

  // Parse full lines
  html = html.replace(/^(\t*)(.*)\r\n/gm, (match, p1, p2) => {
    // If match is a carriage return, return it
    // as it will be parsed as a <br> afterwards
    if (match === '\r\n') {
      return match;
    }

    // Check if there is any identation with the first capture group
    const indentationLevel = p1.length;
    if (indentationLevel > 0) {
      return `<p class="ql-indent-${indentationLevel}">${p2}</p>`;
    }

    // Otherwise return the line as a paragraph
    return `<p>${p2}</p>`;
  });

  // Parse empty line
  html = html.replace(/\r\n\r\n/g, '<br>');

  return html;
}

/**
 * Convert Jira ticket names to hyperlinks.
 * Jira ticket names are expected to be in the format <JIRA_PROJECT>-<NUMBER>.
 * The JIRA_PROJECT is expected to be one of the projects defined in the AUTO_HYPERLINK_JIRA_PROJECTS constant.
 * This function only conver Jira ticket names that are not hyperlinks.
 * THE INPUT TEXT MUST BE IN MARKDOWN FORMAT.
 * @param {string} markdown - The text in markdown format containing Jira ticket names.
 * @returns {string} - The text with Jira ticket names converted to hyperlinks in markdown format.
 */
export function convertJiraTicketNamesToHyperlinks(markdown) {
  // The following regex matches Jira tickets that are not inside markdown hyperlinks
  // by using a negative lookbehind assertion.
  const jiraTicketRegexString = `(?<!\\[[^\\]]*)(${AUTO_HYPERLINK_JIRA_PROJECTS.join('|')})+-\\d+\\b`;
  const jiraTicketRegex = new RegExp(jiraTicketRegexString, 'g');
  return markdown.replace(jiraTicketRegex, (match) => {
    return `[${match}|${JIRA_TICKETS_BASE_URL}/${match}]`;
  });
}

/**
 * Function to transform an html string to an array of tokens
 * @param {string} html html string to be transformed
 * @returns {Array} array of tokens
 */
export function simpleHtmlTokenizer(html) {
  let tokens = [];
  let currentToken = '';
  let insideTag = false;
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    if (char === '<') {
      insideTag = true;
      currentToken += char;
    } else if (char === '>') {
      insideTag = false;
      currentToken += char;
      tokens.push(currentToken);
      currentToken = '';
    } else if (insideTag) {
      currentToken += char;
    } else {
      tokens.push(char);
    }
  }
  return tokens;
}

/**
 * Function to get the OBS day from a date
 * If the date is after 12:00 UTC, the day is the same day
 * If the date is before 12:00 UTC, the day is the previous day
 * @param {object} date UTC date, it can be:
 * - string in ISO format with the Z suffix
 * - moment date object in UTC
 * @returns {string} OBS day in format YYYYMMDD
 */
export function getObsDayFromDate(date) {
  const utcDate = Moment(date).utc();
  const utcHour = utcDate.hour();
  if (utcHour >= 12) {
    return utcDate.format(ISO_INTEGER_DATE_FORMAT);
  }
  return utcDate.subtract(1, 'day').format(ISO_INTEGER_DATE_FORMAT);
}

/**
 * Convert the given OBS day (YYYYMMDD) to ISO format (YYYY-MM-DD).
 *
 * @param {number} obsDay - The OBS day to convert as an interger.
 * @returns {string} The OBS day in ISO format.
 */
export function getObsDayISO(obsDay) {
  const obsDayString = obsDay.toString();
  return `${obsDayString.substring(0, 4)}-${obsDayString.substring(4, 6)}-${obsDayString.substring(6, 8)}`;
}

/**
 * Function to truncate date ISO string to minutes
 * @param {string} date date, as a ISO string, to be truncated
 * @returns {string} truncated date in format YYYY-MM-DDTHH:mm
 */
export function truncateISODateToMinutes(date) {
  return date.substring(0, 16);
}

/**
 * Function to convert first letter to uppercase
 * @param {string} string string to be converted
 * @returns {string} string with first letter in uppercase
 */
export function firstLetterToUpperCase(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Function to get accessor function string from
 * isArray and arrayIndex parameters for
 * getting telemetry and events data on
 * VegaTimeSeriesPlots
 */
export function getEntryAccessorString(isArray, arrayIndex) {
  if (isArray) {
    return `(x) => x[${arrayIndex}]`;
  }
  return '(x) => x';
}

/**
 * Function to check response statuses of
 * ManagerInterface requests. Errors are handled
 * and if success json() promise is returned
 * @param {object} response the response object
 * @param {function} onSuccess function to be executed on success
 * @returns {object} promise if success, false otherwise
 * Notes:
 * - 500 errors are shown as a toast.
 * - 400 errors are handled and the `ack` param is shown as a toast.
 * - 401 errors are handled and the token is removed.
 * - 413 errors are shown as a toast.
 * - 200, 201 and 204 responses are handled and the onSuccess function is executed.
 */
export function checkJSONResponse(response, onSuccess) {
  if (response.status >= 500) {
    toast.error('Error communicating with the server.');
    return false;
  }
  if (response.status === 400) {
    return response.json().then((resp) => {
      const errorMsg = resp.error ? `${resp.ack}: ${resp.error}` : resp.ack;
      toast.error(errorMsg);
      return false;
    });
  }
  if (response.status === 401) {
    ManagerInterface.removeToken();
    return false;
  }
  if (response.status === 404) {
    toast.error('Not found.');
    return false;
  }
  if (response.status === 413) {
    toast.error('File too large.');
    return false;
  }

  if (response.status === 200 || response.status === 201 || response.status === 204) {
    if (onSuccess) onSuccess();
  }

  return response.json().then((resp) => {
    return resp;
  });
}

/**
 * Function to format time of incident for OLE
 * @param {string} dateStart start date of incident in ISO format
 * @param {string} dateEnd end date of incident in ISO format
 * @returns {string} formatted string for OLE
 */
export function formatOLETimeOfIncident(dateStart, dateEnd) {
  if (dateStart === dateEnd) return truncateISODateToMinutes(dateStart);
  return `${truncateISODateToMinutes(dateStart)} - ${truncateISODateToMinutes(dateEnd)}`;
}

/**
 * Function to swap values per keys in a object
 * @param {object} obj object to be swapped
 * @returns {object} object with swapped keys and values
 */
export function swapKeysAndValues(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
}

/**
 * Function to arrange the OBS System, Sub-System, and Component JIRA field
 * @param {Array} systemsIds
 * @param {Array} subsystemsIds
 * @param {Array} componentsIds
 * @returns {string} JSON string with the selection payload which should be in the form of:
 * {
 *  selection: [
 *   [
 *    {
 *     id: <id-system>,
 *     name: <name-system>,
 *     children: [<child-1>, <child-2>, ...]
 *    }
 *   ],
 *   [
 *    {
 *     id: <id-subsystem>,
 *     name: <name-subsystem>,
 *     children: [<child-1>, <child-2>, ...]
 *    }
 *   ],
 *   [
 *    {
 *     id: <id-component>,
 *     name: <name-component>
 *    }
 *   ]
 *  ]
 * }
 */
export function arrangeJiraOBSSystemsSubsystemsComponentsSelection(systemsIds, subsystemsIds, componentsIds) {
  const systems = Object.entries(OLE_OBS_SYSTEMS)
    .filter(([k, s]) => systemsIds?.includes(s.id))
    .map(([k, s]) => ({ name: k, ...s }));
  const subsystems = Object.entries(OLE_OBS_SUBSYSTEMS)
    .filter(([k, ss]) => subsystemsIds?.includes(ss.id))
    .map(([k, ss]) => ({ name: k, ...ss }));
  const components = Object.entries(OLE_OBS_SUBSYSTEMS_COMPONENTS)
    .filter(([k, c]) => componentsIds?.includes(c.id))
    .map(([k, c]) => ({ name: k, ...c }));

  return JSON.stringify({ selection: [systems, subsystems, components] });
}

/**
 * Function to arrange the OBS System, Sub-System, and Component hierarchy for the narrativelog
 * @param {Array} systemsIds
 * @param {Array} subsystemsIds
 * @param {Array} componentsIds
 * @returns {string} JSON string with the selection payload which should be in the form of:
 * {
 *  name: "System-A",
 *  children: [
 *    {
 *      name: "Subsystem-A",
 *      children: [
 *        {
 *          name: "Component-A",
 *        },
 *      ],
 *    },
 *    {
 *      name: "Subsystem-B",
 *      children: [
 *        {
 *          name: "Component-B",
 *        },
 *      ],
 *    },
 *  ],
 * }
 */
export function arrangeNarrativelogOBSSystemsSubsystemsComponents(systemsIds, subsystemsIds, componentsIds) {
  const prefixPattern = /^[A-Z]+:\s*/;
  const hierarchy = Object.entries(OLE_OBS_SYSTEMS)
    .filter(([k, s]) => systemsIds?.includes(s.id))
    .map(([k, s]) => {
      const subsystems = Object.entries(OLE_OBS_SUBSYSTEMS)
        .filter(([k, ss]) => subsystemsIds?.includes(ss.id))
        .map(([k, ss]) => {
          // Subsystems have a prefix to differentiate identical name ones
          // Here we remove the prefix to make the hierarchy more readable
          const ssName = k.replace(prefixPattern, '');
          const components = Object.entries(OLE_OBS_SUBSYSTEMS_COMPONENTS)
            .filter(([k, c]) => componentsIds?.includes(c.id))
            .map(([k, c]) => {
              // Components have a prefix to differentiate identical name ones
              // Here we remove the prefix to make the hierarchy more readable
              const cName = k.replace(prefixPattern, '');
              return { name: cName };
            });
          if (components.length === 0) return { name: k };
          return { name: ssName, children: components };
        });
      if (subsystems.length === 0) return { name: k };
      return { name: k, children: subsystems };
    });

  // We assume that the hierarchy will always have a single root (system)
  return JSON.stringify(hierarchy[0] ?? {});
}

/**
 * Function to validate the OBS System, Sub-System, and Component hierarchy for the narrativelog,
 * in base to systems, subsystems and components dependencies.
 * This function makes sure defined subsystems are children of selected systems
 * and components are children of selected subsystems.
 * @param {Array} systemsIds
 * @param {Array} subsystemsIds
 * @param {Array} componentsIds
 * @returns {object} Object with valid ids for systems, subsystems and components.
 * With the following structure:
 * {
 *  systemsIds: ["sid-1", "sid-2", ...],
 *  subsystemsIds: ["ssid-1", "ssid-2", ...],
 *  componentsIds: ["cid-1", "cid-2", ...],
 * }
 */
export function validateOBSSystemsSubsystemsComponentsIds(systemsIds, subsystemsIds, componentsIds) {
  const selectedSystems = Object.keys(OLE_OBS_SYSTEMS).filter((s) => systemsIds?.includes(OLE_OBS_SYSTEMS[s].id));
  const selectedSubsystems = Object.keys(OLE_OBS_SUBSYSTEMS).filter((ss) =>
    subsystemsIds?.includes(OLE_OBS_SUBSYSTEMS[ss].id),
  );
  const selectedComponents = Object.keys(OLE_OBS_SUBSYSTEMS_COMPONENTS).filter((c) =>
    componentsIds?.includes(OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id),
  );

  const availableSubsystemsIds =
    selectedSystems
      ?.map((s) => {
        return OLE_OBS_SYSTEMS[s].children;
      })
      .flat() ?? [];

  const filteredSubsystemOptions = Object.keys(OLE_OBS_SUBSYSTEMS)
    .filter((ss) => {
      return availableSubsystemsIds.includes(OLE_OBS_SUBSYSTEMS[ss].id);
    })
    .sort();

  const validSubsystems = selectedSubsystems.filter((ss) => filteredSubsystemOptions.includes(ss));

  const availableComponentsIds =
    validSubsystems
      ?.map((ss) => {
        return OLE_OBS_SUBSYSTEMS[ss].children;
      })
      .flat() ?? [];

  const filteredComponentOptions = Object.keys(OLE_OBS_SUBSYSTEMS_COMPONENTS)
    .filter((c) => {
      return availableComponentsIds.includes(OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id);
    })
    .sort();

  const validComponents = selectedComponents.filter((c) => filteredComponentOptions.includes(c));

  const validSystemsIds = selectedSystems.map((s) => OLE_OBS_SYSTEMS[s].id);
  const validSubsystemsIds = validSubsystems.map((ss) => OLE_OBS_SUBSYSTEMS[ss].id);
  const validComponentsIds = validComponents.map((c) => OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id);

  return {
    systemsIds: validSystemsIds,
    subsystemsIds: validSubsystemsIds,
    componentsIds: validComponentsIds,
  };
}

/**
 * Function to get OBS systems, subsystems and components ids.
 * @param {object} systemsHierarchy array of JSON objects with the components in the form of:
 * [
 *  {
 *   name: "System-A",
 *   children: [
 *     {
 *       name: "Subsystem-A",
 *       children: [
 *         {
 *           name: "Component-A",
 *         },
 *       ],
 *     },
 *     {
 *       name: "Subsystem-B",
 *       children: [
 *         {
 *           name: "Component-B",
 *         },
 *       ],
 *     },
 *   ],
 *  },
 * ]
 * @returns {object} Object with valid ids for systems, subsystems and components.
 */
export function getOBSSystemsSubsystemsComponentsIds(systemsHierarchy) {
  const systemsIds = [];
  const subsystemsIds = [];
  const componentsIds = [];

  const availableSystems = Object.entries(OLE_OBS_SYSTEMS).map(([sn, s]) => ({ name: sn, ...s }));

  const systems = systemsHierarchy.map((sh) => {
    const system = availableSystems.find((sa) => sa.name.includes(sh.name));
    return { ...system, children: sh.children };
  });

  systems.forEach((system) => {
    const systemName = system.name;
    systemsIds.push(system.id);

    if (system.children) {
      const availableSubsystemsIds = OLE_OBS_SYSTEMS[systemName]?.children;
      const availableSubsystems = Object.entries(OLE_OBS_SUBSYSTEMS)
        .filter(([ssn, ss]) => {
          return availableSubsystemsIds.includes(ss.id);
        })
        .map(([ssn, ss]) => ({ name: ssn, ...ss }));

      const subsystems = system.children.map((ss) => {
        const subsystem = availableSubsystems.find((ssa) => ssa.name.includes(ss.name));
        return { ...subsystem, children: ss.children };
      });

      subsystems.forEach((subsystem) => {
        const subsystemName = subsystem.name;
        subsystemsIds.push(subsystem.id);

        if (subsystem.children) {
          const availableComponentsIds = OLE_OBS_SUBSYSTEMS[subsystemName]?.children;
          const availableComponents = Object.entries(OLE_OBS_SUBSYSTEMS_COMPONENTS)
            .filter(([cn, c]) => {
              return availableComponentsIds.includes(c.id);
            })
            .map(([cn, c]) => ({ name: cn, ...c }));

          const components = subsystem.children.map((c) => {
            const component = availableComponents.find((ca) => ca.name.includes(c.name));
            return { ...component };
          });

          components.forEach((component) => {
            componentsIds.push(component.id);
          });
        }
      });
    }
  });

  return {
    systemsIds,
    subsystemsIds,
    componentsIds,
  };
}

/**
 * Retrieves the EFD instance associated with the current hostname.
 * If no instance is found for the hostname, an error toast is displayed.
 *
 * @returns {string|null} The EFD instance for the current hostname, or null if not found.
 */
export function getEFDInstanceForHost() {
  const efdInstance = EFD_INSTANCES[window.location.hostname];
  if (!efdInstance) {
    toast.error('EFD instance not found for this hostname');
    return null;
  }
  return efdInstance;
}
