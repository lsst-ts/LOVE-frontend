/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import styles from './Collapse.module.css';

export default class Collapse extends Component {
  static propTypes = {
    /** Props for the state variable used for the change between open and closed of the collapsed div */
    isOpen: PropTypes.bool.isRequired,
    /** Max Height size of the children component */
    childrenMaxHeight: PropTypes.number.isRequired,
    /** Content of the inner the collapse div */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  static defaultProps = {
    isOpen: false,
    childrenMaxHeight: undefined,
    children: <></>,
  };

  constructor(props) {
    super(props);
    this.state = {
      childHeight: 0,
    };
  }

  componentDidMount() {
    const childHeightRaw = this.content.clientHeight;
    const childHeight = `${childHeightRaw / 16}rem`;
    this.setState({ childHeight: this.props.childrenMaxHeight ?? childHeight });
  }

  render() {
    const { children, isOpen } = this.props;
    const { childHeight } = this.state;

    return (
      <div
        className={styles.collapse}
        style={{
          maxHeight: isOpen ? childHeight : 0,
        }}
      >
        <div ref={(content) => (this.content = content)}>{children}</div>
      </div>
    );
  }
}
