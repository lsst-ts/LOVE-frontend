import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';
import { getTokenFromStorage } from '../actions/auth';
import { requestWorkspaces, requestWorkspace, receiveWorkspaces } from '../actions/uif';
import { getViews, getWorkspaces, getCurrentWorkspace } from '../selectors';

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
    "views": [
      {
        "id": 0,
        "name": "My-view-0",
      },
      {
        "id": 1,
        "name": "My-view-1",
      },
    ]
  },
  {
    "id": 1,
    "creation_timestamp": "2019-11-13T21:14:03.441Z",
    "update_timestamp": "2019-11-13T21:14:03.441Z",
    "name": "My-workspace",
    "views": [
      {
        "id": 2,
        "name": "My-view-2",
      },
      {
        "id": 3,
        "name": "My-view-3",
      },
    ]
  },
];

const mockViews = [
  {
    "id": 0,
    "creation_timestamp": "2019-11-18T18:36:54.570Z",
    "update_timestamp": "2019-11-18T18:36:54.570Z",
    "name": "My-view-0",
    "data": {
      "key1": "value1",
      "key2": "value2",
    }
  },
  {
    "id": 1,
    "creation_timestamp": "2019-11-18T18:36:54.570Z",
    "update_timestamp": "2019-11-18T18:36:54.570Z",
    "name": "My-view-1",
    "data": {
      "key1": "value1",
      "key2": "value2",
    }
  },
]

describe('GIVEN the store is empty', () => {

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
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/with_view_name`;
    fetchMock.mock(url, mockWorkspaces, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(requestWorkspaces());
    // Assert:
    const retrievedWorkspaces = getWorkspaces(store.getState());
    expect(retrievedWorkspaces).toEqual(mockWorkspaces);
  });
});

describe('GIVEN the store contains the list of workspaces', () => {

  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
    await store.dispatch(receiveWorkspaces(mockWorkspaces));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('WHEN a full workspace is requested, THEN the state should contain the workspace', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/0/full`;
    const mockFullWorkspace = {
      ...mockWorkspaces[0],
      views: mockViews,
    };
    fetchMock.mock(url, mockFullWorkspace, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(requestWorkspace(0));
    // Assert:
    const retrievedCurrentWorkspace = getCurrentWorkspace(store.getState());
    const retrievedViews = getViews(store.getState());
    expect(retrievedViews).toEqual(mockViews);
    expect(retrievedCurrentWorkspace).toEqual(mockWorkspaces[0]);
  });
});
