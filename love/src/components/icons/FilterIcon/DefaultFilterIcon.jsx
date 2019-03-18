import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DefaultFilterIcon extends Component {
  static propTypes = {
    style: PropTypes.string,
  };

  render() {
    return (
            <svg className={this.props.style} viewBox='0 0 18 18'>
                <g>
                    <line x1="6.29" y1="13.7" x2="11.58" y2="13.7" />
                    <line x1="4.53" y1="9.29" x2="13.34" y2="9.29" />
                    <line x1="1" y1="4" x2="16.87" y2="4" />
                </g>
            </svg>
    );
  }
}
