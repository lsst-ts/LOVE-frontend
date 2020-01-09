
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
  const id = state.uif.current_workspace;
  return state.uif.workspaces.find(function(workspace) {
    return workspace.id === id;
  });
};


/**
 * Return the current state of the view under edition
 *
 * @param  {object} state  the state
 * @return {array}        the list of views
 */
export const getEditedView = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.edited_view;
};
