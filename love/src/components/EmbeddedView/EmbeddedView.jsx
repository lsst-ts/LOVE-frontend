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
import styles from './EmbeddedView.module.css';

export default class EmbeddedView extends Component {
  static propTypes = {
    url: PropTypes.string,
  };

  render() {
    return (
      <div className={styles.container}>
        <iframe
          id="ytplayer"
          type="text/html"
          className={styles.iframeElement}
          src={this.props.url}
          frameBorder="0"
          title={this.props.url}
        ></iframe>
      </div>
    );
  }
}
