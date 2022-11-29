import html2canvas from 'html2canvas';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import Moment from 'moment';
import isEqual from 'lodash/isEqual';
import { WEBSOCKET_SIMULATION } from 'Config.js';

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

  static getMediaBaseUrl() {
    return `http://${window.location.host}/manager/`;
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
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
        if (result.status == 200) {
          return { label: 'EFD Healthy Status Pass', style: 'ok' };
        }
        if (result.status === 503) {
          return { label: 'EFD Healthy Status Fail', style: 'alert' };
        }
        result.json().then((resp) => {
          return { label: 'EFD Healthy Status Unknown', style: 'alert', response: resp };
        });
      })
      .catch((err) => {
        return { label: 'EFD Healthy Status Fail', style: 'alert', error: err };
      });
  }

  static getSALStatus(url, expectedKafkaBrokers = []) {
    if (!url) {
      return new Promise(function (resolve, _) {
        resolve({ label: 'SAL Status URL is not present in LOVE Configuration File', style: 'invalid' });
      });
    }
    return fetchWithTimeout(url, { method: 'GET' }).then((result) => {
      if (result.status >= 500) {
        return { label: 'Error retrieving SAL status, service not available', style: 'alert' };
      }
      if (result.status === 400) {
        return { label: 'Error retrieving SAL status, service not exist', style: 'alert' };
      }
      return result.json().then((res) => {
        if (!res.brokers) {
          return { label: 'Error retrieving SAL status, service is not running properly', style: 'alert' };
        }

        const sameBrokers = expectedKafkaBrokers.every((broker) => res.brokers.includes(broker));
        if (!Array.isArray(res.brokers) || res.brokers?.length === 0 || !sameBrokers) {
          return { label: 'SAL is not running as expected', style: 'alert' };
        }

        return { label: 'SAL Healthy Status Pass', style: 'ok' };
      });
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
      if (response.status === 401 || response.status === 403) {
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

  static getEFDLogs(start_date, end_date, cscs, efd_instance) {
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
      }),
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Server error.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
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
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  // Authlist APIs
  static getAuthListRequests() {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}authlistrequest/`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static requestAuthListAuthorization(
    username,
    cscsToChange,
    authorizedUsers,
    nonAuthorizedCSCs,
    message = null,
    duration = null,
  ) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const { host } = window.location;
    const url = `${this.getApiBaseUrl()}authlistrequest/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        cscs_to_change: cscsToChange,
        authorized_users: authorizedUsers,
        unauthorized_cscs: nonAuthorizedCSCs,
        requested_by: `${username}@${host}`,
        message,
        duration,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        toast.error('Session expired. Logging out.');
        return false;
      }
      if (response.status >= 400 && response.status < 500) {
        toast.error('Unable to save request.');
        return false;
      }
      return response.json().then((resp) => {
        toast.success('Request received.');
        return resp;
      });
    });
  }

  static setAuthListRequestStatus(authRequestId, status, message = null, duration = null) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}authlistrequest/${authRequestId}/`;
    return fetch(url, {
      method: 'PATCH',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        status,
        message,
        duration,
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
      if (response.status >= 400 && response.status < 500) {
        toast.error('Unable to save request.');
        return false;
      }
      return response.json().then((resp) => {
        toast.success('Request updated.');
        return resp;
      });
    });
  }

  // OLE APIs
  static getListExposureLogs(instrument, obsDay, registry = 1) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/exposures?instrument=${instrument}&registry=${registry}&order_by=-obs_id&limit=1500${
      obsDay ? `&min_day_obs=${obsDay}&max_day_obs=${obsDay + 1}` : ''
    }`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getListAllMessagesExposureLogs(obsDay) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/?order_by=-date_added&limit=1000${
      obsDay ? `&min_day_obs=${obsDay}&max_day_obs=${obsDay + 1}` : ''
    }`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
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
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
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
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static createMessageExposureLogs(params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const formData = new FormData();
    for (const param in params) {
      formData.append(param, params[param]);
    }

    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.ack);
        });
      }
      return response.json().then((resp) => {
        toast.success('Log added succesfully.');
        return resp;
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
      formData.append(param, params[param]);
    }

    const url = `${this.getApiBaseUrl()}ole/exposurelog/messages/${msgExposureId}/`;
    return fetch(url, {
      method: 'PUT',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
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
      if (response.status >= 400 && response.status < 500) {
        toast.error('Unable to save request.');
        return false;
      }
      return response.json().then((resp) => {
        toast.success('Log edited succesfully.');
        return resp;
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
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        toast.error('Session expired. Logging out.');
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status >= 400 && response.status < 500) {
        toast.error('Unable to save request.');
        return false;
      }
      return response.json().then((resp) => {
        toast.success(resp.ack);
        return resp;
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
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static getListMessagesNarrativeLogs(from, to) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }
    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/?order_by=-date_added&limit=500${
      from ? `&min_date_added=${from}` : ''
    }${to ? `&max_date_added=${to}` : ''}`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static createMessageNarrativeLogs(params = {}) {
    const token = ManagerInterface.getToken();
    if (token === null) {
      return new Promise((resolve) => resolve(false));
    }

    const formData = new FormData();
    for (const param in params) {
      formData.append(param, params[param]);
    }

    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/`;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
    }).then((response) => {
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status === 400) {
        return response.json().then((resp) => {
          toast.error(resp.ack);
        });
      }
      if (response.status === 422) {
        return response.json().then((resp) => {
          toast.error(resp.detail);
        });
      }
      return response.json().then((resp) => {
        toast.success('Log added succesfully.');
        return resp;
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
      formData.append(param, params[param]);
    }

    const url = `${this.getApiBaseUrl()}ole/narrativelog/messages/${msgNarrativeId}/`;
    return fetch(url, {
      method: 'PUT',
      headers: ManagerInterface.getSimpleHeaders(),
      body: formData,
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
      if (response.status >= 400 && response.status < 500) {
        toast.error('Unable to save request.');
        return false;
      }
      return response.json().then((resp) => {
        toast.success('Log edited succesfully.');
        return resp;
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
      if (response.status >= 500) {
        toast.error('Error communicating with the server.');
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        toast.error('Session expired. Logging out.');
        ManagerInterface.removeToken();
        return false;
      }
      if (response.status >= 400 && response.status < 500) {
        toast.error('Unable to save request.');
        return false;
      }
      return response.json().then((resp) => {
        toast.success(resp.ack);
        return resp;
      });
    });
  }

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
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
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
      if (response.status === 401 || response.status === 403) {
        ManagerInterface.removeToken();
        return false;
      }
      return response.json().then((resp) => {
        return resp;
      });
    });
  }

  static updateScriptSchema(id, configSchema) {
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
      }),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
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

  static postScriptConfiguration(scriptPath, scriptType, configName, configSchema) {
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
      }),
    }).then((response) => {
      if (response.status >= 500) {
        return false;
      }
      if (response.status === 401 || response.status === 403) {
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
  };

  const watcherErrorCmds = {
    cmd_acknowledge: 'acknowledging',
    cmd_mute: 'muting',
    cmd_unmute: 'unmuting',
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
 * Converts a timestamp into  "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 * @param {date-able} timestamp if float it must be in milliseconds
 * @param {string} location optional location to append to the timestamp, TAI by default
 * @returns {string} "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 */
export const formatTimestamp = (timestamp, location = 'TAI') => {
  const t = parseTimestamp(timestamp);
  return `${t.toUTC().toFormat('yyyy/MM/dd HH:mm:ss')} ${location}`;
};

/**
 * Converts a timestamp into  "YYYY/MM/DD HH:MM:SS  <location>" formatted string
 * @param {date-able} timestamp if float it must be in milliseconds
 * @param {string} location optional location to append to the timestamp, empty by default
 * @returns {string} ISO time string
 */
export const isoTimestamp = (timestamp, location = null) => {
  const t = parseTimestamp(timestamp);
  return [t.toUTC().toISO(), location || null].join(' ');
};

/**
 * Converts seconds to a human readable difference like 'a few seconds ago'
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
 * Converts seconds to digital format as '00:00:00'
 * @param {number} time seconds to be converted
 * @returns {string} seconds in digitial format
 */
export const formatSecondsToDigital = (time) => {
  let seconds = time % 60;
  let minutes = Math.floor((time % 3600) / 60);
  let hours = Math.floor(time / 3600);
  minutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
  seconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;
  hours = hours.toString().length === 1 ? `0${hours}` : hours;
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Function to converts digital format '00:00:00' to seconds
 * @param {string} time in digital format
 * @returns {number} digital time in seconds
 */
export const formatDigitalToSeconds = (time) => {
  const tokens = time.split(':');
  return parseInt(tokens[0], 10) * 3600 + parseInt(tokens[1], 10) * 60 + parseInt(tokens[2], 10);
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
export const parsePlotInputs = (inputs) => {
  const cscs = {};
  Object.values(inputs).forEach((input) => {
    if (!input.values) {
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
      // Next line was added to support EFD Querying for Array type items (influx)
      newIndexDict[input.topic] = [`${input.item}${input.arrayIndex ?? ''}`];
      // newIndexDict[input.topic] = [input.item]; // Original line

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
    } else {
      Object.values(input.values).forEach((value) => {
        const cscDict = cscs?.[value.csc];
        const indexDict = cscs?.[value.csc]?.[value.salindex];
        const topicDict = cscs?.[value.csc]?.[value.salindex]?.[value.topic];
        let newTopicDict = topicDict ?? [];
        let newIndexDict = indexDict ?? {};
        const newCSCDict = cscDict ?? {};
        if (topicDict) {
          newIndexDict[value.topic].push(value.item);
          return;
        }
        // Next line was added to support EFD Querying for Array type items (influx)
        newIndexDict[value.topic] = [`${value.item}${value.arrayIndex ?? ''}`];
        // newIndexDict[value.topic] = [value.item]; // Original line

        newTopicDict = newIndexDict[value.topic];
        if (indexDict) {
          newCSCDict[value.salindex][value.topic] = newTopicDict;
          newIndexDict = newCSCDict[value.salindex];
        } else {
          newIndexDict = {
            [value.topic]: newTopicDict,
          };
          newCSCDict[value.salindex] = newIndexDict;
        }
        if (cscDict) {
          cscs[value.csc][value.salindex] = newIndexDict;
        } else {
          cscs[value.csc] = {
            [value.salindex]: newIndexDict,
          };
        }
      });
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
      // Next line was added to support EFD Querying for Array type items (influx)
      const formattedPropertyKey = propertyKey.replace(/[\d\.]+$/, '');
      newTopicData[formattedPropertyKey] = propertyDataArray.map((dataPoint) => {
        const tsString = dataPoint?.ts.split(' ').join('T');
        return { [tsLabel]: parseTimestamp(tsString), [valueLabel]: dataPoint?.value };
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
 * Function used to check if an entity is present in some parameter of the authlist event.
 * @param {object} authlist the authlist object with params: authorizedUsers & nonAuthorizedCSCs
 * @param {entity} string entity to be checked on authlist, can take two formats: <user@host> or <CSC:salindex>
 * @returns {object} object with two boolean parameters: inAuthorizedUsers and inNonAuthorizedCSCs
 */
export function checkAuthlist(authlist, entity) {
  const inAuthorizedUsers = authlist?.authorizedUsers?.value?.includes(entity);
  const inNonAuthorizedCSCs = authlist?.nonAuthorizedCSCs?.value?.includes(entity);
  return { inAuthorizedUsers, inNonAuthorizedCSCs };
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
 * @param {string} urls array of urls that comes from OLE message
 * @returns {string} string with first url with the condition if jira link
 */
export function getLinkJira(urls) {
  if (!urls) return '';
  const filtered = urls.filter((url) => url.includes('jira'));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return '';
}

/**
 * Function to get OLE Narrative and Exposure logs parameters from urls field.
 * @param {string} urls array of urls that comes from OLE message
 * @returns {string} string with first url with the condition if not jira link
 */
export function getFileURL(urls) {
  if (!urls) return '';
  const filtered = urls.filter((url) => !url.includes('jira'));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return '';
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
