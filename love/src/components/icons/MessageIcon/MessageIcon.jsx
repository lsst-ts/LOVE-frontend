/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MessageIcon.module.css';

export default class MessageIcon extends Component {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    className: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg
        id="Message"
        data-name="Message"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 26.36 25"
        className={[styles.fill, this.props.className].join(' ')}
      >
        <rect className={styles.fill} width="26.36" height="18.09" rx="5.82" />
        <path
          className={[styles.fill, this.props.className].join(' ')}
          d="M8.46,14.81l9.76,9.76a1.47,1.47,0,0,0,2.5-1v-10A1.46,1.46,0,0,0,19.21,12l-9.76.28A1.46,1.46,0,0,0,8.46,14.81Z"
        />
      </svg>
    );
  }
}
