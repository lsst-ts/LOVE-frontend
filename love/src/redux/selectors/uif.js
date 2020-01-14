
/**
 * Return the list of workspaces from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of workspaces
 */
export const getWorkspaces = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.workspaces;
};


/**
 * Return the list of views from the state
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
export const getViews = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.views;
};

/**
 * Return the current workspace from the state
 *
 * @param  {object} state  the state
 * @return {array}        the current workspace
 */
export const getCurrentWorkspace = (state) => {
  if (state.uif === undefined) return undefined;
  const id = state.uif.currentWorkspace;
  return state.uif.workspaces.find(function(workspace) {
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
  return state.uif.editedViewCurrent;
};


/**
 * Return the status the view under edition
 *
 * @param  {object} state  the state
 * @return {string}        the status of the view
 */
export const getEditedViewStatus = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.editedViewStatus;
};

/**
 * Return the data the view under edition
 *
 * @param  {object} state  the state
 * @return {string}        the data of the view
 */
export const getEditedViewSaved = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.editedViewSaved;
};
