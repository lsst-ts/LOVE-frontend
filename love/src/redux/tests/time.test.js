import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { DateTime, Settings } from 'luxon';
import { emptyToken, doReceiveToken, logout } from '../actions/auth';
import { clockStart, clockStop, receiveServerTime, tick } from '../actions/time';
import { clockStatuses, initialState } from '../reducers/time';
import { connectionStates } from '../actions/ws';
import { getConnectionStatus, getAllTime } from '../selectors';
import { siderealSecond } from '../../Utils';

let store, server;

beforeEach(async () => {
  // ARRANGE
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  await store.dispatch(emptyToken);
});

// TEST TIME INDEPENDENTLY
describe('Given the inital state', () => {
  const server_time = {
    utc: 1587747218.377,
    tai: 1587747255.377,
    mjd: 58963.70391640712,
    sidereal_greenwich: 7.105572546869015,
    sidereal_summit: 2.388944746869015,
    tai_to_utc: -37,
  };

  it('When the clock starts then its status is STARTED, and when it stops then the status is STOPPED', async () => {
    jest.useFakeTimers();
    // BEFORE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    // START
    await store.dispatch(clockStart());
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
    expect(clearInterval).toHaveBeenCalledTimes(2);
    expect(setInterval).toHaveBeenCalledTimes(2);
    // STOP
    await store.dispatch(clockStop());
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    expect(clearInterval).toHaveBeenCalledTimes(4);
  });

  it('When we receive server time, then it is saved', async () => {
    // ARRANGE
    let time = getAllTime(store.getState());
    expect(time).toEqual(initialState);
    const request_time = DateTime.utc().toMillis() / 1000;
    // ACT
    await store.dispatch(receiveServerTime(server_time, request_time));
    // ASSERT
    time = getAllTime(store.getState());
    expect(time.server_time).toEqual(server_time);
    expect(time.request_time).toEqual(request_time);
    expect(time.receive_time).toBeTruthy();
    expect(time.clock).toEqual(initialState.clock);
  });

  it('When the CLOCK TICKS, then the internal clock is updated', async () => {
    // ARRANGE
    const request_time = DateTime.utc().toMillis() / 1000;
    await store.dispatch(receiveServerTime(server_time, request_time));
    // ACT
    await store.dispatch(tick());
    // ASSERT
    let time = getAllTime(store.getState());
    expect(time.clock).not.toEqual(initialState.clock);
  });

  it('Test tick under different cases of differences between local and server time', async () => {
    // Config
    const cases = [
      { // In sync
        request_time: server_time.utc - 1,
        receive_time: server_time.utc + 1,
      },
      { // Local 5 minutes behind server
        request_time: server_time.utc - 1 - 5*60,
        receive_time: server_time.utc + 1 - 5*60,
      },
      { // Local 5 minutes ahead of server
        request_time: server_time.utc - 1 + 5*60,
        receive_time: server_time.utc + 1 + 5*60,
      },
    ];
    for (const element of cases) {
      const request_time = element.request_time;
      const receive_time = element.receive_time;
      const tick_time = receive_time + 5;
      const diff = tick_time - (receive_time + request_time) / 2;
      // Receive Server time
      Settings.now = () => new Date(receive_time * 1000).valueOf();
      await store.dispatch(receiveServerTime(server_time, request_time));
      // Tick
      Settings.now = () => new Date(tick_time * 1000).valueOf();
      await store.dispatch(tick());
      // Assert
      let time = getAllTime(store.getState());
      expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + diff);
      expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + diff);
      expect(time.clock.mjd).toEqual(server_time.mjd + diff / (3600*24));
      expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(server_time.sidereal_greenwich * 3600 + diff * siderealSecond);
      expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time.sidereal_summit * 3600 + diff * siderealSecond);
    };
  });
});

