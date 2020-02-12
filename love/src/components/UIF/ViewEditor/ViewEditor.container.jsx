import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import {
  getEditedViewCurrent,
  getEditedViewStatus,
  getEditedViewSaved,
  getViewsStatus,
  getUndoActionsAvailable,
  getRedoActionsAvailable,
} from '../../../redux/selectors';
import { updateEditedView, saveEditedView, clearViewToEdit, loadViewToEdit, requestViewToEdit, changeMode } from '../../../redux/actions/uif';
import ViewEditor from './ViewEditor';

const ViewEditorContainer = ({ ...props }) => {
  return <ViewEditor {...props} />;
};

const mapStateToProps = (state) => {
  const editedViewCurrent = getEditedViewCurrent(state);
  const editedViewStatus = getEditedViewStatus(state);
  const editedViewSaved = getEditedViewSaved(state);
  const viewsStatus = getViewsStatus(state);
  const undoActionsAvailable = getUndoActionsAvailable(state);
  const redoActionsAvailable = getRedoActionsAvailable(state);
  return {
    editedViewCurrent,
    editedViewStatus,
    editedViewSaved,
    viewsStatus,
    undoActionsAvailable,
    redoActionsAvailable,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateEditedView: (view) => dispatch(updateEditedView(view)),
  loadViewToEdit: (view) => {
    dispatch(loadViewToEdit(view));
    dispatch(ActionCreators.clearHistory());
  },
  requestViewToEdit: (view) => {
    dispatch(requestViewToEdit(view));
  },
  clearViewToEdit: () => dispatch(clearViewToEdit),
  saveEditedView: (thumbnail) => dispatch(saveEditedView(thumbnail)),
  undo: () => dispatch(ActionCreators.undo()),
  redo: () => dispatch(ActionCreators.redo()),
  changeMode: (mode) => dispatch(changeMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditorContainer);
