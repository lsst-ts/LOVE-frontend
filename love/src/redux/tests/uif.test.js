import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';
import { getTokenFromStorage } from '../actions/auth';
import {
  requestWorkspaces,
  requestWorkspace,
  receiveWorkspaces,
  requestViews,
  updateEditedView,
  saveEditedView,
} from '../actions/uif';
import {
  getViews,
  getWorkspaces,
  getCurrentWorkspace,
  getEditedView,
  getEditedViewStatus,
  getEditedViewData,
} from '../selectors';
import { editViewStates } from '../reducers/uif';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

const mockWorkspaces = [
  {
    id: 0,
    creation_timestamp: '2019-11-13T21:14:03.441Z',
    update_timestamp: '2019-11-13T21:14:03.441Z',
    name: 'My-workspace',
    views: [
      {
        id: 0,
        name: 'My-view-0',
      },
      {
        id: 1,
        name: 'My-view-1',
      },
    ],
  },
  {
    id: 1,
    creation_timestamp: '2019-11-13T21:14:03.441Z',
    update_timestamp: '2019-11-13T21:14:03.441Z',
    name: 'My-workspace',
    views: [
      {
        id: 2,
        name: 'My-view-2',
      },
      {
        id: 3,
        name: 'My-view-3',
      },
    ],
  },
];

const mockViews = [
  {
    id: 0,
    creation_timestamp: '2019-11-18T18:36:54.570Z',
    update_timestamp: '2019-11-18T18:36:54.570Z',
    name: 'My-view-0',
    data: {
      key1: 'value1',
      key2: 'value2',
    },
  },
  {
    id: 1,
    creation_timestamp: '2019-11-18T18:36:54.570Z',
    update_timestamp: '2019-11-18T18:36:54.570Z',
    name: 'My-view-1',
    data: {
      key1: 'value1',
      key2: 'value2',
    },
  },
];

const newViewData = {
  id: 0,
  creation_timestamp: '2019-11-18T18:36:54.570Z',
  update_timestamp: '2019-11-18T18:36:54.570Z',
  name: 'My-view-0',
  data: {
    key1: 'value1',
    key2: 'value2',
  },
};

describe('Get workspaces and views. GIVEN the store is empty', () => {
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
    const retrievedData = getWorkspaces(store.getState());
    expect(retrievedData).toEqual(mockWorkspaces);
  });

  it('WHEN the views are requested, THEN the state should contain the views', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views`;
    fetchMock.mock(url, mockViews, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(requestViews());
    // Assert:
    const retrievedData = getViews(store.getState());
    expect(retrievedData).toEqual(mockViews);
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

describe('Update view under edition. GIVEN the store is empty', () => {
  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('THEN the state should mark the edited view as EMPTY', async () => {
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const data = getEditedViewData(store.getState());
    expect(status).toEqual(editViewStates.EMPTY);
    expect(data).toEqual({});
  });

  it('WHEN the edited view is updated, THEN the state should contain the view', async () => {
    // Act:
    await store.dispatch(updateEditedView(newViewData.data));
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const retrievedData = getEditedView(store.getState());
    expect(status).toEqual(editViewStates.UNSAVED);
    expect(retrievedData).toEqual(newViewData.data);
  });
});

describe('Save a new view under edition. GIVEN the store contains a view under edition', () => {
  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
    await store.dispatch(updateEditedView(newViewData.data));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('WHEN the edited view is saved, THEN the state should update the current view with the id retrived from the server', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views`;
    fetchMock.mock(url, newViewData, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(saveEditedView());
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const editedView = getEditedView(store.getState());
    const data = getEditedViewData(store.getState());
    expect(editedView).toEqual(newViewData.data);
    expect(data).toEqual(newViewData);
  });
});