// TEST TIME PASS
describe('Given the inital state', () => {
  const server_time = {
    utc: 1587747218.377,
    tai: 1587747255.377,
    mjd: 58963.70391640712,
    sidereal_greenwich: 7.105572546869015,
    sidereal_summit: 2.388944746869015,
    tai_to_utc: -37,
  };

  it('When the clock starts then its status is STARTED, and when it stops then the status is STOPPED', async () => {
    // Arrange
    const request_time = server_time.utc - 1;
    const receive_time = server_time.utc + 1;
    jest.useFakeTimers();
    let time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
    expect(time.clock).toEqual(initialState.clock);
    
    // Login should start time
    let tick_time = (receive_time + request_time) / 2 + 1;
    Settings.now = () => new Date(receive_time * 1000).valueOf();
    await store.dispatch(doReceiveToken('username', 'love-token', {}, server_time, request_time));
    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STARTED);
    expect(clearInterval).toHaveBeenCalledTimes(2);
    expect(setInterval).toHaveBeenCalledTimes(2);

    // It should have ticked once
    expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + 1);
    expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + 1);
    expect(time.clock.mjd).toEqual(server_time.mjd + 1 / (3600*24));
    expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(server_time.sidereal_greenwich * 3600 + 1 * siderealSecond);
    expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time.sidereal_summit * 3600 + 1 * siderealSecond);

    // Next 10 ticks
    for (let diff = 2; diff < 10; diff++) {
      tick_time = tick_time + 1;
      Settings.now = () => new Date(tick_time * 1000).valueOf();
      jest.advanceTimersByTime(1000);
      time = getAllTime(store.getState());
      expect(time.clock).not.toEqual(initialState.clock);
      expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + diff);
      expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + diff);
      expect(time.clock.mjd).toEqual(server_time.mjd + diff / (3600*24));
      expect(time.clock.sidereal_greenwich.toSeconds().toFixed(10)).toEqual((server_time.sidereal_greenwich * 3600 + diff * siderealSecond).toFixed(10));
      expect(time.clock.sidereal_summit.toSeconds().toFixed(10)).toEqual((server_time.sidereal_summit * 3600 + diff * siderealSecond).toFixed(10));
    }

    // Logout should stop timer
    await store.dispatch(logout());
    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
    expect(clearInterval).toHaveBeenCalledTimes(4);
  });
});

// TEST TIME PASS
describe('Given the inital state', () => {
  const server_time = [
    {
      utc: 1587747218.377,
      tai: 1587747255.377,
      mjd: 58963.70391640712,
      sidereal_greenwich: 7.105572546869015,
      sidereal_summit: 2.388944746869015,
      tai_to_utc: -37,
    },
    {
      utc: 1587747228.377,
      tai: 1587747265.377,
      mjd: 58963.80391640712,
      sidereal_greenwich: 7.205572546869015,
      sidereal_summit: 2.488944746869015,
      tai_to_utc: -37,
    },
  ];
  let serverIndex = 0;

  beforeEach(async () => {
    // ARRANGE
    store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
    await store.dispatch(emptyToken);
    server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
    server.on('connection', socket => {
      const [, token] = socket.url.split('?token=');
      if (token !== 'love-token') {
        socket.close();
      }
      socket.on('message', msg => {
        const message = JSON.parse(msg);
        server.send({
          time_data: server_time[serverIndex],
          request_time: message.request_time,
        });
        serverIndex++;
      });
    });
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });
  
  afterEach(() => {
    WS.clean();
  });

  it.only('When the clock starts then its status is STARTED, and when it stops then the status is STOPPED', async () => {
    // Arrange
    const request_time = server_time[serverIndex].utc - 1;
    const receive_time = server_time[serverIndex].utc + 1;
    let time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
    expect(time.clock).toEqual(initialState.clock);
    
    // Login should start time
    let tick_time = (receive_time + request_time) / 2 + 1;
    Settings.now = () => new Date(receive_time * 1000).valueOf();
    jest.useFakeTimers();
    await store.dispatch(doReceiveToken('username', 'love-token', {}, server_time[serverIndex], request_time));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    jest.advanceTimersByTime(10);
    const connected = await server.connected;
    expect(connected.readyState).toEqual(WebSocket.OPEN);
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STARTED);

    // It should have ticked once
    expect(time.clock.utc.toSeconds()).toEqual(server_time[serverIndex].utc + 1);
    expect(time.clock.tai.toSeconds()).toEqual(server_time[serverIndex].tai + 1);
    expect(time.clock.mjd).toEqual(server_time[serverIndex].mjd + 1 / (3600*24));
    expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(server_time[serverIndex].sidereal_greenwich * 3600 + 1 * siderealSecond);
    expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time[serverIndex].sidereal_summit * 3600 + 1 * siderealSecond);

    // Next 10 ticks
    for (let diff = 2; diff <= 10; diff++) {
      console.log('diff: ', diff)
      tick_time = tick_time + 1;
      Settings.now = () => new Date(tick_time * 1000).valueOf();
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      jest.advanceTimersByTime(1000);
      time = getAllTime(store.getState());
      expect(time.clock).not.toEqual(initialState.clock);
      console.log('expected2: ', server_time[serverIndex].utc + diff)
      expect(time.clock.utc.toSeconds()).toEqual(server_time[serverIndex].utc + diff);
      expect(time.clock.tai.toSeconds()).toEqual(server_time[serverIndex].tai + diff);
      expect(time.clock.mjd).toEqual(server_time[serverIndex].mjd + diff / (3600*24));
      expect(time.clock.sidereal_greenwich.toSeconds().toFixed(10)).toEqual((server_time[serverIndex].sidereal_greenwich * 3600 + diff * siderealSecond).toFixed(10));
      expect(time.clock.sidereal_summit.toSeconds().toFixed(10)).toEqual((server_time[serverIndex].sidereal_summit * 3600 + diff * siderealSecond).toFixed(10));
    }

    // Logout should stop timer
    await store.dispatch(logout());
    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
  });
});