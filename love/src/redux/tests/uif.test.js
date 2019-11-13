import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';
import { getTokenFromStorage } from '../actions/auth';
import { requestWorkspaces } from '../actions/uif';
import { getWorkspaces } from '../selectors';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

const mockWorkspaces = [
  {
    "id": 0,
    "creation_timestamp": "2019-11-13T21:14:03.441Z",
    "update_timestamp": "2019-11-13T21:14:03.441Z",
    "name": "My-workspace",
    "views": [0, 1, 2]
  }
];

describe('GIVEN there are no workspaces in the store', () => {

  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('WHEN the workspaces are requested, THEN the state should contain the workspaces', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/`;
    fetchMock.mock(url, mockWorkspaces, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(requestWorkspaces());
    // Assert:
    const retrievedWorkspaces = getWorkspaces(store.getState());
    expect(retrievedWorkspaces).toEqual(mockWorkspaces);
  });
});
