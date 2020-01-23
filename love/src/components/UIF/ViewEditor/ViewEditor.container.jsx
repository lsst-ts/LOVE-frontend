import React from 'react';
import { connect } from 'react-redux';
import { getEditedViewCurrent, getEditedViewStatus, getEditedViewSaved, getViewsStatus } from '../../../redux/selectors';
import { updateEditedView, saveEditedView, clearViewToEdit, loadViewToEdit } from '../../../redux/actions/uif';
import ViewEditor from './ViewEditor';

const ViewEditorContainer = ({...props }) => {
  return (
    <ViewEditor
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const editedViewCurrent = getEditedViewCurrent(state);
  const editedViewStatus = getEditedViewStatus(state);
  const editedViewSaved = getEditedViewSaved(state);
  const viewsStatus = getViewsStatus(state);
  return { editedViewCurrent, editedViewStatus, editedViewSaved, viewsStatus };
};

const mapDispatchToProps = (dispatch) => ({
  updateEditedView: (view) => dispatch(updateEditedView(view)),
  loadViewToEdit: (view) => dispatch(loadViewToEdit(view)),
  clearViewToEdit: () => dispatch(clearViewToEdit),
  saveEditedView: () => dispatch(saveEditedView()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorContainer);
