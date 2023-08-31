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
import {
  updateEditedView,
  saveEditedView,
  clearViewToEdit,
  loadViewToEdit,
  requestViewToEdit,
  changeMode,
} from '../../../redux/actions/uif';
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
  requestViewToEdit: (view) => dispatch(requestViewToEdit(view)),
  clearViewToEdit: () => dispatch(clearViewToEdit),
  saveEditedView: (thumbnail) => dispatch(saveEditedView(thumbnail)),
  undo: () => dispatch(ActionCreators.undo()),
  redo: () => dispatch(ActionCreators.redo()),
  changeMode: (mode) => dispatch(changeMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditorContainer);
