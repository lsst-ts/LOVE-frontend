
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
 * Return the current workspace from the state
 *
 * @param  {object} state  the state
 * @return {array}        the current workspace
 */
export const getCurrentWorkspace = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.current_workspace;
};
