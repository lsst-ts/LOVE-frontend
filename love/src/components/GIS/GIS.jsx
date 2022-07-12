import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GIS extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    return (
      <div>
        <span>GIS</span>
      </div>
    );
  }
}
