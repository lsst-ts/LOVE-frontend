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
  return state.uif.present.views;
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
export const getView = (state, id) => {
  const views = getCachedViews(state);
  // if (views === undefined || views.length === 0) return undefined;
  // return views.find((view) => view.id === id);
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
