import React from 'react';
import { connect } from 'react-redux';
import CSCDetail from './CSCDetail';

const CSCDetailContainer = ({ realm, group, name, salindex, data, onCSCClick }) => {
  return <CSCDetail
    realm={realm}
    group={name}
    name={name}
    salindex={salindex}
    data={data}
    onCSCClick={onCSCClick}
  />;
};

const mapStateToProps = (state) => {};

const mapDispatchToProps = (dispatch) => {};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCDetailContainer);
