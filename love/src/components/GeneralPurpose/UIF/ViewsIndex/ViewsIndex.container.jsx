import React from 'react';
import { connect } from 'react-redux';
import ViewsIndex from './ViewsIndex';
import { getViews } from '../../../../redux/selectors/uif';

const ViewsIndexContainer = ({ ...props }) => {
  return <ViewsIndex {...props} />;
};

const mapStateToProps = (state) => ({
  views: getViews(state),
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewsIndexContainer);
