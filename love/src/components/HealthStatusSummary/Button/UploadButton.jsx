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
import styles from './Button.module.css';
import ImportIcon from '../../icons/ImportIcon/ImportIcon';

export default class UploadButton extends Component {
  static propTypes = {
    onLoadFile: PropTypes.func,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    iconClassName: PropTypes.string,
  };

  onChange = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => this.props.onLoadFile(e.target.result);
    reader.readAsText(event.target.files[0]);
  };

  render() {
    const classNames = [styles.button, styles.uploadButton, this.props.className].join(' ');
    const labelClassNames = [styles.inputFileTrigger, this.props.labelClassName].join(' ');
    return (
      <form action="#">
        <div className={classNames}>
          <input onChange={this.onChange} type="file" id="my-file" className={styles.customFileInput} />
          <label tabIndex="0" htmlFor="my-file" className={labelClassNames}>
            <ImportIcon className={this.props.iconClassName} />
            Import
          </label>
        </div>
      </form>
    );
  }
}
