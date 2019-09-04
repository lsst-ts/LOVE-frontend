import React from 'react';
import { connect } from 'react-redux';
import MountDetail from './MountDetail';
const MountDetailContainer = () => {
  return <MountDetail />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MountDetailContainer);
