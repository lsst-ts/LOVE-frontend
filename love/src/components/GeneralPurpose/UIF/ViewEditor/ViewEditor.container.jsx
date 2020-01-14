import React from 'react';
import { connect } from 'react-redux';
import { getEditedView, getEditedViewStatus, getEditedViewData } from '../../../../redux/selectors';
import { updateEditedView, saveEditedView } from '../../../../redux/actions/uif';
import ViewEditor from './ViewEditor';

const ViewEditorContainer = ({...props }) => {
  return (
    <ViewEditor
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const editedView = getEditedView(state);
  const editedViewStatus = getEditedViewStatus(state);
  const editedViewData = getEditedViewData(state);
  return { editedView, editedViewStatus, editedViewData };
};

const mapDispatchToProps = (dispatch) => ({
  updateEditedView: (view) => dispatch(updateEditedView(view)),
  saveEditedView: (view) => dispatch(saveEditedView(view)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorContainer);
