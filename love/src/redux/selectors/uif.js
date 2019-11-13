
export const getWorkspaces = (state) => {
  if (state.uif === undefined) return undefined;
  return state.uif.workspaces;
};
