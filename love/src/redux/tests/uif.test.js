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
  receiveViews,
  updateEditedView,
  saveEditedView,
  savedEditedView,
  loadViewToEdit,
  clearViewToEdit,
} from '../actions/uif';
import {
  getViews,
  getWorkspaces,
  getCurrentWorkspace,
  getEditedViewCurrent,
  getEditedViewStatus,
  getEditedViewSaved,
} from '../selectors';
import { editViewStates, initialState } from '../reducers/uif';

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

const newViewData2 = {
  id: 0,
  creation_timestamp: '2019-11-18T18:36:54.570Z',
  update_timestamp: '2019-11-18T18:36:54.570Z',
  name: 'My-view-0',
  data: {
    key1: 'value1',
    key2: 'value3',
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
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual(initialState.editedViewStatus);
    expect(current).toEqual(initialState.editedViewCurrent);
    expect(saved).toEqual(initialState.editedViewSaved);
  });

  it('WHEN the edited view is updated, THEN the state should contain the view', async () => {
    // Act:
    await store.dispatch(updateEditedView(newViewData));
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual({
      code: editViewStates.UNSAVED,
      details: null,
    });
    expect(current).toEqual(newViewData);
    expect(saved).toEqual({});
    expect(current).not.toBe(newViewData);
  });
});

describe('Save a new view under edition. GIVEN the store contains a view under edition', () => {
  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
    await store.dispatch(updateEditedView(newViewData));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('WHEN the edited view is saved, THEN the state should update the current view with the id retrived from the server', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views/`;
    fetchMock.post(url, {status: 201, body: newViewData} , ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(saveEditedView());
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual({
      code: editViewStates.SAVED,
      details: null,
    });
    expect(current).toEqual(newViewData);
    expect(saved).toEqual(newViewData);
    expect(current).not.toBe(newViewData);
    expect(saved).not.toBe(newViewData);
    expect(current.data).not.toBe(newViewData.data);
    expect(saved.data).not.toBe(newViewData.data);
  });

  it('WHEN the edited view is saved again, THEN the state should update the status', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views/${newViewData.id}/`;
    await store.dispatch(savedEditedView(newViewData));
    await store.dispatch(updateEditedView(newViewData2));
    fetchMock.put(url, {status: 200, body: newViewData2}, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(saveEditedView());
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual({
      code: editViewStates.SAVED,
      details: null,
    });
    expect(current).toEqual(newViewData2);
    expect(saved).toEqual(newViewData2);
    expect(current).not.toBe(newViewData2);
    expect(saved).not.toBe(newViewData2);
    expect(current.data).not.toBe(newViewData2.data);
    expect(saved.data).not.toBe(newViewData2.data);
  });

  it('WHEN the edited view cannot be saved again, THEN the state should save the error but keep the current data', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views/${newViewData.id}/`;
    await store.dispatch(savedEditedView(newViewData));
    await store.dispatch(updateEditedView(newViewData2));
    const responseBody = {name: 'field is required'};
    fetchMock.put(url, {status: 400, body: responseBody}, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(saveEditedView());
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual({
      code: editViewStates.SAVE_ERROR,
      details: responseBody,
    });
    expect(current).toEqual(newViewData2);
    expect(saved).toEqual(newViewData);
    expect(current).not.toBe(newViewData2);
    expect(saved).not.toBe(newViewData);
    expect(current.data).not.toBe(newViewData2.data);
    expect(saved.data).not.toBe(newViewData.data);
  });
});

describe('Load view to edit. GIVEN the store contains views', () => {
  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
    await store.dispatch(receiveViews(mockViews));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('WHEN one of the views is loaded to edit, THEN the editedView should be updated', async () => {
    // Act:
    await store.dispatch(loadViewToEdit(1));
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual({
      code: editViewStates.SAVED,
      details: null,
    });
    expect(current).toEqual(mockViews[1]);
    expect(saved).toEqual(mockViews[1]);
    expect(current).not.toBe(mockViews[1]);
    expect(current.data).not.toBe(mockViews[1].data);
    expect(saved).not.toBe(mockViews[1]);
    expect(saved.data).not.toBe(mockViews[1].data);
  });

  it('GIVEN one of the views is loaded to edit, WHEN we clear it, THEN the editedView should be cleared', async () => {
    // Arrange:
    await store.dispatch(loadViewToEdit(1));
    // Act:
    await store.dispatch(clearViewToEdit);
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual(initialState.editedViewStatus);
    expect(current).toEqual(initialState.editedViewCurrent);
    expect(saved).toEqual(initialState.editedViewSaved);
    expect(status).not.toBe(initialState.editedViewStatus);
    expect(current).not.toBe(initialState.editedViewCurrent);
    expect(current.data).not.toBe(initialState.editedViewCurrent.data);
    expect(saved).not.toBe(initialState.editedViewSaved);
  });
});
