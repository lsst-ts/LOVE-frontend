import React from 'react';
import { connect } from 'react-redux';

const TelemetryLogContainer = ({token}) => {
    console.log(token);
  return (
    <>
      <h1>TelemetryLog</h1>
      <div>{token}</div>
    </>
  );
};

TelemetryLogContainer.defaultProps = {
    token: 'asd'
}
const mapStateToProps = (state) => {
  return {token: state.auth.token}
};

export default connect(mapStateToProps, null)(TelemetryLogContainer);
