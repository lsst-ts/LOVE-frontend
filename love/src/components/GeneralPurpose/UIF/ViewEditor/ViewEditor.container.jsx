import React from 'react';
import { connect } from 'react-redux';
import { getEditedView } from '../../../../redux/selectors';
import { updateEditedView } from '../../../../redux/actions/uif';
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
  return { editedView };
};

const mapDispatchToProps = (dispatch) => ({
  updateEditedView: (view) => dispatch(updateEditedView(view)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorContainer);
