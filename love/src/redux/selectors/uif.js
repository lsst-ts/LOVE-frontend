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

import { createCachedSelector } from 're-reselect';

/**
 * Return the list of workspaces from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of workspaces
 */
export const getWorkspaces = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.workspaces;
};

/**
 * Return the list of views from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
export const getViews = (state) => {
  if (state.uif === undefined) return undefined;

  // return state.uif.present.views.map((v) => {
  //   const randInt = v.id%3;
  //   let screenSize = '4k';
  //   if (randInt === 0) screenSize = '4k';
  //   else if (randInt === 1) screenSize = 'desktop';
  //   else if (randInt === 2) screenSize = 'mobile';
  //   return {...v, screen: screenSize};
  // });

  return state.uif.present.views.map((v) => {
    let screenSize = 'desktop';
    v.screen ? (screenSize = v.screen) : '';
    return { ...v, screen: screenSize };
  });
};

/**
 * Return the list of cached full views from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
export const getCachedViews = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.cachedViews;
};

/**
 * Return the status of views from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
export const getViewsStatus = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.viewsStatus;
};

/**
 * Return the list of views from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
const getId = (state, id) => id;

export const getView = createCachedSelector(
  // inputSelectors
  getCachedViews,
  getId,
  // resultFunc
  (views, id) => {
    if (views !== undefined) {
      const foundView = views.find((view) => view.id === id);
      return foundView;
    }
    return undefined;
  },
)(
  // re-reselect keySelector (receives selectors' arguments)
  // Use "id" as cacheKey
  (_state_, id /* , id2 */) => id ?? -1,
);

/**
 * Return the matching view summary
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
export const getViewSummary = (state, id) => {
  const views = getViews(state);
  if (views !== undefined) {
    const foundView = views.find((view) => view.id === id);
    return foundView;
  }
  return undefined;
};

/**
 * Return the current workspace from the state
 *
 * @param  {object} state  the state
 * @return {array}        the current workspace
 */
export const getCurrentWorkspace = (state) => {
  if (state.uif === undefined) return undefined;
  const id = state.uif.present.currentWorkspace;
  return state.uif.present.workspaces.find((workspace) => {
    return workspace.id === id;
  });
};

/**
 * Return the current state of the view under edition
 *
 * @param  {object} state  the state
 * @return {object}        the data of the view
 */
export const getEditedViewCurrent = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.editedViewCurrent;
};

/**
 * Return the status the view under edition
 *
 * @param  {object} state  the state
 * @return {string}        the status of the view
 */
export const getEditedViewStatus = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.editedViewStatus;
};

/**
 * Return the data the view under edition
 *
 * @param  {object} state  the state
 * @return {string}        the data of the view
 */
export const getEditedViewSaved = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.editedViewSaved;
};

/**
 * Return the LOVE mode (VIEW or EDIT)
 *
 * @param  {object} state  the state
 * @return {string}        the mode of the LOVE
 */
export const getMode = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.present.mode;
};

/**
 * Return the number of undo actions available
 *
 * @param  {object} state  the state
 * @return {string}        the number of undo actions
 */
export const getUndoActionsAvailable = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.past ? state.uif.past.length : 0;
};

/**
 * Return the number of redo actions available
 *
 * @param  {object} state  the state
 * @return {string}        the number of redo actions
 */
export const getRedoActionsAvailable = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.future ? state.uif.future.length : 0;
};
