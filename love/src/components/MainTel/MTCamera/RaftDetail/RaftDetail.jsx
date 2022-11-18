import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RaftDetail extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: 'red',
          borderColor: 'red',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>RaftDetail component</span>
      </div>
    );
  }
}

export default RaftDetail;
