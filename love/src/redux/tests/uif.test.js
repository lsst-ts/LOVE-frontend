/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';
import { getTokenFromStorage } from '../actions/auth';
import {
  requestWorkspaces,
  requestWorkspace,
  receiveWorkspaces,
  requestViews,
  requestViewToEdit,
  receiveViews,
  receiveView,
  updateEditedView,
  saveEditedView,
  savedEditedView,
  loadViewToEdit,
  clearViewToEdit,
  changeMode,
} from '../actions/uif';
import {
  getViews,
  getView,
  getViewSummary,
  getViewsStatus,
  getWorkspaces,
  getCurrentWorkspace,
  getEditedViewCurrent,
  getEditedViewStatus,
  getEditedViewSaved,
  getMode,
} from '../selectors';
import { editViewStates, viewsStates, initialState, modes } from '../reducers/uif';

let store;

beforeAll(async () => {
  // Arrange
  const url = `${ManagerInterface.getUifBaseUrl()}views/summary/`;
  fetchMock.mock(url, {
    status: 200,
    data: {},
  });
});

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

const detailedMockViews = [
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

const mockViews = [
  {
    id: 0,
    name: 'My-view-0',
    screen: 'desktop',
  },
  {
    id: 1,
    name: 'My-view-1',
    screen: 'desktop',
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
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/with_view_name/`;
    fetchMock.mock(url, mockWorkspaces, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(requestWorkspaces());
    // Assert:
    const retrievedData = getWorkspaces(store.getState());
    expect(retrievedData).toEqual(mockWorkspaces);
  });

  it('WHEN the views are requested, THEN the state should contain the views', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views/summary/`;
    fetchMock.mock(url, mockViews, ManagerInterface.getHeaders());
    let viewsStatus = getViewsStatus(store.getState());
    expect(viewsStatus).toEqual(viewsStates.EMPTY);
    // Act:
    await store.dispatch(requestViews());
    // Assert:
    const views = getViews(store.getState());
    viewsStatus = getViewsStatus(store.getState());
    expect(views).toEqual(mockViews);
    expect(viewsStatus).toEqual(viewsStates.LOADED);
  });

  it('WHEN the views are requested, THEN a view name should be obtainable', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views/summary/`;
    fetchMock.mock(url, mockViews, ManagerInterface.getHeaders());
    let viewsStatus = getViewsStatus(store.getState());
    expect(viewsStatus).toEqual(viewsStates.EMPTY);
    // Act:
    await store.dispatch(requestViews());
    // Assert:
    const viewSummary = getViewSummary(store.getState(), 1);
    viewsStatus = getViewsStatus(store.getState());
    expect(viewSummary).toEqual(mockViews[1]);
    expect(viewsStatus).toEqual(viewsStates.LOADED);
  });
});

describe('Fail getting workspaces and views. GIVEN the store is empty', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it(
    'WHEN the workspaces request fails due to unauthentication,' + 'THEN the state workspaces should be empty',
    async () => {
      // Arrange:
      const responseBody = { detail: 'Authentication credentials were not provided.' };
      const url = `${ManagerInterface.getUifBaseUrl()}workspaces/with_view_name/`;
      fetchMock.mock(url, { status: 401, body: responseBody }, ManagerInterface.getHeaders());
      // Act:
      await store.dispatch(requestWorkspaces());
      // Assert:
      const retrievedData = getWorkspaces(store.getState());
      const viewsStatus = getViewsStatus(store.getState());
      expect(retrievedData).toEqual([]);
      expect(viewsStatus).toEqual(viewsStates.ERROR);
    },
  );

  it('WHEN the views request fails due to unauthentication,' + 'THEN the state views should be empty', async () => {
    // Arrange:
    const responseBody = { detail: 'Authentication credentials were not provided.' };
    const url = `${ManagerInterface.getUifBaseUrl()}views/summary/`;
    fetchMock.mock(url, { status: 401, body: responseBody }, ManagerInterface.getHeaders());
    let viewsStatus = getViewsStatus(store.getState());
    expect(viewsStatus).toEqual(viewsStates.EMPTY);
    // Act:
    await store.dispatch(requestViews());
    // Assert:
    const views = getViews(store.getState());
    viewsStatus = getViewsStatus(store.getState());
    expect(views).toEqual([]);
    expect(viewsStatus).toEqual(viewsStates.ERROR);
  });

  it(
    'WHEN the workspaces request fails due to permissions,' + 'THEN the state workspaces should be empty',
    async () => {
      // Arrange:
      const responseBody = { detail: 'Unautorized.' };
      const url = `${ManagerInterface.getUifBaseUrl()}workspaces/with_view_name/`;
      fetchMock.mock(url, { status: 403, body: responseBody }, ManagerInterface.getHeaders());
      // Act:
      await store.dispatch(requestWorkspaces());
      // Assert:
      const retrievedData = getWorkspaces(store.getState());
      const viewsStatus = getViewsStatus(store.getState());
      expect(retrievedData).toEqual([]);
      expect(viewsStatus).toEqual(viewsStates.ERROR);
    },
  );

  it('WHEN the views request fails due to permissions,' + 'THEN the state views should be empty', async () => {
    // Arrange:
    const responseBody = { detail: 'Unautorized.' };
    const url = `${ManagerInterface.getUifBaseUrl()}views/summary/`;
    fetchMock.mock(url, { status: 403, body: responseBody }, ManagerInterface.getHeaders());
    let viewsStatus = getViewsStatus(store.getState());
    expect(viewsStatus).toEqual(viewsStates.EMPTY);
    // Act:
    await store.dispatch(requestViews());
    // Assert:
    const views = getViews(store.getState());
    viewsStatus = getViewsStatus(store.getState());
    expect(views).toEqual([]);
    expect(viewsStatus).toEqual(viewsStates.ERROR);
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

  it('WHEN a full workspace is requested,' + 'THEN the state should contain the workspace', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/0/full/`;
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
    await store.dispatch(receiveViews(mockViews));
    await store.dispatch(updateEditedView(newViewData));
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it(
    'WHEN the edited view is saved,' +
      'THEN the state should update the current view with the id retrived from the server',
    async () => {
      // Arrange:
      const url = `${ManagerInterface.getUifBaseUrl()}views/`;
      fetchMock.post(url, { status: 201, body: newViewData }, ManagerInterface.getHeaders());
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
      expect(saved).not.toBe(current);
      expect(saved.data).not.toBe(current.data);
    },
  );

  it('WHEN the edited view is saved again, THEN the state should update the status', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}views/${newViewData.id}/`;
    await store.dispatch(savedEditedView(newViewData));
    await store.dispatch(updateEditedView(newViewData2));
    fetchMock.put(url, { status: 200, body: newViewData2 }, ManagerInterface.getHeaders());
    // Act:
    await store.dispatch(saveEditedView());
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    const view = getView(store.getState(), newViewData.id);
    expect(status).toEqual({
      code: editViewStates.SAVED,
      details: null,
    });
    expect(current).toEqual(newViewData2);
    expect(saved).toEqual(newViewData2);
    expect(view).toEqual(newViewData2);
    expect(current).not.toBe(newViewData2);
    expect(saved).not.toBe(newViewData2);
    expect(view).not.toBe(newViewData2);
    expect(current.data).not.toBe(newViewData2.data);
    expect(saved.data).not.toBe(newViewData2.data);
    expect(view.data).not.toBe(newViewData2.data);
    expect(saved).not.toBe(current);
    expect(saved.data).not.toBe(current.data);
  });

  it(
    'WHEN the edited view cannot be saved again,' + 'THEN the state should save the error but keep the current data',
    async () => {
      // Arrange:
      const url = `${ManagerInterface.getUifBaseUrl()}views/${newViewData.id}/`;
      await store.dispatch(savedEditedView(newViewData));
      await store.dispatch(updateEditedView(newViewData2));
      const responseBody = { name: 'field is required' };
      fetchMock.put(url, { status: 400, body: responseBody }, ManagerInterface.getHeaders());
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
      expect(saved).not.toBe(current);
      expect(saved.data).not.toBe(current.data);
    },
  );
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
    const url = `${ManagerInterface.getUifBaseUrl()}views/1/`;
    fetchMock.mock(url, { ...detailedMockViews[1] }, ManagerInterface.getHeaders());
    await store.dispatch(requestViewToEdit(1));
    await store.dispatch(receiveView(detailedMockViews[1]));
    // Assert:
    const status = getEditedViewStatus(store.getState());
    const current = getEditedViewCurrent(store.getState());
    const saved = getEditedViewSaved(store.getState());
    expect(status).toEqual({
      code: editViewStates.SAVED,
      details: null,
    });
    expect(current).toEqual(detailedMockViews[1]);
    expect(saved).toEqual(detailedMockViews[1]);
    expect(current).not.toBe(detailedMockViews[1]);
    expect(current.data).not.toBe(detailedMockViews[1].data);
    expect(saved).not.toBe(detailedMockViews[1]);
    expect(saved).not.toBe(current);
    expect(saved.data).not.toBe(current.data);
    expect(saved.data).not.toBe(detailedMockViews[1].data);
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

describe('Change mode', () => {
  it('GIVEN LOVE is in VIEW mode, WHEN it changes to EDIT, THEN the mode is EDIT', async () => {
    // Arrange:
    expect(getMode(store.getState())).toEqual(modes.VIEW);
    // Act:
    await store.dispatch(changeMode(modes.EDIT));
    // Assert:
    expect(getMode(store.getState())).toEqual(modes.EDIT);
  });

  it('GIVEN LOVE is in EDIT mode, WHEN it changes to VIEW, THEN the mode is VIEW', async () => {
    // Arrange:
    await store.dispatch(changeMode(modes.EDIT));
    expect(getMode(store.getState())).toEqual(modes.EDIT);
    // Act:
    await store.dispatch(changeMode(modes.VIEW));
    // Assert:
    expect(getMode(store.getState())).toEqual(modes.VIEW);
  });
});
