import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ActiveFilterIcon extends Component {
  static propTypes = {
    style: PropTypes.string,
  };

  render() {
    return (
            <svg className={this.props.style} viewBox='0 0 18 18'>
                <path d="M16.94,1.44A.68.68,0,0,0,16.27,1H1.73a.68.68,0,0,0-.67.44.67.67,0,0,0,.16.8l5.6,5.6V13a.7.7,0,0,0,.22.52l2.9,3.26a.67.67,0,0,0,.51.22.79.79,0,0,0,.29-.06.68.68,0,0,0,.44-.67V7.84l5.6-5.6A.67.67,0,0,0,16.94,1.44Z" />
            </svg>
    );
  }
}
