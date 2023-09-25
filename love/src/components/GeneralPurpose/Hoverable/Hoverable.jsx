/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Trigger from './Trigger';
import Float from './Float';

/**
 * Makes a component display another when the first is hovered.
 * Receives two children: the first one is the element that triggers the display of the second
 * The second children is optional, so the hover effect can betemporarily disabled by passing
 * a falsy value.
 */

export default class Hoverable extends Component {
  static propTypes = {
    /** Display float component top */
    top: PropTypes.bool,
    /** Display float component middle (vertical) */
    middle: PropTypes.bool,
    /** Display float component bottom */
    bottom: PropTypes.bool,
    /** Display float component left */
    left: PropTypes.bool,
    /** Display float component center (horizontally) */
    center: PropTypes.bool,
    /** Display float component right */
    right: PropTypes.bool,
    /** Indicates if second component should be placed inside the first */
    inside: PropTypes.bool,
  };

  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      position: [0, 0],
    };
  }

  setPosition = (position) => {
    this.setState({
      position,
    });
  };

  show = (pos) => {
    if (!this.state.display) {
      this.setState({
        display: true,
      });
      if (pos)
        this.setState({
          position: pos,
        });
    }
  };

  hide = () => {
    this.setState({
      display: false,
    });
  };

  render() {
    return (
      <>
        <Trigger {...this.props} show={this.show} hide={this.hide} setPosition={this.state.setPosition}>
          {this.props.children[0]}
          {this.state.display && this.props.inside && (
            <Float {...this.props} hide={this.hide} position={this.state.position}>
              {this.props.children[1]}
            </Float>
          )}
        </Trigger>

        {this.props.children[1] && this.state.display && !this.props.inside && (
          <Float {...this.props} hide={this.hide} position={this.state.position}>
            {this.props.children[1]}
          </Float>
        )}
      </>
    );
  }
}
