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
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import { defaultNumberFormatter } from 'Utils';
import styles from './Mixing.module.css';
import message from 'components/ScriptQueue/QueueMessage';

export default class Mixing extends Component {
  static propTypes = {
    /** Value of valve position for see in progress bar. */
    value: PropTypes.number,
  };
  static defaultProps = {
    value: 0,
  };

  render() {
    const { value } = this.props;
    return (
      <>
        <div className={styles.containerTop}>
          <span className={styles.title}>Mixing Value</span>
        </div>
        <div>
          <ProgressBar completed={value} height={36} hideCompleted={true} />
        </div>
        <div className={styles.containerBottom}>
          <span className={styles.labelValue} style={{ left: 0 }}>
            <span className={styles.label}>Valve Position </span>
            <span className={styles.value}>{`${defaultNumberFormatter(value, 1)}%`}</span>
          </span>
        </div>
      </>
    );
  }
}
